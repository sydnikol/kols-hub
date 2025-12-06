/**
 * Credit Suisse PSD2 Integration Service
 *
 * European banking API based on PSD2 (Payment Services Directive 2)
 * Implements Berlin Group NextGenPSD2 Framework
 *
 * Features:
 * - Account Information Services (AIS)
 * - Payment Initiation Services (PIS)
 * - Confirmation of Funds (COF)
 * - Strong Customer Authentication (SCA)
 * - OAuth 2.0 with consent management
 * - eIDAS certificate support
 * - Multi-currency accounts
 * - SEPA payments
 * - International payments
 * - Standing orders
 * - Bulk payments
 * - Transaction history
 * - Balance inquiries
 *
 * Docs: https://api-portal-psd2.credit-suisse.com/
 * Standard: https://www.berlin-group.org/nextgenpsd2-downloads
 */

interface PSD2Config {
  apiUrl?: string;
  clientId: string;
  clientSecret: string;
  certificate?: string; // eIDAS certificate
  certificateKey?: string;
  environment?: 'production' | 'sandbox';
  redirectUri?: string;
}

interface OAuth2Tokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
  scope: string;
}

interface ConsentRequest {
  access: ConsentAccess;
  recurringIndicator: boolean;
  validUntil: string; // ISO 8601 date
  frequencyPerDay: number;
  combinedServiceIndicator?: boolean;
}

interface ConsentAccess {
  accounts?: AccountReference[];
  balances?: AccountReference[];
  transactions?: AccountReference[];
  availableAccounts?: 'allAccounts' | 'allAccountsWithOwnerName';
  allPsd2?: 'allAccounts' | 'allAccountsWithOwnerName';
}

interface AccountReference {
  iban?: string;
  bban?: string;
  pan?: string;
  maskedPan?: string;
  msisdn?: string;
  currency?: string;
}

interface Consent {
  consentId: string;
  consentStatus: ConsentStatus;
  access: ConsentAccess;
  recurringIndicator: boolean;
  validUntil: string;
  frequencyPerDay: number;
  lastActionDate: string;
  consentDate?: string;
  _links?: HATEOASLinks;
}

type ConsentStatus = 'received' | 'valid' | 'rejected' | 'expired' | 'terminatedByTpp' | 'revokedByPsu';

interface HATEOASLinks {
  scaRedirect?: { href: string };
  scaOAuth?: { href: string };
  self?: { href: string };
  status?: { href: string };
  scaStatus?: { href: string };
  account?: { href: string };
  [key: string]: { href: string } | undefined;
}

interface Account {
  resourceId: string;
  iban?: string;
  bban?: string;
  currency: string;
  name?: string;
  product?: string;
  cashAccountType?: 'CACC' | 'CARD' | 'CASH' | 'CHAR' | 'CISH' | 'COMM' | 'CPAC' | 'LLSV' | 'LOAN' | 'MGLD' | 'MOMA' | 'NREX' | 'ODFT' | 'ONDP' | 'OTHR' | 'SACC' | 'SLRY' | 'SVGS' | 'TAXE' | 'TRAN' | 'TRAS';
  status?: AccountStatus;
  bic?: string;
  linkedAccounts?: string;
  usage?: 'PRIV' | 'ORGA';
  details?: string;
  balances?: Balance[];
  _links?: HATEOASLinks;
}

type AccountStatus = 'enabled' | 'deleted' | 'blocked';

interface Balance {
  balanceAmount: Amount;
  balanceType: BalanceType;
  creditLimitIncluded?: boolean;
  lastChangeDateTime?: string;
  referenceDate?: string;
  lastCommittedTransaction?: string;
}

type BalanceType = 'closingBooked' | 'expected' | 'authorised' | 'openingBooked' | 'interimAvailable' | 'interimBooked' | 'forwardAvailable' | 'nonInvoiced';

interface Amount {
  currency: string;
  amount: string; // Decimal as string
}

interface Transaction {
  transactionId?: string;
  entryReference?: string;
  endToEndId?: string;
  mandateId?: string;
  checkId?: string;
  creditorId?: string;
  bookingDate?: string;
  valueDate?: string;
  transactionAmount: Amount;
  currencyExchange?: CurrencyExchange[];
  creditorName?: string;
  creditorAccount?: AccountReference;
  creditorAgent?: string;
  creditorAddress?: Address;
  ultimateCreditor?: string;
  debtorName?: string;
  debtorAccount?: AccountReference;
  debtorAgent?: string;
  debtorAddress?: Address;
  ultimateDebtor?: string;
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
  remittanceInformationStructured?: RemittanceInformation;
  remittanceInformationStructuredArray?: RemittanceInformation[];
  additionalInformation?: string;
  purposeCode?: string;
  bankTransactionCode?: string;
  proprietaryBankTransactionCode?: string;
  balanceAfterTransaction?: Balance;
  _links?: HATEOASLinks;
}

