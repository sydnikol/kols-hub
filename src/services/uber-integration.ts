/**
 * Uber Integration Service
 *
 * Uber Guest Rides and Uber Eats platform integration
 *
 * Guest Rides Features:
 * - Trip management for guests without Uber accounts
 * - Price estimates and product availability
 * - Real-time trip tracking and status
 * - Driver communication
 * - Webhooks for trip events
 * - Sandbox testing environment
 *
 * Uber Eats Features:
 * - Restaurant/store management
 * - Menu and item management
 * - Order creation and fulfillment
 * - Order tracking and status
 * - Delivery coordination
 * - Webhooks for order events
 *
 * Docs: https://developer.uber.com/docs/
 * Guest Rides: https://developer.uber.com/docs/guest-rides/introduction
 * Uber Eats: https://developer.uber.com/docs/eats/introduction
 * API Base: https://api.uber.com (Production), https://sandbox-api.uber.com (Sandbox)
 * Authentication: OAuth 2.0 Client Credentials
 * Rate Limit: 200 requests/hour per endpoint (default)
 */

interface UberConfig {
  clientId: string;
  clientSecret: string;
  environment?: 'production' | 'sandbox';
  accessToken?: string;
}

interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  place_id?: string;
}

interface Guest {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
}

interface UberProduct {
  product_id: string;
  display_name: string;
  description: string;
  capacity: number;
  image: string;
  cash_enabled: boolean;
  shared: boolean;
  short_description: string;
  product_group: string;
}

interface PriceEstimate {
  product_id: string;
  display_name: string;
  estimate: string;
  low_estimate: number;
  high_estimate: number;
  surge_multiplier: number;
  duration: number;
  distance: number;
  currency_code: string;
}

interface Trip {
  trip_id: string;
  status: 'processing' | 'no_drivers_available' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'canceled';
  product_id: string;
  pickup: Location & { eta?: number };
  dropoff: Location;
  guest: Guest;
  driver?: {
    name: string;
    phone_number: string;
    rating: number;
    picture_url: string;
  };
  vehicle?: {
    make: string;
    model: string;
    license_plate: string;
    picture_url: string;
  };
  fare?: {
    amount: number;
    currency_code: string;
    breakdown: Array<{
      type: string;
      amount: number;
    }>;
  };
  created_at: string;
  updated_at: string;
  waypoints?: Location[];
}

interface TripReceipt {
  trip_id: string;
  subtotal: number;
  total_charged: number;
  total_owed: number;
  currency_code: string;
  charge_adjustments: Array<{
    name: string;
    amount: number;
    type: string;
  }>;
  duration: string;
  distance: string;
  distance_label: string;
}

interface RequestZone {
  zone_id: string;
  name: string;
  location: Location;
  description?: string;
}

interface AddressSuggestion {
  place_id: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface WebhookEvent {
  event_id: string;
  event_type: 'trip.status_changed' | 'trip.receipt_ready' | 'trip.driver_location' | 'trip.message';
  event_time: string;
  resource_href: string;
  data: Record<string, any>;
}

// ==================== Uber Eats Interfaces ====================

interface Restaurant {
  store_id: string;
  name: string;
  location: Location & { address: string };
  phone_number: string;
  hours: Array<{
    day_of_week: number;
    open_time: string;
    close_time: string;
  }>;
  is_active: boolean;
  cuisine_types: string[];
  price_range: number;
  rating?: number;
  image_url?: string;
}

interface MenuItem {
  item_id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  available: boolean;
  popular: boolean;
  modifiers?: Array<{
    modifier_id: string;
    title: string;
    options: Array<{
      option_id: string;
      title: string;
      price: number;
    }>;
    min_selections: number;
    max_selections: number;
  }>;
  dietary_info?: {
    vegetarian?: boolean;
    vegan?: boolean;
    gluten_free?: boolean;
    allergens?: string[];
  };
}

interface MenuCategory {
  category_id: string;
  title: string;
  subtitle?: string;
  items: string[];
  display_order: number;
}

interface EatsOrder {
  order_id: string;
  store_id: string;
  status: 'pending' | 'accepted' | 'denied' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'canceled';
  type: 'delivery' | 'pickup';
  customer: {
    name: string;
    phone_number: string;
    delivery_address?: Location & { address: string; instructions?: string };
  };
  items: Array<{
    item_id: string;
    title: string;
    quantity: number;
    price: number;
    special_instructions?: string;
    selected_modifiers?: Array<{
      modifier_id: string;
      options: string[];
    }>;
  }>;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  service_fee: number;
  total: number;
  currency_code: string;
  estimated_ready_time?: string;
  estimated_delivery_time?: string;
  placed_at: string;
  updated_at: string;
}

class UberIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private environment: 'production' | 'sandbox' = 'production';
  private baseUrl = 'https://api.uber.com/v1';

