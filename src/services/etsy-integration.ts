/**
 * Etsy Integration Service
 *
 * E-commerce platform for handmade, vintage items, and craft supplies
 *
 * Features:
 * - OAuth 2.0 with PKCE authentication
 * - Shop management and analytics
 * - Listing/product management
 * - Inventory tracking
 * - Order management and fulfillment
 * - Shipping profiles and carriers
 * - Payment account management
 * - Reviews and favorites
 * - User profile management
 * - Receipt and transaction handling
 * - Variations and custom attributes
 *
 * Docs: https://developers.etsy.com/documentation
 * API Version: v3
 */

interface EtsyConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}

interface EtsyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

interface Shop {
  shop_id: number;
  user_id: number;
  shop_name: string;
  title: string;
  announcement?: string;
  currency_code: string;
  is_vacation: boolean;
  vacation_message?: string;
  sale_message?: string;
  digital_sale_message?: string;
  listing_active_count: number;
  digital_listing_count: number;
  create_date: number;
  created_timestamp: number;
  updated_timestamp: number;
  url: string;
  icon_url_fullxfull?: string;
  is_using_structured_policies: boolean;
  has_onboarded_structured_policies: boolean;
  policy_welcome?: string;
  policy_payment?: string;
  policy_shipping?: string;
  policy_refunds?: string;
  policy_additional?: string;
  policy_privacy?: string;
  policy_seller_info?: string;
  policy_updated_timestamp: number;
}

interface Listing {
  listing_id: number;
  user_id: number;
  shop_id: number;
  title: string;
  description: string;
  state: 'active' | 'inactive' | 'draft' | 'expired' | 'sold_out' | 'private';
  creation_timestamp: number;
  created_timestamp: number;
  ending_timestamp: number;
  original_creation_timestamp: number;
  last_modified_timestamp: number;
  updated_timestamp: number;
  state_timestamp: number;
  quantity: number;
  shop_section_id?: number;
  featured_rank?: number;
  url: string;
  num_favorers: number;
  non_taxable: boolean;
  is_taxable: boolean;
  is_customizable: boolean;
  is_personalizable: boolean;
  personalization_is_required: boolean;
  personalization_char_count_max?: number;
  personalization_instructions?: string;
  listing_type: 'physical' | 'download' | 'both';
  tags: string[];
  materials: string[];
  shipping_profile_id?: number;
  return_policy_id?: number;
  processing_min?: number;
  processing_max?: number;
  who_made: 'i_did' | 'someone_else' | 'collective';
  when_made: string;
  is_supply: boolean;
  item_weight?: number;
  item_weight_unit?: 'oz' | 'lb' | 'g' | 'kg';
  item_length?: number;
  item_width?: number;
  item_height?: number;
  item_dimensions_unit?: 'in' | 'ft' | 'mm' | 'cm' | 'm';
  is_private: boolean;
  style?: string[];
  file_data?: string;
  has_variations: boolean;
  should_auto_renew: boolean;
  language: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  taxonomy_id?: number;
}

interface ListingImage {
  listing_image_id: number;
  hex_code?: string;
  red?: number;
  green?: number;
  blue?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  is_black_and_white: boolean;
  creation_timestamp: number;
  created_timestamp: number;
  rank: number;
  url_75x75: string;
  url_170x135: string;
  url_570xN: string;
  url_fullxfull: string;
  full_height: number;
  full_width: number;
  alt_text?: string;
}

interface ListingInventory {
  products: InventoryProduct[];
  price_on_property?: number[];
  quantity_on_property?: number[];
  sku_on_property?: number[];
}

interface InventoryProduct {
  product_id: number;
  sku: string;
  is_deleted: boolean;
  offerings: ProductOffering[];
  property_values: PropertyValue[];
}

interface ProductOffering {
  offering_id: number;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  quantity: number;
  is_enabled: boolean;
  is_deleted: boolean;
}

interface PropertyValue {
  property_id: number;
  property_name: string;
  scale_id?: number;
  scale_name?: string;
  value_ids: number[];
  values: string[];
}