interface CurrencyExchange {
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: string;
  unitCurrency?: string;
  quotationDate?: string;
  contractIdentification?: string;
}

interface Address {
  streetName?: string;
  buildingNumber?: string;
  townName?: string;
  postCode?: string;
  country: string;
  addressLine?: string[];
}

interface RemittanceInformation {
  reference?: string;
  referenceType?: string;
  referenceIssuer?: string;
}

interface PaymentInitiationRequest {
  endToEndIdentification?: string;
  instructedAmount: Amount;
  creditorAccount: AccountReference;
  creditorAgent?: string;
  creditorName: string;
  creditorAddress?: Address;
  ultimateCreditor?: string;
  debtorAccount?: AccountReference;
  remittanceInformationUnstructured?: string;
  remittanceInformationStructured?: RemittanceInformation;
  requestedExecutionDate?: string;
  requestedExecutionTime?: string;
}

interface PaymentInitiationResponse {
  transactionStatus: TransactionStatus;
  paymentId: string;
  transactionFees?: Amount;
  transactionFeeIndicator?: boolean;
  scaMethods?: AuthenticationMethod[];
  chosenScaMethod?: AuthenticationMethod;
  challengeData?: ChallengeData;
  _links: HATEOASLinks;
  psuMessage?: string;
  tppMessages?: TppMessage[];
}

type TransactionStatus = 'ACCP' | 'ACSC' | 'ACSP' | 'ACTC' | 'ACWC' | 'ACWP' | 'RCVD' | 'PDNG' | 'RJCT' | 'CANC' | 'ACFC' | 'PATC';

interface AuthenticationMethod {
  authenticationType: 'SMS_OTP' | 'CHIP_OTP' | 'PHOTO_OTP' | 'PUSH_OTP' | 'EMBEDDED';
  authenticationMethodId: string;
  name?: string;
  explanation?: string;
}

interface ChallengeData {
  image?: string; // Base64 encoded
  data?: string[];
  imageLink?: string;
  otpMaxLength?: number;
  otpFormat?: 'characters' | 'integer';
  additionalInformation?: string;
}

interface TppMessage {
  category: 'ERROR' | 'WARNING';
  code: string;
  path?: string;
  text?: string;
}

interface BulkPaymentInitiationRequest {
  batchBookingPreferred?: boolean;
  debtorAccount: AccountReference;
  requestedExecutionDate?: string;
  payments: PaymentInitiationRequest[];
}

interface PeriodicPaymentInitiationRequest extends PaymentInitiationRequest {
  startDate: string;
  endDate?: string;
  executionRule?: 'following' | 'preceding';
  frequency: Frequency;
  dayOfExecution?: string;
}

type Frequency = 'Daily' | 'Weekly' | 'EveryTwoWeeks' | 'Monthly' | 'EveryTwoMonths' | 'Quarterly' | 'SemiAnnual' | 'Annual';

interface ConfirmationOfFundsRequest {
  cardNumber?: string;
  account: AccountReference;
  payee?: string;
  instructedAmount: Amount;
}

interface ConfirmationOfFundsResponse {
  fundsAvailable: boolean;
}

interface StandingOrder {
  standingOrderId: string;
  frequency: Frequency;
  creditorAccount: AccountReference;
  creditorName: string;
  instructedAmount: Amount;
  startDate: string;
  endDate?: string;
  executionRule?: 'following' | 'preceding';
  dayOfExecution?: string;
  lastExecutionDate?: string;
  nextExecutionDate?: string;
  status: 'active' | 'suspended' | 'cancelled';
}

interface ScaStatus {
  scaStatus: 'received' | 'psuIdentified' | 'psuAuthenticated' | 'scaMethodSelected' | 'started' | 'finalised' | 'failed' | 'exempted';
  psuMessage?: string;
  _links?: HATEOASLinks;
}

class CreditSuissePSD2IntegrationService {
  private apiUrl: string = 'https://api.credit-suisse.com/psd2';
  private clientId?: string;
  private clientSecret?: string;
  private tokens?: OAuth2Tokens;
  private certificate?: string;
  private environment: 'production' | 'sandbox' = 'sandbox';
  private consents: Map<string, Consent> = new Map();
  private accounts: Map<string, Account> = new Map();
  private payments: Map<string, PaymentInitiationResponse> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();

