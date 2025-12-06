/**
 * InFlow Inventory Integration Service
 *
 * Inventory management and order tracking system
 *
 * Features:
 * - Product and inventory tracking
 * - Multi-location warehouse management
 * - Purchase order management
 * - Sales order processing
 * - Customer and vendor management
 * - Stock level monitoring and alerts
 * - Barcode scanning and printing
 * - Serial number and lot tracking
 * - Pricing and cost tracking
 * - Reporting and analytics
 * - Inventory valuation
 * - Reorder point management
 * - Product variants and kits
 * - Invoicing and payments
 * - Shipping integration
 * - QuickBooks and e-commerce integration
 *
 * API Docs: https://cloudapi.inflowinventory.com/docs/
 * Website: https://www.inflowinventory.com/
 */

interface InFlowConfig {
  apiKey: string;
  apiUrl?: string;
  companyId?: string;
  environment?: 'production' | 'sandbox';
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  unitOfMeasure: string;
  barcode?: string;
  upc?: string;
  sellPrice: number;
  costPrice: number;
  currency: string;
  taxable: boolean;
  trackInventory: boolean;
  reorderPoint?: number;
  reorderQuantity?: number;
  preferredVendorId?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  images?: string[];
  customFields?: Record<string, any>;
  isActive: boolean;
  variants?: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>; // e.g., { size: 'Large', color: 'Red' }
  sellPrice: number;
  costPrice: number;
  barcode?: string;
  stockLevel: number;
}

interface InventoryItem {
  id: string;
  productId: string;
  locationId: string;
  quantityOnHand: number;
  quantityAvailable: number;
  quantityOnOrder: number;
  quantityAllocated: number;
  quantityReserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  averageCost: number;
  totalValue: number;
  lastStockDate?: number;
  binLocation?: string;
  serialNumbers?: string[];
  lotNumbers?: LotNumber[];
}

interface LotNumber {
  lotNumber: string;
  quantity: number;
  expirationDate?: string;
  receivedDate: string;
}

interface Location {
  id: string;
  name: string;
  address?: Address;
  isMainLocation: boolean;
  isActive: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  taxExempt: boolean;
  creditLimit?: number;
  balance: number;
  paymentTerms?: string;
  priceLevel?: string;
  notes?: string;
  customFields?: Record<string, any>;
  isActive: boolean;
  createdAt: number;
}

interface Vendor {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  paymentTerms?: string;
  currency: string;
  accountNumber?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  createdAt: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  orderDate: string;
  requiredDate?: string;
  shippedDate?: string;
  locationId: string;
  shippingAddress: Address;
  billingAddress: Address;
  lineItems: OrderLineItem[];
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  customFields?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

type OrderStatus = 'draft' | 'pending' | 'processing' | 'partially_shipped' | 'shipped' | 'delivered' | 'cancelled' | 'on_hold';
type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'overdue';

interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  description?: string;
  quantity: number;
  quantityShipped: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  serialNumbers?: string[];
  lotNumber?: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  status: POStatus;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  locationId: string;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

type POStatus = 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';

interface PurchaseOrderLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  description?: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  taxAmount: number;
  lineTotal: number;
}

interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  toLocationId: string;
  status: 'draft' | 'in_transit' | 'completed' | 'cancelled';
  transferDate: string;
  receivedDate?: string;
  lineItems: StockTransferLineItem[];
  notes?: string;
  createdAt: number;
}

interface StockTransferLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityTransferred: number;
  quantityReceived: number;
  serialNumbers?: string[];
}

interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  locationId: string;
  adjustmentDate: string;
  reason: string;
  lineItems: StockAdjustmentLineItem[];
  notes?: string;
  createdAt: number;
}

interface StockAdjustmentLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  unitCost: number;
  totalValue: number;
  reason: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  salesOrderId?: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'void';
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: number;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  lineTotal: number;
}

interface Payment {
  id: string;
  paymentNumber: string;
  customerId?: string;
  invoiceId?: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
  referenceNumber?: string;
  notes?: string;
  createdAt: number;
}

