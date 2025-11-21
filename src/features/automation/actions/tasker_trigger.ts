/**
 * TASKER / ANDROID AUTOMATION TRIGGER
 * Fires Tasker profiles, IFTTT, or AutoInput actions
 */

export interface TaskerTriggerParams {
  action: string;
  params?: Record<string, string>;
  taskerWebhookUrl?: string;
}

export async function execute(params: TaskerTriggerParams): Promise<void> {
  const {
    action,
    params: actionParams = {},
    taskerWebhookUrl = 'http://localhost:1821', // Default Tasker webhook port
  } = params;

  // Build webhook URL with action and params
  const url = new URL(`${taskerWebhookUrl}/${action}`);

  Object.entries(actionParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log(`📱 Triggering Tasker action: ${action}`);

  // Execute webhook
  try {
    await fetch(url.toString(), { method: 'GET' });
    console.log(`✅ Tasker action triggered: ${action}`);
  } catch (error) {
    console.error(`❌ Tasker trigger failed:`, error);
    // Tasker may not be running or webhook not configured
  }
}