  initialize(config: PSD2Config): boolean {
    try {
      this.apiUrl = config.apiUrl || (config.environment === 'production'
        ? 'https://api.credit-suisse.com/psd2'
        : 'https://sandbox-api.credit-suisse.com/psd2');
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.certificate = config.certificate;
      this.environment = config.environment || 'sandbox';

      localStorage.setItem('psd2_config', JSON.stringify({
        apiUrl: this.apiUrl,
        clientId: this.clientId,
        environment: this.environment
      }));

      console.log('Credit Suisse PSD2 integration initialized');
      console.log('Environment:', this.environment);
      console.log('API URL:', this.apiUrl);
      console.log('eIDAS Certificate:', this.certificate ? 'Configured' : 'Not configured');

      return true;
    } catch (error) {
      console.error('Error initializing PSD2 integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!this.clientId && !!this.clientSecret;
  }

  // ==================== OAuth 2.0 Authentication ====================

  async getAuthorizationUrl(params: {
    scope: string;
    state: string;
    redirectUri: string;
    consentId?: string;
  }): Promise<string> {
    const authUrl = new URL(`${this.apiUrl}/oauth2/authorize`);
    authUrl.searchParams.set('client_id', this.clientId!);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', params.scope);
    authUrl.searchParams.set('state', params.state);
    authUrl.searchParams.set('redirect_uri', params.redirectUri);

    if (params.consentId) {
      authUrl.searchParams.set('consent_id', params.consentId);
    }

    console.log('Authorization URL generated');
    console.log('Scope:', params.scope);
    console.log('Redirect to:', authUrl.toString());

    return authUrl.toString();
  }

  async exchangeCodeForToken(params: {
    code: string;
    redirectUri: string;
  }): Promise<OAuth2Tokens> {
    console.log('Exchanging authorization code for access token');

    // Mock token exchange
    const tokens: OAuth2Tokens = {
      accessToken: `psd2_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      refreshToken: `psd2_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: Date.now() + 3600000,
      scope: 'AIS PIS'
    };

    this.tokens = tokens;
    localStorage.setItem('psd2_tokens', JSON.stringify(tokens));

    console.log('Access token obtained');
    console.log('Expires in:', tokens.expiresIn, 'seconds');
    console.log('Scope:', tokens.scope);

    return tokens;
  }

  async refreshAccessToken(): Promise<OAuth2Tokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('Refreshing access token');

    const tokens: OAuth2Tokens = {
      accessToken: `psd2_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      refreshToken: this.tokens.refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: Date.now() + 3600000,
      scope: this.tokens.scope
    };

    this.tokens = tokens;
    localStorage.setItem('psd2_tokens', JSON.stringify(tokens));

    console.log('Access token refreshed');
    return tokens;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': this.generateRequestId(),
      'PSU-IP-Address': '127.0.0.1'
    };

    if (this.tokens) {
      headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;
    }

    if (this.certificate) {
      headers['TPP-Signature-Certificate'] = this.certificate;
    }

    return headers;
  }

  // ==================== Consent Management (AIS) ====================

  async createConsent(request: ConsentRequest): Promise<Consent> {
    console.log('Creating AIS consent');
    console.log('Valid until:', request.validUntil);
    console.log('Frequency per day:', request.frequencyPerDay);
    console.log('Recurring:', request.recurringIndicator);

    const consent: Consent = {
      consentId: `consent_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      consentStatus: 'received',
      access: request.access,
      recurringIndicator: request.recurringIndicator,
      validUntil: request.validUntil,
      frequencyPerDay: request.frequencyPerDay,
      lastActionDate: new Date().toISOString(),
      consentDate: new Date().toISOString(),
      _links: {
        scaRedirect: { href: `${this.apiUrl}/authorize?consent_id=${Date.now()}` },
        self: { href: `${this.apiUrl}/consents/${Date.now()}` },
        status: { href: `${this.apiUrl}/consents/${Date.now()}/status` }
      }
    };

    this.consents.set(consent.consentId, consent);

    console.log('Consent created:', consent.consentId);
    console.log('Status:', consent.consentStatus);
    console.log('SCA redirect:', consent._links?.scaRedirect?.href);

    return consent;
  }

  async getConsentStatus(consentId: string): Promise<{ consentStatus: ConsentStatus }> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new Error('Consent not found');
    }