interface InventoryReport {
  reportType: string;
  generatedAt: number;
  locationId?: string;
  data: any[];
  summary: {
    totalProducts: number;
    totalQuantity: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

interface SalesReport {
  reportType: string;
  startDate: string;
  endDate: string;
  generatedAt: number;
  data: any[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
  };
}

class InFlowIntegrationService {
  private apiUrl: string = 'https://cloudapi.inflowinventory.com/api/v1';
  private apiKey?: string;
  private companyId?: string;
  private products: Map<string, Product> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private locations: Map<string, Location> = new Map();
  private customers: Map<string, Customer> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private salesOrders: Map<string, SalesOrder> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();

  initialize(config: InFlowConfig): boolean {
    try {
      this.apiUrl = config.apiUrl || (config.environment === 'production'
        ? 'https://cloudapi.inflowinventory.com/api/v1'
        : 'https://sandbox-api.inflowinventory.com/api/v1');
      this.apiKey = config.apiKey;
      this.companyId = config.companyId;

      localStorage.setItem('inflow_config', JSON.stringify({
        apiUrl: this.apiUrl,
        companyId: this.companyId
      }));

      console.log('InFlow Inventory integration initialized');
      console.log('API URL:', this.apiUrl);
      console.log('Company ID:', this.companyId || 'Not set');

      // Initialize default location
      this.createDefaultLocation();

      return true;
    } catch (error) {
      console.error('Error initializing InFlow integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== Products ====================

  async createProduct(params: {
    sku: string;
    name: string;
    description?: string;
    category?: string;
    sellPrice: number;
    costPrice: number;
    unitOfMeasure?: string;
    barcode?: string;
    reorderPoint?: number;
    reorderQuantity?: number;
    trackInventory?: boolean;
  }): Promise<Product> {
    const product: Product = {
      id: `product_${Date.now()}`,
      sku: params.sku,
      name: params.name,
      description: params.description,
      category: params.category,
      unitOfMeasure: params.unitOfMeasure || 'each',
      barcode: params.barcode,
      sellPrice: params.sellPrice,
      costPrice: params.costPrice,
      currency: 'USD',
      taxable: true,
      trackInventory: params.trackInventory !== false,
      reorderPoint: params.reorderPoint,
      reorderQuantity: params.reorderQuantity,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.products.set(product.id, product);

    console.log('Product created:', product.name);
    console.log('SKU:', product.sku);
    console.log('Sell price:', product.sellPrice);
    console.log('Cost price:', product.costPrice);

    // Initialize inventory for this product at all locations
    if (product.trackInventory) {
      for (const location of this.locations.values()) {
        this.initializeInventoryItem(product.id, location.id);
      }
    }

    return product;
  }

  async getProducts(params?: {
    active?: boolean;
    category?: string;
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (params?.active !== undefined) {
      products = products.filter(p => p.isActive === params.active);
    }
    if (params?.category) {
      products = products.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    console.log('Products retrieved:', products.length);
    return products;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    console.log('Product details retrieved');
    console.log('Name:', product.name);
    console.log('SKU:', product.sku);

    return product;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(productId);
    Object.assign(product, updates);
    product.updatedAt = Date.now();

    console.log('Product updated:', productId);
    return product;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const product = await this.getProduct(productId);
    product.isActive = false;
    product.updatedAt = Date.now();

    console.log('Product deactivated:', productId);
    return true;
  }

  // ==================== Inventory Management ====================

  async getInventory(params?: {
    locationId?: string;
    productId?: string;
    lowStock?: boolean;
  }): Promise<InventoryItem[]> {
    let inventory = Array.from(this.inventory.values());

    if (params?.locationId) {
      inventory = inventory.filter(i => i.locationId === params.locationId);
    }
    if (params?.productId) {
      inventory = inventory.filter(i => i.productId === params.productId);
    }
    if (params?.lowStock) {
      inventory = inventory.filter(i => i.quantityAvailable <= i.reorderPoint);
    }

    console.log('Inventory items retrieved:', inventory.length);
    if (params?.lowStock) {
      console.log('Low stock items:', inventory.length);
    }

    return inventory;
  }

  async getInventoryItem(productId: string, locationId: string): Promise<InventoryItem> {
    const key = `${productId}_${locationId}`;
    const item = this.inventory.get(key);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    console.log('Inventory item retrieved');
    console.log('Product:', productId);
    console.log('Location:', locationId);
    console.log('Quantity on hand:', item.quantityOnHand);
    console.log('Quantity available:', item.quantityAvailable);

    return item;
  }

  async adjustInventory(params: {
    productId: string;
    locationId: string;
    quantityChange: number;
    reason: string;
    unitCost?: number;
    notes?: string;
  }): Promise<StockAdjustment> {
    const item = await this.getInventoryItem(params.productId, params.locationId);
    const product = await this.getProduct(params.productId);

    const quantityBefore = item.quantityOnHand;
    const quantityAfter = quantityBefore + params.quantityChange;

    item.quantityOnHand = quantityAfter;
    item.quantityAvailable = quantityAfter - item.quantityAllocated;
    item.lastStockDate = Date.now();

    const unitCost = params.unitCost || product.costPrice;
    item.averageCost = ((item.averageCost * quantityBefore) + (unitCost * params.quantityChange)) / quantityAfter;
    item.totalValue = item.quantityOnHand * item.averageCost;

    const adjustment: StockAdjustment = {
      id: `adj_${Date.now()}`,
      adjustmentNumber: `ADJ-${Date.now()}`,
      locationId: params.locationId,
      adjustmentDate: new Date().toISOString(),
      reason: params.reason,
      lineItems: [{
        id: `line_${Date.now()}`,
        productId: params.productId,
        productName: product.name,
        sku: product.sku,
        quantityBefore,
        quantityAfter,
        quantityChange: params.quantityChange,
        unitCost,
        totalValue: params.quantityChange * unitCost,
        reason: params.reason
      }],
      notes: params.notes,
      createdAt: Date.now()
    };

    console.log('Inventory adjusted');
    console.log('Product:', product.name);
    console.log('Change:', params.quantityChange > 0 ? '+' + params.quantityChange : params.quantityChange);
    console.log('New quantity:', quantityAfter);
    console.log('Reason:', params.reason);

    return adjustment;
  }

  async transferStock(params: {
    fromLocationId: string;
    toLocationId: string;
    productId: string;
    quantity: number;
    notes?: string;
  }): Promise<StockTransfer> {
    const product = await this.getProduct(params.productId);
    const fromItem = await this.getInventoryItem(params.productId, params.fromLocationId);

    if (fromItem.quantityAvailable < params.quantity) {
      throw new Error('Insufficient inventory for transfer');
    }

    // Deduct from source location
    fromItem.quantityOnHand -= params.quantity;
    fromItem.quantityAvailable -= params.quantity;

    // Add to destination location
    const toItem = await this.getInventoryItem(params.productId, params.toLocationId);
    toItem.quantityOnHand += params.quantity;
    toItem.quantityAvailable += params.quantity;

    const transfer: StockTransfer = {
      id: `transfer_${Date.now()}`,
      transferNumber: `TRF-${Date.now()}`,
      fromLocationId: params.fromLocationId,
      toLocationId: params.toLocationId,
      status: 'completed',
      transferDate: new Date().toISOString(),
      receivedDate: new Date().toISOString(),
      lineItems: [{
        id: `line_${Date.now()}`,
        productId: params.productId,
        productName: product.name,
        sku: product.sku,
        quantityTransferred: params.quantity,
        quantityReceived: params.quantity
      }],
      notes: params.notes,
      createdAt: Date.now()
    };

    console.log('Stock transfer completed');
    console.log('Product:', product.name);
    console.log('Quantity:', params.quantity);
    console.log('From:', params.fromLocationId);
    console.log('To:', params.toLocationId);

    return transfer;
  }

  // ==================== Locations ====================

  async createLocation(params: {
    name: string;
    address?: Address;
    isMainLocation?: boolean;
  }): Promise<Location> {
    const location: Location = {
      id: `location_${Date.now()}`,
      name: params.name,
      address: params.address,
      isMainLocation: params.isMainLocation || false,
      isActive: true
    };

    this.locations.set(location.id, location);

    console.log('Location created:', location.name);
    console.log('Main location:', location.isMainLocation);

    // Initialize inventory for all products at this location
    for (const product of this.products.values()) {
      if (product.trackInventory) {
        this.initializeInventoryItem(product.id, location.id);
      }
    }

    return location;
  }

  async getLocations(): Promise<Location[]> {
    const locations = Array.from(this.locations.values());
    console.log('Locations retrieved:', locations.length);
    return locations;
  }

  // ==================== Customers ====================

  async createCustomer(params: {
    name: string;
    email?: string;
    phone?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
  }): Promise<Customer> {
    const customer: Customer = {
      id: `customer_${Date.now()}`,
      name: params.name,
      email: params.email,
      phone: params.phone,
      billingAddress: params.billingAddress,
      shippingAddress: params.shippingAddress || params.billingAddress,
      taxExempt: false,
      balance: 0,
      isActive: true,
      createdAt: Date.now()
    };

    this.customers.set(customer.id, customer);

    console.log('Customer created:', customer.name);
    console.log('Email:', customer.email);

    return customer;
  }

  async getCustomers(params?: { search?: string }): Promise<Customer[]> {
    let customers = Array.from(this.customers.values());

    if (params?.search) {
      const search = params.search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.companyName?.toLowerCase().includes(search)
      );
    }

    console.log('Customers retrieved:', customers.length);
    return customers;
  }

  // ==================== Vendors ====================

  async createVendor(params: {
    name: string;
    email?: string;
    phone?: string;
    address?: Address;
  }): Promise<Vendor> {
    const vendor: Vendor = {
      id: `vendor_${Date.now()}`,
      name: params.name,
      email: params.email,
      phone: params.phone,
      address: params.address,
      currency: 'USD',
      isActive: true,
      createdAt: Date.now()
    };

    this.vendors.set(vendor.id, vendor);

    console.log('Vendor created:', vendor.name);
    return vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    const vendors = Array.from(this.vendors.values());
    console.log('Vendors retrieved:', vendors.length);
    return vendors;
  }

  // ==================== Sales Orders ====================

  async createSalesOrder(params: {
    customerId: string;
    locationId: string;
    lineItems: Omit<OrderLineItem, 'id' | 'lineTotal' | 'taxAmount' | 'quantityShipped'>[];
    shippingAddress?: Address;
    shippingMethod?: string;
    notes?: string;
  }): Promise<SalesOrder> {
    const customer = this.customers.get(params.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const lineItems: OrderLineItem[] = params.lineItems.map((item, index) => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const lineTotal = item.quantity * item.unitPrice * (1 - item.discountPercent / 100) - item.discountAmount;
      const taxAmount = lineTotal * 0.08; // 8% tax

      return {
        id: `line_${Date.now()}_${index}`,
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        description: item.description,
        quantity: item.quantity,
        quantityShipped: 0,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent || 0,
        discountAmount: item.discountAmount || 0,
        taxAmount,
        lineTotal
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxTotal = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const shippingTotal = 0;
    const discountTotal = 0;
    const total = subtotal + taxTotal + shippingTotal - discountTotal;

    const order: SalesOrder = {
      id: `so_${Date.now()}`,
      orderNumber: `SO-${Date.now()}`,
      customerId: params.customerId,
      customerName: customer.name,
      status: 'pending',
      orderDate: new Date().toISOString(),
      locationId: params.locationId,
      shippingAddress: params.shippingAddress || customer.shippingAddress || {} as Address,
      billingAddress: customer.billingAddress || {} as Address,
      lineItems,
      subtotal,
      taxTotal,
      shippingTotal,
      discountTotal,
      total,
      currency: 'USD',
      paymentStatus: 'unpaid',
      shippingMethod: params.shippingMethod,
      notes: params.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.salesOrders.set(order.id, order);

    // Allocate inventory
    lineItems.forEach(item => {
      const invKey = `${item.productId}_${params.locationId}`;
      const inventory = this.inventory.get(invKey);
      if (inventory) {
        inventory.quantityAllocated += item.quantity;
        inventory.quantityAvailable -= item.quantity;
      }
    });

    console.log('Sales order created:', order.orderNumber);
    console.log('Customer:', customer.name);
    console.log('Items:', lineItems.length);
    console.log('Total:', total.toFixed(2));

    return order;
  }

  async getSalesOrders(params?: {
    customerId?: string;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<SalesOrder[]> {
    let orders = Array.from(this.salesOrders.values());

    if (params?.customerId) {
      orders = orders.filter(o => o.customerId === params.customerId);
    }
    if (params?.status) {
      orders = orders.filter(o => o.status === params.status);
    }
    if (params?.startDate) {
      orders = orders.filter(o => o.orderDate >= params.startDate!);
    }
    if (params?.endDate) {
      orders = orders.filter(o => o.orderDate <= params.endDate!);
    }

    console.log('Sales orders retrieved:', orders.length);
    return orders;
  }

  async shipSalesOrder(orderId: string, params?: {
    trackingNumber?: string;
    shippingMethod?: string;
  }): Promise<SalesOrder> {
    const order = this.salesOrders.get(orderId);
    if (!order) {
      throw new Error('Sales order not found');
    }

    order.status = 'shipped';
    order.shippedDate = new Date().toISOString();
    order.trackingNumber = params?.trackingNumber;
    if (params?.shippingMethod) order.shippingMethod = params.shippingMethod;
    order.updatedAt = Date.now();

    // Update inventory
    order.lineItems.forEach(item => {
      item.quantityShipped = item.quantity;
      const invKey = `${item.productId}_${order.locationId}`;
      const inventory = this.inventory.get(invKey);
      if (inventory) {
        inventory.quantityOnHand -= item.quantity;
        inventory.quantityAllocated -= item.quantity;
      }
    });

    console.log('Sales order shipped:', order.orderNumber);
    console.log('Tracking number:', order.trackingNumber);

    return order;
  }

  // ==================== Purchase Orders ====================

  async createPurchaseOrder(params: {
    vendorId: string;
    locationId: string;
    lineItems: Omit<PurchaseOrderLineItem, 'id' | 'lineTotal' | 'taxAmount' | 'quantityReceived'>[];
    expectedDate?: string;
    notes?: string;
  }): Promise<PurchaseOrder> {
    const vendor = this.vendors.get(params.vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const lineItems: PurchaseOrderLineItem[] = params.lineItems.map((item, index) => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const lineTotal = item.quantityOrdered * item.unitCost;
      const taxAmount = lineTotal * 0.08;

      return {
        id: `line_${Date.now()}_${index}`,
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        description: item.description,
        quantityOrdered: item.quantityOrdered,
        quantityReceived: 0,
        unitCost: item.unitCost,
        taxAmount,
        lineTotal
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxTotal = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const shippingTotal = 0;
    const total = subtotal + taxTotal + shippingTotal;

    const po: PurchaseOrder = {
      id: `po_${Date.now()}`,
      orderNumber: `PO-${Date.now()}`,
      vendorId: params.vendorId,
      vendorName: vendor.name,
      status: 'draft',
      orderDate: new Date().toISOString(),
      expectedDate: params.expectedDate,
      locationId: params.locationId,
      lineItems,
      subtotal,
      taxTotal,
      shippingTotal,
      total,
      currency: 'USD',
      paymentStatus: 'unpaid',
      notes: params.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.purchaseOrders.set(po.id, po);

    // Update quantity on order
    lineItems.forEach(item => {
      const invKey = `${item.productId}_${params.locationId}`;
      const inventory = this.inventory.get(invKey);
      if (inventory) {
        inventory.quantityOnOrder += item.quantityOrdered;
      }
    });

    console.log('Purchase order created:', po.orderNumber);
    console.log('Vendor:', vendor.name);
    console.log('Items:', lineItems.length);
    console.log('Total:', total.toFixed(2));

    return po;
  }

  async receivePurchaseOrder(poId: string, params?: {
    receivedQuantities?: Record<string, number>;
  }): Promise<PurchaseOrder> {
    const po = this.purchaseOrders.get(poId);
    if (!po) {
      throw new Error('Purchase order not found');
    }

    po.status = 'received';
    po.receivedDate = new Date().toISOString();
    po.updatedAt = Date.now();

    // Update inventory
    po.lineItems.forEach(item => {
      const receivedQty = params?.receivedQuantities?.[item.id] || item.quantityOrdered;
      item.quantityReceived = receivedQty;

      const invKey = `${item.productId}_${po.locationId}`;
      const inventory = this.inventory.get(invKey);
      if (inventory) {
        inventory.quantityOnHand += receivedQty;
        inventory.quantityAvailable += receivedQty;
        inventory.quantityOnOrder -= item.quantityOrdered;

        // Update average cost
        const totalCost = (inventory.averageCost * (inventory.quantityOnHand - receivedQty)) + (item.unitCost * receivedQty);
        inventory.averageCost = totalCost / inventory.quantityOnHand;
        inventory.totalValue = inventory.quantityOnHand * inventory.averageCost;
      }
    });

    console.log('Purchase order received:', po.orderNumber);
    console.log('Items received:', po.lineItems.reduce((sum, item) => sum + item.quantityReceived, 0));

    return po;
  }

  // ==================== Reports ====================

  async getInventoryReport(params?: {
    locationId?: string;
    category?: string;
  }): Promise<InventoryReport> {
    let inventory = await this.getInventory({ locationId: params?.locationId });

    const data = inventory.map(item => {
      const product = this.products.get(item.productId);
      return {
        productId: item.productId,
        productName: product?.name,
        sku: product?.sku,
        locationId: item.locationId,
        quantityOnHand: item.quantityOnHand,
        quantityAvailable: item.quantityAvailable,
        quantityOnOrder: item.quantityOnOrder,
        averageCost: item.averageCost,
        totalValue: item.totalValue
      };
    });

    const report: InventoryReport = {
      reportType: 'Inventory Valuation',
      generatedAt: Date.now(),
      locationId: params?.locationId,
      data,
      summary: {
        totalProducts: new Set(inventory.map(i => i.productId)).size,
        totalQuantity: inventory.reduce((sum, i) => sum + i.quantityOnHand, 0),
        totalValue: inventory.reduce((sum, i) => sum + i.totalValue, 0),
        lowStockItems: inventory.filter(i => i.quantityAvailable <= i.reorderPoint).length,
        outOfStockItems: inventory.filter(i => i.quantityOnHand === 0).length
      }
    };

    console.log('Inventory report generated');
    console.log('Total products:', report.summary.totalProducts);
    console.log('Total quantity:', report.summary.totalQuantity);
    console.log('Total value:', report.summary.totalValue.toFixed(2));
    console.log('Low stock items:', report.summary.lowStockItems);

    return report;
  }

  async getSalesReport(params: {
    startDate: string;
    endDate: string;
  }): Promise<SalesReport> {
    const orders = await this.getSalesOrders({
      startDate: params.startDate,
      endDate: params.endDate
    });

    const completedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'delivered');

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCost = completedOrders.reduce((sum, o) => {
      const cost = o.lineItems.reduce((lineSum, item) => {
        const product = this.products.get(item.productId);
        return lineSum + (item.quantity * (product?.costPrice || 0));
      }, 0);
      return sum + cost;
    }, 0);
    const totalProfit = totalRevenue - totalCost;

    const report: SalesReport = {
      reportType: 'Sales Summary',
      startDate: params.startDate,
      endDate: params.endDate,
      generatedAt: Date.now(),
      data: completedOrders,
      summary: {
        totalOrders: completedOrders.length,
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin: (totalProfit / totalRevenue) * 100
      }
    };

    console.log('Sales report generated');
    console.log('Period:', `${params.startDate} to ${params.endDate}`);
    console.log('Total orders:', report.summary.totalOrders);
    console.log('Total revenue:', report.summary.totalRevenue.toFixed(2));
    console.log('Total profit:', report.summary.totalProfit.toFixed(2));
    console.log('Profit margin:', report.summary.profitMargin.toFixed(2) + '%');

    return report;
  }

  // ==================== Helper Methods ====================

  private initializeInventoryItem(productId: string, locationId: string): void {
    const key = `${productId}_${locationId}`;
    const product = this.products.get(productId);

    if (!this.inventory.has(key) && product) {
      const item: InventoryItem = {
        id: key,
        productId,
        locationId,
        quantityOnHand: 0,
        quantityAvailable: 0,
        quantityOnOrder: 0,
        quantityAllocated: 0,
        quantityReserved: 0,
        reorderPoint: product.reorderPoint || 10,
        reorderQuantity: product.reorderQuantity || 50,
        averageCost: product.costPrice,
        totalValue: 0
      };
      this.inventory.set(key, item);
    }
  }

  private createDefaultLocation(): void {
    if (this.locations.size === 0) {
      const location: Location = {
        id: 'location_main',
        name: 'Main Warehouse',
        isMainLocation: true,
        isActive: true
      };
      this.locations.set(location.id, location);
      console.log('Default location created:', location.name);
    }
  }
}

export const inflowIntegration = new InFlowIntegrationService();
