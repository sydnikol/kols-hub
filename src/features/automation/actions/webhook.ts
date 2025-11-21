/**
 * WEBHOOK ACTION - Trigger external services
 * Supports: Zapier, IFTTT, Make, Home Assistant, Slack, Discord, etc.
 */

export interface WebhookParams {
  url: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  queryParams?: Record<string, string>;
}

export async function execute(params: WebhookParams): Promise<void> {
  const { url, method = 'POST', headers = {}, body, queryParams } = params;

  // Build URL with query parameters
  let fullUrl = url;
  if (queryParams) {
    const query = new URLSearchParams(queryParams).toString();
    fullUrl = `${url}?${query}`;
  }

  // Prepare request
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  // Execute webhook
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.statusText}`);
  }

  console.log(`✅ Webhook executed: ${url}`);
}