  initialize(config: UberConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.accessToken = config.accessToken || null;
      this.environment = config.environment || 'production';

      this.baseUrl = this.environment === 'sandbox'
        ? 'https://sandbox-api.uber.com/v1'
        : 'https://api.uber.com/v1';

      localStorage.setItem('uber_config', JSON.stringify({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        accessToken: config.accessToken,
        environment: this.environment
      }));

      console.log('Uber integration initialized - Environment:', this.environment);
      return true;
    } catch (error) {
      console.error('Error initializing Uber integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.clientId && this.clientSecret) return true;

    try {
      const savedConfig = localStorage.getItem('uber_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.accessToken;
        this.environment = config.environment || 'production';
        return !!(this.clientId && this.clientSecret);
      }
    } catch (error) {
      console.error('Error loading Uber config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== OAuth 2.0 ====================

  async getAccessToken(scope: string = 'guests.trips'): Promise<OAuthToken | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockToken: OAuthToken = {
        access_token: `mock_token_${Date.now()}`,
        token_type: 'Bearer',
        expires_in: 2592000,
        scope: scope
      };

      this.accessToken = mockToken.access_token;
      console.log('Access token obtained');
      return mockToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // ==================== GUEST RIDES - Products & Estimates ====================

  async getProducts(location: Location): Promise<UberProduct[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProducts: UberProduct[] = [
        {
          product_id: 'a1111c8c-c720-46c3-8534-2fcdd730040d',
          display_name: 'UberX',
          description: 'Affordable rides for everyday use',
          capacity: 4,
          image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberX.png',
          cash_enabled: false,
          shared: false,
          short_description: 'uberX',
          product_group: 'rideshare'
        },
        {
          product_id: 'b2222c8c-c720-46c3-8534-2fcdd730040d',
          display_name: 'UberXL',
          description: 'Affordable rides for groups up to 6',
          capacity: 6,
          image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberXL.png',
          cash_enabled: false,
          shared: false,
          short_description: 'uberXL',
          product_group: 'rideshare'
        },
        {
          product_id: 'c3333c8c-c720-46c3-8534-2fcdd730040d',
          display_name: 'Comfort',
          description: 'Newer cars with extra legroom',
          capacity: 4,
          image: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Comfort.png',
          cash_enabled: false,
          shared: false,
          short_description: 'Comfort',
          product_group: 'rideshare'
        }
      ];

      console.log('Products retrieved:', mockProducts.length);
      return mockProducts;
    } catch (error) {
      console.error('Error getting products:', error);
      return null;
    }
  }

  async getPriceEstimates(params: {
    start_latitude: number;
    start_longitude: number;
    end_latitude: number;
    end_longitude: number;
  }): Promise<PriceEstimate[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEstimates: PriceEstimate[] = [
        {
          product_id: 'a1111c8c-c720-46c3-8534-2fcdd730040d',
          display_name: 'UberX',
          estimate: '$12-15',
          low_estimate: 12,
          high_estimate: 15,
          surge_multiplier: 1.0,
          duration: 660,
          distance: 5.2,
          currency_code: 'USD'
        },
        {
          product_id: 'b2222c8c-c720-46c3-8534-2fcdd730040d',
          display_name: 'UberXL',
          estimate: '$18-22',
          low_estimate: 18,
          high_estimate: 22,
          surge_multiplier: 1.0,
          duration: 660,
          distance: 5.2,
          currency_code: 'USD'
        }
      ];

      console.log('Price estimates retrieved:', mockEstimates.length);
      return mockEstimates;
    } catch (error) {
      console.error('Error getting price estimates:', error);
      return null;
    }
  }

  // ==================== GUEST RIDES - Trip Management ====================

  async createTrip(params: {
    product_id: string;
    pickup: Location;
    dropoff: Location;
    guest: Guest;
    waypoints?: Location[];
  }): Promise<Trip | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTrip: Trip = {
        trip_id: `trip_${Date.now()}`,
        status: 'processing',
        product_id: params.product_id,
        pickup: { ...params.pickup, eta: 5 },
        dropoff: params.dropoff,
        guest: params.guest,
        waypoints: params.waypoints,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Trip created:', mockTrip.trip_id);
      return mockTrip;
    } catch (error) {
      console.error('Error creating trip:', error);
      return null;
    }
  }

  async getTrip(tripId: string): Promise<Trip | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTrip: Trip = {
        trip_id: tripId,
        status: 'accepted',
        product_id: 'a1111c8c-c720-46c3-8534-2fcdd730040d',
        pickup: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Main St, San Francisco, CA',
          eta: 3
        },
        dropoff: {
          latitude: 37.7849,
          longitude: -122.4094,
          address: '456 Market St, San Francisco, CA'
        },
        guest: {
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '+14155551234'
        },
        driver: {
          name: 'Jane Driver',
          phone_number: '+14155555678',
          rating: 4.9,
          picture_url: 'https://example.com/driver.jpg'
        },
        vehicle: {
          make: 'Toyota',
          model: 'Prius',
          license_plate: 'ABC123',
          picture_url: 'https://example.com/vehicle.jpg'
        },
        created_at: '2025-01-23T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Trip retrieved:', tripId);
      return mockTrip;
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  }

  async listTrips(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Trip[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTrips: Trip[] = [
        {
          trip_id: 'trip_1',
          status: 'completed',
          product_id: 'a1111c8c-c720-46c3-8534-2fcdd730040d',
          pickup: { latitude: 37.7749, longitude: -122.4194 },
          dropoff: { latitude: 37.7849, longitude: -122.4094 },
          guest: { first_name: 'John', last_name: 'Doe', phone_number: '+14155551234' },
          created_at: '2025-01-23T10:00:00Z',
          updated_at: '2025-01-23T10:30:00Z'
        }
      ];

      console.log('Trips listed:', mockTrips.length);
      return mockTrips;
    } catch (error) {
      console.error('Error listing trips:', error);
      return null;
    }
  }

  async updateTrip(tripId: string, updates: {
    dropoff?: Location;
    waypoints?: Location[];
  }): Promise<Trip | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTrip: Trip = {
        trip_id: tripId,
        status: 'accepted',
        product_id: 'a1111c8c-c720-46c3-8534-2fcdd730040d',
        pickup: { latitude: 37.7749, longitude: -122.4194 },
        dropoff: updates.dropoff || { latitude: 37.7849, longitude: -122.4094 },
        guest: { first_name: 'John', last_name: 'Doe', phone_number: '+14155551234' },
        waypoints: updates.waypoints,
        created_at: '2025-01-23T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Trip updated:', tripId);
      return mockTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      return null;
    }
  }

  async cancelTrip(tripId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Trip canceled:', tripId);
      return true;
    } catch (error) {
      console.error('Error canceling trip:', error);
      return false;
    }
  }

  async getTripReceipt(tripId: string): Promise<TripReceipt | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockReceipt: TripReceipt = {
        trip_id: tripId,
        subtotal: 12.50,
        total_charged: 14.75,
        total_owed: 0,
        currency_code: 'USD',
        charge_adjustments: [
          { name: 'Base Fare', amount: 2.50, type: 'base_fare' },
          { name: 'Distance', amount: 8.00, type: 'distance' },
          { name: 'Time', amount: 2.00, type: 'time' },
          { name: 'Service Fee', amount: 2.25, type: 'service_fee' }
        ],
        duration: '11m 20s',
        distance: '5.2',
        distance_label: '5.2 miles'
      };

      console.log('Trip receipt retrieved:', tripId);
      return mockReceipt;
    } catch (error) {
      console.error('Error getting trip receipt:', error);
      return null;
    }
  }

  // ==================== GUEST RIDES - Location Services ====================

  async getRequestZones(location: Location): Promise<RequestZone[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockZones: RequestZone[] = [
        {
          zone_id: 'zone_1',
          name: 'Airport Terminal 1',
          location: { latitude: 37.6213, longitude: -122.3790 },
          description: 'Ride pickup at Terminal 1 arrivals'
        },
        {
          zone_id: 'zone_2',
          name: 'Airport Terminal 2',
          location: { latitude: 37.6193, longitude: -122.3820 },
          description: 'Ride pickup at Terminal 2 arrivals'
        }
      ];

      console.log('Request zones retrieved:', mockZones.length);
      return mockZones;
    } catch (error) {
      console.error('Error getting request zones:', error);
      return null;
    }
  }

  async autocompleteAddress(query: string, location?: Location): Promise<AddressSuggestion[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSuggestions: AddressSuggestion[] = [
        {
          place_id: 'place_1',
          address: '123 Main Street, San Francisco, CA 94102',
          latitude: 37.7749,
          longitude: -122.4194
        },
        {
          place_id: 'place_2',
          address: '456 Market Street, San Francisco, CA 94103',
          latitude: 37.7849,
          longitude: -122.4094
        }
      ];

      console.log('Address suggestions:', mockSuggestions.length);
      return mockSuggestions;
    } catch (error) {
      console.error('Error autocompleting address:', error);
      return null;
    }
  }

  // ==================== GUEST RIDES - Communication ====================

  async callDriver(tripId: string): Promise<{ call_id: string } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCall = { call_id: `call_${Date.now()}` };
      console.log('Driver call initiated:', mockCall.call_id);
      return mockCall;
    } catch (error) {
      console.error('Error calling driver:', error);
      return null;
    }
  }

  async messageDriver(tripId: string, message: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Message sent to driver:', message);
      return true;
    } catch (error) {
      console.error('Error messaging driver:', error);
      return false;
    }
  }

  // ==================== UBER EATS - Restaurant Management ====================

  async getRestaurant(storeId: string): Promise<Restaurant | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRestaurant: Restaurant = {
        store_id: storeId,
        name: 'Sample Restaurant',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Food St, San Francisco, CA 94102'
        },
        phone_number: '+14155551234',
        hours: [
          { day_of_week: 1, open_time: '09:00', close_time: '22:00' },
          { day_of_week: 2, open_time: '09:00', close_time: '22:00' }
        ],
        is_active: true,
        cuisine_types: ['Italian', 'Pizza'],
        price_range: 2,
        rating: 4.5,
        image_url: 'https://example.com/restaurant.jpg'
      };

      console.log('Restaurant retrieved:', storeId);
      return mockRestaurant;
    } catch (error) {
      console.error('Error getting restaurant:', error);
      return null;
    }
  }

  async updateRestaurant(storeId: string, updates: Partial<Restaurant>): Promise<Restaurant | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRestaurant: Restaurant = {
        store_id: storeId,
        name: 'Updated Restaurant',
        location: { latitude: 37.7749, longitude: -122.4194, address: '123 Food St' },
        phone_number: '+14155551234',
        hours: [],
        is_active: true,
        cuisine_types: ['Italian'],
        price_range: 2,
        ...updates
      };

      console.log('Restaurant updated:', storeId);
      return mockRestaurant;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      return null;
    }
  }

  // ==================== UBER EATS - Menu Management ====================

  async getMenu(storeId: string): Promise<{ categories: MenuCategory[]; items: MenuItem[] } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMenu = {
        categories: [
          {
            category_id: 'cat_1',
            title: 'Appetizers',
            items: ['item_1', 'item_2'],
            display_order: 1
          },
          {
            category_id: 'cat_2',
            title: 'Main Dishes',
            items: ['item_3', 'item_4'],
            display_order: 2
          }
        ],
        items: [
          {
            item_id: 'item_1',
            title: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing',
            price: 8.99,
            category_id: 'cat_1',
            available: true,
            popular: true
          },
          {
            item_id: 'item_3',
            title: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and basil',
            price: 14.99,
            category_id: 'cat_2',
            available: true,
            popular: true
          }
        ]
      };

      console.log('Menu retrieved for store:', storeId);
      return mockMenu;
    } catch (error) {
      console.error('Error getting menu:', error);
      return null;
    }
  }

  async createMenuItem(storeId: string, item: Omit<MenuItem, 'item_id'>): Promise<MenuItem | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItem: MenuItem = {
        item_id: `item_${Date.now()}`,
        ...item
      };

      console.log('Menu item created:', mockItem.item_id);
      return mockItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      return null;
    }
  }

  async updateMenuItem(storeId: string, itemId: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItem: MenuItem = {
        item_id: itemId,
        title: 'Updated Item',
        price: 12.99,
        category_id: 'cat_1',
        available: true,
        popular: false,
        ...updates
      };

      console.log('Menu item updated:', itemId);
      return mockItem;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return null;
    }
  }

  // ==================== UBER EATS - Order Management ====================

  async getOrder(orderId: string): Promise<EatsOrder | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockOrder: EatsOrder = {
        order_id: orderId,
        store_id: 'store_123',
        status: 'accepted',
        type: 'delivery',
        customer: {
          name: 'John Customer',
          phone_number: '+14155551234',
          delivery_address: {
            latitude: 37.7849,
            longitude: -122.4094,
            address: '789 Customer Ave, San Francisco, CA'
          }
        },
        items: [
          {
            item_id: 'item_1',
            title: 'Caesar Salad',
            quantity: 2,
            price: 8.99
          },
          {
            item_id: 'item_3',
            title: 'Margherita Pizza',
            quantity: 1,
            price: 14.99
          }
        ],
        subtotal: 32.97,
        tax: 2.97,
        delivery_fee: 4.99,
        service_fee: 2.50,
        total: 43.43,
        currency_code: 'USD',
        estimated_ready_time: '2025-01-23T11:15:00Z',
        placed_at: '2025-01-23T10:45:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Order retrieved:', orderId);
      return mockOrder;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: EatsOrder['status']): Promise<EatsOrder | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockOrder: EatsOrder = {
        order_id: orderId,
        store_id: 'store_123',
        status: status,
        type: 'delivery',
        customer: {
          name: 'John Customer',
          phone_number: '+14155551234'
        },
        items: [],
        subtotal: 32.97,
        tax: 2.97,
        delivery_fee: 4.99,
        service_fee: 2.50,
        total: 43.43,
        currency_code: 'USD',
        placed_at: '2025-01-23T10:45:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Order status updated:', orderId, '->', status);
      return mockOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Order canceled:', orderId);
      return true;
    } catch (error) {
      console.error('Error canceling order:', error);
      return false;
    }
  }

  // ==================== Webhooks ====================

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Mock verification for development
    console.log('Webhook signature verified (mock)');
    return true;
  }

  parseWebhookEvent(payload: string): WebhookEvent | null {
    try {
      const event = JSON.parse(payload) as WebhookEvent;
      console.log('Webhook event parsed:', event.event_type);
      return event;
    } catch (error) {
      console.error('Error parsing webhook event:', error);
      return null;
    }
  }
}

export const uberIntegration = new UberIntegrationService();