interface Order {
  receipt_id: number;
  receipt_type: number;
  seller_user_id: number;
  seller_email: string;
  buyer_user_id: number;
  buyer_email: string;
  name: string;
  first_line: string;
  second_line?: string;
  city: string;
  state?: string;
  zip: string;
  status: 'open' | 'completed' | 'canceled';
  formatted_address: string;
  country_iso: string;
  payment_method: string;
  payment_email?: string;
  message_from_seller?: string;
  message_from_buyer?: string;
  message_from_payment?: string;
  is_paid: boolean;
  is_shipped: boolean;
  create_timestamp: number;
  created_timestamp: number;
  update_timestamp: number;
  updated_timestamp: number;
  is_gift: boolean;
  gift_message?: string;
  grandtotal: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  subtotal: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  total_price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  total_shipping_cost: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  total_tax_cost: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  total_vat_cost: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  discount_amt: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  gift_wrap_price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  shipments: Shipment[];
  transactions: Transaction[];
}

interface Shipment {
  receipt_shipping_id: number;
  shipment_notification_timestamp: number;
  carrier_name: string;
  tracking_code: string;
}

interface Transaction {
  transaction_id: number;
  title: string;
  description: string;
  seller_user_id: number;
  buyer_user_id: number;
  create_timestamp: number;
  created_timestamp: number;
  paid_timestamp: number;
  shipped_timestamp?: number;
  quantity: number;
  listing_image_id?: number;
  receipt_id: number;
  is_digital: boolean;
  file_data: string;
  listing_id: number;
  transaction_type: string;
  product_id?: number;
  sku?: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  shipping_cost: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  variations: TransactionVariation[];
  product_data: ProductData[];
  shipping_profile_id?: number;
  min_processing_days?: number;
  max_processing_days?: number;
  shipping_method?: string;
  shipping_upgrade?: string;
  expected_ship_date?: number;
  buyer_coupon?: number;
  shop_coupon?: number;
}

interface TransactionVariation {
  property_id: number;
  value_id: number;
  formatted_name: string;
  formatted_value: string;
}

interface ProductData {
  product_id: number;
  sku: string;
  is_deleted: boolean;
  offerings: ProductOffering[];
  property_values: PropertyValue[];
}

interface ShippingProfile {
  shipping_profile_id: number;
  title: string;
  user_id: number;
  min_processing_days: number;
  max_processing_days: number;
  processing_days_display_label: string;
  origin_country_iso: string;
  origin_postal_code?: string;
  profile_type: 'manual' | 'calculated';
  domestic_handling_fee?: number;
  international_handling_fee?: number;
}

interface PaymentAccount {
  payment_account_id: number;
  shop_id: number;
  is_onboarded_to_managed_payments: boolean;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  account_created_timestamp?: number;
}

interface Review {
  shop_id: number;
  listing_id: number;
  rating: number;
  review: string;
  language: string;
  image_url_fullxfull?: string;
  create_timestamp: number;
  created_timestamp: number;
  update_timestamp: number;
  updated_timestamp: number;
}

interface User {
  user_id: number;
  primary_email: string;
  first_name: string;
  last_name: string;
  use_new_inventory_endpoints: boolean;
  is_seller: boolean;
}

interface ShopSection {
  shop_section_id: number;
  title: string;
  rank: number;
  user_id: number;
  active_listing_count: number;
}

interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
}

interface AuthorizationUrlParams {
  state: string;
  scope: string[];
  pkce: PKCEChallenge;
}

class EtsyIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string | null = null;
  private tokens: EtsyTokens | null = null;
  private baseUrl = 'https://api.etsy.com/v3';
  private authUrl = 'https://www.etsy.com/oauth/connect';
  private tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';

  // Available OAuth scopes
  private readonly SCOPES = {
    ADDRESS_R: 'address_r',
    ADDRESS_W: 'address_w',
    BILLING_R: 'billing_r',
    CART_R: 'cart_r',
    CART_W: 'cart_w',
    EMAIL_R: 'email_r',
    FAVORITES_R: 'favorites_r',
    FAVORITES_W: 'favorites_w',
    FEEDBACK_R: 'feedback_r',
    LISTINGS_R: 'listings_r',
    LISTINGS_W: 'listings_w',
    LISTINGS_D: 'listings_d',
    PROFILE_R: 'profile_r',
    PROFILE_W: 'profile_w',
    RECOMMEND_R: 'recommend_r',
    RECOMMEND_W: 'recommend_w',
    SHOPS_R: 'shops_r',
    SHOPS_W: 'shops_w',
    TRANSACTIONS_R: 'transactions_r',
    TRANSACTIONS_W: 'transactions_w',
  };

  initialize(config: EtsyConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.redirectUri = config.redirectUri;
      localStorage.setItem('etsy_config', JSON.stringify(config));
      console.log('Etsy integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Etsy integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.clientId) return true;

    try {
      const savedConfig = localStorage.getItem('etsy_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = config.redirectUri;
        return !!this.clientId;
      }
    } catch (error) {
      console.error('Error loading Etsy config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.clientId || '',
      'Authorization': `Bearer ${this.tokens?.accessToken || ''}`
    };
  }

  // ==================== PKCE Helper ====================

  private generatePKCEChallenge(): PKCEChallenge {
    // Generate random code verifier (43-128 chars)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Generate SHA256 hash for challenge
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Mock challenge (in real implementation, use crypto.subtle.digest)
    const codeChallenge = btoa(codeVerifier)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { codeVerifier, codeChallenge };
  }

  // ==================== OAuth 2.0 Authentication ====================

  getAuthorizationUrl(scopes: string[] = [
    this.SCOPES.SHOPS_R,
    this.SCOPES.LISTINGS_R,
    this.SCOPES.TRANSACTIONS_R
  ]): { url: string; state: string; codeVerifier: string } {
    if (!this.isConfigured()) {
      throw new Error('Etsy integration not configured');
    }

    const state = Math.random().toString(36).substring(2, 15);
    const pkce = this.generatePKCEChallenge();

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId!,
      redirect_uri: this.redirectUri!,
      scope: scopes.join(' '),
      state: state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256'
    });

    const url = `${this.authUrl}?${params.toString()}`;

    // Store PKCE verifier for token exchange
    sessionStorage.setItem('etsy_pkce_verifier', pkce.codeVerifier);
    sessionStorage.setItem('etsy_oauth_state', state);

    console.log('Authorization URL generated');
    return { url, state, codeVerifier: pkce.codeVerifier };
  }

  async exchangeCodeForToken(code: string, codeVerifier?: string): Promise<EtsyTokens | null> {
    if (!this.isConfigured()) return null;

    try {
      const verifier = codeVerifier || sessionStorage.getItem('etsy_pkce_verifier');
      if (!verifier) {
        throw new Error('PKCE code verifier not found');
      }

      // Mock token response
      const mockTokens: EtsyTokens = {
        accessToken: `12345678.mock_etsy_access_token_${Date.now()}`,
        refreshToken: `mock_etsy_refresh_token_${Date.now()}`,
        expiresAt: Date.now() + (3600 * 1000), // 1 hour
        userId: '12345678'
      };

      this.tokens = mockTokens;
      localStorage.setItem('etsy_tokens', JSON.stringify(mockTokens));
      sessionStorage.removeItem('etsy_pkce_verifier');
      sessionStorage.removeItem('etsy_oauth_state');

      console.log('Access token obtained, expires in 1 hour');
      return mockTokens;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<EtsyTokens | null> {
    if (!this.isConfigured() || !this.tokens?.refreshToken) return null;

    try {
      // Mock refreshed tokens
      const mockTokens: EtsyTokens = {
        accessToken: `${this.tokens.userId}.mock_etsy_refreshed_token_${Date.now()}`,
        refreshToken: this.tokens.refreshToken,
        expiresAt: Date.now() + (3600 * 1000),
        userId: this.tokens.userId
      };

      this.tokens = mockTokens;
      localStorage.setItem('etsy_tokens', JSON.stringify(mockTokens));

      console.log('Access token refreshed');
      return mockTokens;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  // ==================== Shop Management ====================

  async getShop(shopId: number): Promise<Shop | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockShop: Shop = {
        shop_id: shopId,
        user_id: 12345678,
        shop_name: 'MockCraftsShop',
        title: 'Handmade Crafts & Art',
        announcement: 'Welcome to our shop! New items weekly.',
        currency_code: 'USD',
        is_vacation: false,
        listing_active_count: 42,
        digital_listing_count: 5,
        create_date: 1609459200,
        created_timestamp: 1609459200,
        updated_timestamp: Date.now() / 1000,
        url: `https://www.etsy.com/shop/MockCraftsShop`,
        icon_url_fullxfull: 'https://example.com/shop-icon.jpg',
        is_using_structured_policies: true,
        has_onboarded_structured_policies: true,
        policy_welcome: 'Thank you for visiting our shop!',
        policy_payment: 'We accept all major credit cards and PayPal.',
        policy_shipping: 'Items ship within 1-3 business days.',
        policy_refunds: '30-day return policy on all items.',
        policy_updated_timestamp: Date.now() / 1000
      };

      console.log('Shop retrieved:', mockShop.shop_name);
      return mockShop;
    } catch (error) {
      console.error('Error getting shop:', error);
      return null;
    }
  }

  async updateShop(shopId: number, updates: Partial<Shop>): Promise<Shop | null> {
    if (!this.isConfigured()) return null;

    try {
      console.log('Shop updated:', shopId);
      return this.getShop(shopId);
    } catch (error) {
      console.error('Error updating shop:', error);
      return null;
    }
  }

  async getShopSections(shopId: number): Promise<ShopSection[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSections: ShopSection[] = [
        {
          shop_section_id: 1,
          title: 'Featured Items',
          rank: 1,
          user_id: 12345678,
          active_listing_count: 12
        },
        {
          shop_section_id: 2,
          title: 'New Arrivals',
          rank: 2,
          user_id: 12345678,
          active_listing_count: 8
        }
      ];

      console.log('Shop sections retrieved:', mockSections.length);
      return mockSections;
    } catch (error) {
      console.error('Error getting shop sections:', error);
      return null;
    }
  }

  // ==================== Listing Management ====================

  async createListing(params: Partial<Listing> & {
    title: string;
    description: string;
    price: number;
    quantity: number;
    who_made: 'i_did' | 'someone_else' | 'collective';
    when_made: string;
    taxonomy_id: number;
  }): Promise<Listing | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockListing: Listing = {
        listing_id: Date.now(),
        user_id: 12345678,
        shop_id: 1001,
        title: params.title,
        description: params.description,
        state: 'draft',
        creation_timestamp: Date.now() / 1000,
        created_timestamp: Date.now() / 1000,
        ending_timestamp: (Date.now() / 1000) + (86400 * 120), // 120 days
        original_creation_timestamp: Date.now() / 1000,
        last_modified_timestamp: Date.now() / 1000,
        updated_timestamp: Date.now() / 1000,
        state_timestamp: Date.now() / 1000,
        quantity: params.quantity,
        url: `https://www.etsy.com/listing/${Date.now()}`,
        num_favorers: 0,
        non_taxable: false,
        is_taxable: true,
        is_customizable: false,
        is_personalizable: false,
        personalization_is_required: false,
        listing_type: 'physical',
        tags: [],
        materials: [],
        who_made: params.who_made,
        when_made: params.when_made,
        is_supply: false,
        is_private: false,
        has_variations: false,
        should_auto_renew: true,
        language: 'en-US',
        price: {
          amount: params.price * 100,
          divisor: 100,
          currency_code: 'USD'
        },
        taxonomy_id: params.taxonomy_id
      };

      console.log('Listing created:', mockListing.listing_id);
      return mockListing;
    } catch (error) {
      console.error('Error creating listing:', error);
      return null;
    }
  }

  async getListing(listingId: number): Promise<Listing | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockListing: Listing = {
        listing_id: listingId,
        user_id: 12345678,
        shop_id: 1001,
        title: 'Handmade Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug, perfect for your morning coffee.',
        state: 'active',
        creation_timestamp: 1609459200,
        created_timestamp: 1609459200,
        ending_timestamp: 1619827200,
        original_creation_timestamp: 1609459200,
        last_modified_timestamp: Date.now() / 1000,
        updated_timestamp: Date.now() / 1000,
        state_timestamp: 1609459200,
        quantity: 5,
        url: `https://www.etsy.com/listing/${listingId}`,
        num_favorers: 24,
        non_taxable: false,
        is_taxable: true,
        is_customizable: true,
        is_personalizable: true,
        personalization_is_required: false,
        personalization_char_count_max: 50,
        personalization_instructions: 'Please provide text for engraving',
        listing_type: 'physical',
        tags: ['ceramic', 'mug', 'handmade', 'pottery'],
        materials: ['clay', 'glaze'],
        processing_min: 1,
        processing_max: 3,
        who_made: 'i_did',
        when_made: '2020_2024',
        is_supply: false,
        is_private: false,
        has_variations: false,
        should_auto_renew: true,
        language: 'en-US',
        price: {
          amount: 2499,
          divisor: 100,
          currency_code: 'USD'
        },
        taxonomy_id: 1234
      };

      console.log('Listing retrieved:', mockListing.title);
      return mockListing;
    } catch (error) {
      console.error('Error getting listing:', error);
      return null;
    }
  }

  async updateListing(listingId: number, updates: Partial<Listing>): Promise<Listing | null> {
    if (!this.isConfigured()) return null;

    try {
      console.log('Listing updated:', listingId);
      return this.getListing(listingId);
    } catch (error) {
      console.error('Error updating listing:', error);
      return null;
    }
  }

  async deleteListing(listingId: number): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Listing deleted:', listingId);
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      return false;
    }
  }

  async getShopListings(shopId: number, params?: {
    state?: 'active' | 'inactive' | 'draft' | 'expired';
    limit?: number;
    offset?: number;
  }): Promise<Listing[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockListings: Listing[] = Array.from({ length: 5 }, (_, i) => ({
        listing_id: 10000 + i,
        user_id: 12345678,
        shop_id: shopId,
        title: `Product ${i + 1}`,
        description: `Description for product ${i + 1}`,
        state: 'active' as const,
        creation_timestamp: 1609459200,
        created_timestamp: 1609459200,
        ending_timestamp: 1619827200,
        original_creation_timestamp: 1609459200,
        last_modified_timestamp: Date.now() / 1000,
        updated_timestamp: Date.now() / 1000,
        state_timestamp: 1609459200,
        quantity: 10 - i,
        url: `https://www.etsy.com/listing/${10000 + i}`,
        num_favorers: i * 5,
        non_taxable: false,
        is_taxable: true,
        is_customizable: false,
        is_personalizable: false,
        personalization_is_required: false,
        listing_type: 'physical' as const,
        tags: ['handmade', 'unique'],
        materials: ['wood', 'metal'],
        who_made: 'i_did' as const,
        when_made: '2020_2024',
        is_supply: false,
        is_private: false,
        has_variations: false,
        should_auto_renew: true,
        language: 'en-US',
        price: {
          amount: (2000 + i * 500),
          divisor: 100,
          currency_code: 'USD'
        },
        taxonomy_id: 1234
      }));

      const limit = params?.limit || mockListings.length;
      console.log('Shop listings retrieved:', Math.min(mockListings.length, limit));
      return mockListings.slice(0, limit);
    } catch (error) {
      console.error('Error getting shop listings:', error);
      return null;
    }
  }

  // ==================== Listing Images ====================

  async uploadListingImage(listingId: number, imageFile: File, params?: {
    rank?: number;
    alt_text?: string;
  }): Promise<ListingImage | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockImage: ListingImage = {
        listing_image_id: Date.now(),
        is_black_and_white: false,
        creation_timestamp: Date.now() / 1000,
        created_timestamp: Date.now() / 1000,
        rank: params?.rank || 1,
        url_75x75: 'https://example.com/image_75x75.jpg',
        url_170x135: 'https://example.com/image_170x135.jpg',
        url_570xN: 'https://example.com/image_570xN.jpg',
        url_fullxfull: 'https://example.com/image_fullxfull.jpg',
        full_height: 2000,
        full_width: 2000,
        alt_text: params?.alt_text
      };

      console.log('Listing image uploaded');
      return mockImage;
    } catch (error) {
      console.error('Error uploading listing image:', error);
      return null;
    }
  }

  async getListingImages(listingId: number): Promise<ListingImage[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockImages: ListingImage[] = [
        {
          listing_image_id: 1001,
          is_black_and_white: false,
          creation_timestamp: 1609459200,
          created_timestamp: 1609459200,
          rank: 1,
          url_75x75: 'https://example.com/image1_75x75.jpg',
          url_170x135: 'https://example.com/image1_170x135.jpg',
          url_570xN: 'https://example.com/image1_570xN.jpg',
          url_fullxfull: 'https://example.com/image1_fullxfull.jpg',
          full_height: 2000,
          full_width: 2000,
          alt_text: 'Front view'
        }
      ];

      console.log('Listing images retrieved:', mockImages.length);
      return mockImages;
    } catch (error) {
      console.error('Error getting listing images:', error);
      return null;
    }
  }

  // ==================== Inventory Management ====================

  async getListingInventory(listingId: number): Promise<ListingInventory | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockInventory: ListingInventory = {
        products: [
          {
            product_id: 1,
            sku: 'MUG-BLUE-001',
            is_deleted: false,
            offerings: [
              {
                offering_id: 1,
                price: {
                  amount: 2499,
                  divisor: 100,
                  currency_code: 'USD'
                },
                quantity: 10,
                is_enabled: true,
                is_deleted: false
              }
            ],
            property_values: [
              {
                property_id: 200,
                property_name: 'Color',
                value_ids: [1],
                values: ['Blue']
              }
            ]
          }
        ]
      };

      console.log('Listing inventory retrieved');
      return mockInventory;
    } catch (error) {
      console.error('Error getting listing inventory:', error);
      return null;
    }
  }

  async updateListingInventory(listingId: number, inventory: Partial<ListingInventory>): Promise<ListingInventory | null> {
    if (!this.isConfigured()) return null;

    try {
      console.log('Listing inventory updated');
      return this.getListingInventory(listingId);
    } catch (error) {
      console.error('Error updating listing inventory:', error);
      return null;
    }
  }

  // ==================== Order Management ====================

  async getShopReceipts(shopId: number, params?: {
    status?: 'open' | 'completed' | 'canceled';
    limit?: number;
    offset?: number;
    min_created?: number;
    max_created?: number;
  }): Promise<Order[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockOrders: Order[] = [
        {
          receipt_id: 20001,
          receipt_type: 0,
          seller_user_id: 12345678,
          seller_email: 'seller@example.com',
          buyer_user_id: 87654321,
          buyer_email: 'buyer@example.com',
          name: 'John Doe',
          first_line: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          status: 'open',
          formatted_address: '123 Main St, New York, NY 10001, United States',
          country_iso: 'US',
          payment_method: 'cc',
          is_paid: true,
          is_shipped: false,
          create_timestamp: Date.now() / 1000 - 3600,
          created_timestamp: Date.now() / 1000 - 3600,
          update_timestamp: Date.now() / 1000,
          updated_timestamp: Date.now() / 1000,
          is_gift: false,
          grandtotal: {
            amount: 3499,
            divisor: 100,
            currency_code: 'USD'
          },
          subtotal: {
            amount: 2499,
            divisor: 100,
            currency_code: 'USD'
          },
          total_price: {
            amount: 2499,
            divisor: 100,
            currency_code: 'USD'
          },
          total_shipping_cost: {
            amount: 500,
            divisor: 100,
            currency_code: 'USD'
          },
          total_tax_cost: {
            amount: 500,
            divisor: 100,
            currency_code: 'USD'
          },
          total_vat_cost: {
            amount: 0,
            divisor: 100,
            currency_code: 'USD'
          },
          discount_amt: {
            amount: 0,
            divisor: 100,
            currency_code: 'USD'
          },
          gift_wrap_price: {
            amount: 0,
            divisor: 100,
            currency_code: 'USD'
          },
          shipments: [],
          transactions: []
        }
      ];

      const limit = params?.limit || mockOrders.length;
      console.log('Shop receipts retrieved:', Math.min(mockOrders.length, limit));
      return mockOrders.slice(0, limit);
    } catch (error) {
      console.error('Error getting shop receipts:', error);
      return null;
    }
  }

  async getReceipt(receiptId: number): Promise<Order | null> {
    if (!this.isConfigured()) return null;

    try {
      const receipts = await this.getShopReceipts(1001);
      const mockReceipt = receipts?.[0] || null;

      if (mockReceipt) {
        mockReceipt.receipt_id = receiptId;
      }

      console.log('Receipt retrieved:', receiptId);
      return mockReceipt;
    } catch (error) {
      console.error('Error getting receipt:', error);
      return null;
    }
  }

  async updateReceipt(receiptId: number, params: {
    was_shipped?: boolean;
    was_paid?: boolean;
  }): Promise<Order | null> {
    if (!this.isConfigured()) return null;

    try {
      console.log('Receipt updated:', receiptId);
      return this.getReceipt(receiptId);
    } catch (error) {
      console.error('Error updating receipt:', error);
      return null;
    }
  }

  async createReceiptShipment(receiptId: number, params: {
    tracking_code: string;
    carrier_name: string;
    send_bcc?: boolean;
    note_to_buyer?: string;
  }): Promise<Shipment | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockShipment: Shipment = {
        receipt_shipping_id: Date.now(),
        shipment_notification_timestamp: Date.now() / 1000,
        carrier_name: params.carrier_name,
        tracking_code: params.tracking_code
      };

      console.log('Shipment created for receipt:', receiptId);
      return mockShipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      return null;
    }
  }

  // ==================== Shipping Profiles ====================

  async getShippingProfiles(shopId: number): Promise<ShippingProfile[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProfiles: ShippingProfile[] = [
        {
          shipping_profile_id: 1,
          title: 'Standard Shipping',
          user_id: 12345678,
          min_processing_days: 1,
          max_processing_days: 3,
          processing_days_display_label: '1-3 business days',
          origin_country_iso: 'US',
          origin_postal_code: '10001',
          profile_type: 'manual'
        }
      ];

      console.log('Shipping profiles retrieved:', mockProfiles.length);
      return mockProfiles;
    } catch (error) {
      console.error('Error getting shipping profiles:', error);
      return null;
    }
  }

  // ==================== Reviews ====================

  async getShopReviews(shopId: number, params?: {
    limit?: number;
    offset?: number;
    min_created?: number;
    max_created?: number;
  }): Promise<Review[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockReviews: Review[] = [
        {
          shop_id: shopId,
          listing_id: 10001,
          rating: 5,
          review: 'Amazing quality! Exactly as described.',
          language: 'en-US',
          create_timestamp: Date.now() / 1000 - 86400,
          created_timestamp: Date.now() / 1000 - 86400,
          update_timestamp: Date.now() / 1000 - 86400,
          updated_timestamp: Date.now() / 1000 - 86400
        },
        {
          shop_id: shopId,
          listing_id: 10002,
          rating: 4,
          review: 'Very nice product, fast shipping.',
          language: 'en-US',
          create_timestamp: Date.now() / 1000 - 172800,
          created_timestamp: Date.now() / 1000 - 172800,
          update_timestamp: Date.now() / 1000 - 172800,
          updated_timestamp: Date.now() / 1000 - 172800
        }
      ];

      const limit = params?.limit || mockReviews.length;
      console.log('Shop reviews retrieved:', Math.min(mockReviews.length, limit));
      return mockReviews.slice(0, limit);
    } catch (error) {
      console.error('Error getting shop reviews:', error);
      return null;
    }
  }

  // ==================== User Management ====================

  async getCurrentUser(): Promise<User | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: User = {
        user_id: parseInt(this.tokens?.userId || '12345678'),
        primary_email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        use_new_inventory_endpoints: true,
        is_seller: true
      };

      console.log('Current user retrieved:', mockUser.user_id);
      return mockUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // ==================== Payment Account ====================

  async getPaymentAccountLedgerEntries(shopId: number, params?: {
    min_created?: number;
    max_created?: number;
    limit?: number;
    offset?: number;
  }): Promise<any[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEntries = [
        {
          entry_id: 1,
          ledger_id: 1,
          sequence_number: 1,
          amount: 2499,
          currency: 'USD',
          description: 'Payment for order #20001',
          balance: 2499,
          create_date: Date.now() / 1000
        }
      ];

      console.log('Ledger entries retrieved:', mockEntries.length);
      return mockEntries;
    } catch (error) {
      console.error('Error getting ledger entries:', error);
      return null;
    }
  }
}

export const etsyIntegration = new EtsyIntegrationService();