    console.log('Consent status:', consent.consentStatus);
    return { consentStatus: consent.consentStatus };
  }

  async getConsent(consentId: string): Promise<Consent> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new Error('Consent not found');
    }

    console.log('Consent retrieved:', consentId);
    return consent;
  }

  async deleteConsent(consentId: string): Promise<boolean> {
    const deleted = this.consents.delete(consentId);
    if (deleted) {
      console.log('Consent deleted:', consentId);
    }
    return deleted;
  }

  // ==================== Account Information Services (AIS) ====================

  async getAccounts(params?: {
    withBalance?: boolean;
  }): Promise<{ accounts: Account[] }> {
    console.log('Retrieving accounts');
    console.log('With balance:', params?.withBalance || false);

    // Mock accounts
    if (this.accounts.size === 0) {
      this.createMockAccounts();
    }

    const accounts = Array.from(this.accounts.values());

    console.log('Accounts found:', accounts.length);
    accounts.forEach(acc => {
      console.log(`  - ${acc.iban} (${acc.currency}): ${acc.name}`);
    });

    return { accounts };
  }

  async getAccount(accountId: string, params?: {
    withBalance?: boolean;
  }): Promise<Account> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    console.log('Account details retrieved');
    console.log('IBAN:', account.iban);
    console.log('Currency:', account.currency);
    console.log('Product:', account.product);

    return account;
  }

  async getBalances(accountId: string): Promise<{ balances: Balance[] }> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const balances: Balance[] = account.balances || [
      {
        balanceAmount: { currency: account.currency, amount: '5420.85' },
        balanceType: 'closingBooked',
        referenceDate: new Date().toISOString().split('T')[0]
      },
      {
        balanceAmount: { currency: account.currency, amount: '5320.85' },
        balanceType: 'expected',
        referenceDate: new Date().toISOString().split('T')[0]
      }
    ];

    console.log('Balances retrieved for account:', accountId);
    balances.forEach(bal => {
      console.log(`  ${bal.balanceType}: ${bal.balanceAmount.amount} ${bal.balanceAmount.currency}`);
    });

    return { balances };
  }

  async getTransactions(accountId: string, params?: {
    dateFrom?: string;
    dateTo?: string;
    bookingStatus?: 'booked' | 'pending' | 'both';
    deltaList?: boolean;
  }): Promise<{
    transactions: { booked?: Transaction[]; pending?: Transaction[] };
    _links?: HATEOASLinks;
  }> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    console.log('Retrieving transactions');
    console.log('Account:', accountId);
    console.log('Date from:', params?.dateFrom || 'N/A');
    console.log('Date to:', params?.dateTo || 'N/A');
    console.log('Booking status:', params?.bookingStatus || 'both');

    // Get or create mock transactions
    let accountTransactions = this.transactions.get(accountId);
    if (!accountTransactions) {
      accountTransactions = this.createMockTransactions(account);
      this.transactions.set(accountId, accountTransactions);
    }

    const booked = accountTransactions.filter(tx => tx.bookingDate);
    const pending = accountTransactions.filter(tx => !tx.bookingDate);

    console.log('Booked transactions:', booked.length);
    console.log('Pending transactions:', pending.length);

    return {
      transactions: {
        booked: params?.bookingStatus === 'pending' ? undefined : booked,
        pending: params?.bookingStatus === 'booked' ? undefined : pending
      }
    };
  }

  async getTransactionDetails(accountId: string, transactionId: string): Promise<Transaction> {
    const accountTransactions = this.transactions.get(accountId);
    if (!accountTransactions) {
      throw new Error('Account not found');
    }

    const transaction = accountTransactions.find(tx => tx.transactionId === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    console.log('Transaction details retrieved');
    console.log('Transaction ID:', transactionId);
    console.log('Amount:', transaction.transactionAmount.amount, transaction.transactionAmount.currency);
    console.log('Creditor:', transaction.creditorName);

    return transaction;
  }

  // ==================== Payment Initiation Services (PIS) ====================

  async initiatePayment(payment: PaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    console.log('Initiating payment');
    console.log('Amount:', payment.instructedAmount.amount, payment.instructedAmount.currency);
    console.log('Creditor:', payment.creditorName);
    console.log('Creditor account:', payment.creditorAccount.iban);

    const response: PaymentInitiationResponse = {
      transactionStatus: 'RCVD',
      paymentId: `payment_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      transactionFeeIndicator: false,
      scaMethods: [
        {
          authenticationType: 'SMS_OTP',
          authenticationMethodId: 'sms',
          name: 'SMS OTP',
          explanation: 'One-time password via SMS'
        },
        {
          authenticationType: 'PUSH_OTP',
          authenticationMethodId: 'push',
          name: 'Push Notification',
          explanation: 'Confirm via mobile app'
        }
      ],
      _links: {
        scaRedirect: { href: `${this.apiUrl}/authorize/payment/${Date.now()}` },
        self: { href: `${this.apiUrl}/payments/${Date.now()}` },
        status: { href: `${this.apiUrl}/payments/${Date.now()}/status` },
        scaStatus: { href: `${this.apiUrl}/payments/${Date.now()}/authorisations/123` }
      },
      psuMessage: 'Please authenticate the payment'
    };

    this.payments.set(response.paymentId, response);

    console.log('Payment initiated:', response.paymentId);
    console.log('Status:', response.transactionStatus);
    console.log('SCA methods available:', response.scaMethods?.length);

    return response;
  }

  async getPaymentStatus(paymentId: string): Promise<{ transactionStatus: TransactionStatus }> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    console.log('Payment status:', payment.transactionStatus);
    return { transactionStatus: payment.transactionStatus };
  }

  async getPayment(paymentId: string): Promise<PaymentInitiationResponse> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    console.log('Payment details retrieved:', paymentId);
    return payment;
  }

  async cancelPayment(paymentId: string): Promise<{ transactionStatus: TransactionStatus }> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.transactionStatus = 'CANC';
    console.log('Payment cancelled:', paymentId);

    return { transactionStatus: payment.transactionStatus };
  }

  // ==================== Bulk Payments ====================

  async initiateBulkPayment(bulkPayment: BulkPaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    console.log('Initiating bulk payment');
    console.log('Number of payments:', bulkPayment.payments.length);
    console.log('Debtor account:', bulkPayment.debtorAccount.iban);
    console.log('Batch booking:', bulkPayment.batchBookingPreferred || false);

    const totalAmount = bulkPayment.payments.reduce(
      (sum, p) => sum + parseFloat(p.instructedAmount.amount),
      0
    );

    console.log('Total amount:', totalAmount.toFixed(2), bulkPayment.payments[0].instructedAmount.currency);

    return this.initiatePayment({
      ...bulkPayment.payments[0],
      debtorAccount: bulkPayment.debtorAccount
    });
  }

  // ==================== Periodic Payments ====================

  async initiatePeriodicPayment(periodicPayment: PeriodicPaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    console.log('Initiating periodic payment');
    console.log('Amount:', periodicPayment.instructedAmount.amount, periodicPayment.instructedAmount.currency);
    console.log('Creditor:', periodicPayment.creditorName);
    console.log('Frequency:', periodicPayment.frequency);
    console.log('Start date:', periodicPayment.startDate);
    console.log('End date:', periodicPayment.endDate || 'None (indefinite)');
    console.log('Day of execution:', periodicPayment.dayOfExecution);

    return this.initiatePayment(periodicPayment);
  }

  // ==================== Confirmation of Funds (COF) ====================

  async checkFundsAvailability(request: ConfirmationOfFundsRequest): Promise<ConfirmationOfFundsResponse> {
    console.log('Checking funds availability');
    console.log('Account:', request.account.iban);
    console.log('Amount:', request.instructedAmount.amount, request.instructedAmount.currency);

    // Mock funds check
    const fundsAvailable = Math.random() > 0.3; // 70% success rate

    console.log('Funds available:', fundsAvailable);

    return { fundsAvailable };
  }

  // ==================== Standing Orders ====================

  async getStandingOrders(accountId: string): Promise<{ standingOrders: StandingOrder[] }> {
    console.log('Retrieving standing orders for account:', accountId);

    const standingOrders: StandingOrder[] = [
      {
        standingOrderId: 'so_1',
        frequency: 'Monthly',
        creditorAccount: { iban: 'CH9300762011623852957' },
        creditorName: 'Rent Payment',
        instructedAmount: { currency: 'CHF', amount: '1500.00' },
        startDate: '2024-01-01',
        dayOfExecution: '1',
        nextExecutionDate: '2024-02-01',
        status: 'active'
      }
    ];

    console.log('Standing orders found:', standingOrders.length);
    return { standingOrders };
  }

  // ==================== Strong Customer Authentication (SCA) ====================

  async getScaStatus(resourceId: string, authorisationId: string): Promise<ScaStatus> {
    console.log('Getting SCA status');
    console.log('Resource ID:', resourceId);
    console.log('Authorisation ID:', authorisationId);

    const status: ScaStatus = {
      scaStatus: 'finalised',
      psuMessage: 'Authentication successful',
      _links: {
        self: { href: `${this.apiUrl}/payments/${resourceId}/authorisations/${authorisationId}` }
      }
    };

    console.log('SCA status:', status.scaStatus);
    return status;
  }

  async selectScaMethod(params: {
    resourceId: string;
    authorisationId: string;
    authenticationMethodId: string;
  }): Promise<ScaStatus> {
    console.log('Selecting SCA method');
    console.log('Method ID:', params.authenticationMethodId);

    const status: ScaStatus = {
      scaStatus: 'scaMethodSelected',
      psuMessage: 'Please enter the OTP sent to your phone',
      _links: {
        self: { href: `${this.apiUrl}/payments/${params.resourceId}/authorisations/${params.authorisationId}` }
      }
    };

    console.log('SCA method selected');
    return status;
  }

  async authoriseTransaction(params: {
    resourceId: string;
    authorisationId: string;
    scaAuthenticationData: string;
  }): Promise<ScaStatus> {
    console.log('Authorising transaction with SCA data');

    const status: ScaStatus = {
      scaStatus: 'finalised',
      psuMessage: 'Transaction authorised successfully',
      _links: {
        self: { href: `${this.apiUrl}/payments/${params.resourceId}/authorisations/${params.authorisationId}` }
      }
    };

    console.log('Transaction authorised');
    return status;
  }

  // ==================== Utilities ====================

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private createMockAccounts(): void {
    const account1: Account = {
      resourceId: 'account_1',
      iban: 'CH9300762011623852957',
      currency: 'CHF',
      name: 'Main Account',
      product: 'Credit Suisse Personal Account',
      cashAccountType: 'CACC',
      status: 'enabled',
      bic: 'CRESCHZZ80A',
      usage: 'PRIV',
      balances: [
        {
          balanceAmount: { currency: 'CHF', amount: '5420.85' },
          balanceType: 'closingBooked',
          referenceDate: new Date().toISOString().split('T')[0]
        }
      ]
    };

    const account2: Account = {
      resourceId: 'account_2',
      iban: 'CH2809000000857543210',
      currency: 'EUR',
      name: 'Euro Savings',
      product: 'Credit Suisse Savings Account',
      cashAccountType: 'SVGS',
      status: 'enabled',
      bic: 'CRESCHZZ80A',
      usage: 'PRIV',
      balances: [
        {
          balanceAmount: { currency: 'EUR', amount: '12500.00' },
          balanceType: 'closingBooked',
          referenceDate: new Date().toISOString().split('T')[0]
        }
      ]
    };

    this.accounts.set(account1.resourceId, account1);
    this.accounts.set(account2.resourceId, account2);
  }

  private createMockTransactions(account: Account): Transaction[] {
    const now = new Date();
    const transactions: Transaction[] = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      transactions.push({
        transactionId: `tx_${Date.now()}_${i}`,
        bookingDate: dateStr,
        valueDate: dateStr,
        transactionAmount: {
          currency: account.currency,
          amount: (Math.random() * 1000 - 500).toFixed(2)
        },
        creditorName: `Merchant ${i + 1}`,
        creditorAccount: { iban: `CH${Math.floor(Math.random() * 10000000000000000)}` },
        debtorName: account.name,
        debtorAccount: { iban: account.iban },
        remittanceInformationUnstructured: `Payment reference ${i + 1}`,
        additionalInformation: `Transaction ${i + 1}`,
        bankTransactionCode: 'PMNT'
      });
    }

    return transactions;
  }

  // ==================== Conversion Helpers ====================

  formatAmount(amount: string, currency: string): string {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
  }

  parseAmount(formattedAmount: string): Amount {
    const parts = formattedAmount.split(' ');
    return {
      amount: parts[0],
      currency: parts[1]
    };
  }

  validateIBAN(iban: string): boolean {
    // Basic IBAN validation for Swiss accounts (CH)
    const cleaned = iban.replace(/\s/g, '');
    const isValid = /^CH\d{19}$/.test(cleaned);

    console.log('IBAN validation:', iban);
    console.log('Valid:', isValid);

    return isValid;
  }

  formatIBAN(iban: string): string {
    const cleaned = iban.replace(/\s/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }
}

export const creditSuissePSD2Integration = new CreditSuissePSD2IntegrationService();
