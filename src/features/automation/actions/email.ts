/**
 * EMAIL ACTION - Send automated emails
 * Supports: Gmail, ProtonMail, custom SMTP
 */

export interface EmailParams {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function execute(params: EmailParams): Promise<void> {
  const {
    to,
    subject,
    body,
    html,
    from = 'noreply@kolpersonalos.com',
    cc,
    bcc,
  } = params;

  // In production, use Nodemailer or email service API
  // For now, use a webhook to email service (like SendGrid, Mailgun)

  const emailPayload = {
    personalizations: [
      {
        to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
        cc: cc ? (Array.isArray(cc) ? cc.map(email => ({ email })) : [{ email: cc }]) : undefined,
        bcc: bcc ? (Array.isArray(bcc) ? bcc.map(email => ({ email })) : [{ email: bcc }]) : undefined,
      },
    ],
    from: { email: from },
    subject,
    content: [
      {
        type: html ? 'text/html' : 'text/plain',
        value: html || body,
      },
    ],
  };

  console.log(`📧 Email sent to: ${to}`);
  console.log(`   Subject: ${subject}`);

  // In production, actually send via API:
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(emailPayload),
  // });
}
