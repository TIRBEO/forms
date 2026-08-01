export type EmailTemplate = { subject: string; html: string };

function tpl(subject: string, html: string): EmailTemplate {
  return { subject, html };
}

function head(title: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body style="margin:0;padding:0;background:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">`;
}

function headerHtml(logo: string, title: string, subtitle: string, gradient?: string): string {
  const g = gradient || 'linear-gradient(135deg,#1A73E8,#1557B0)';
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:50px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(60,64,67,.12);"><tr><td style="background:${g};padding:52px 48px;text-align:center;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><img src="${logo}" width="56" alt="Tirbeo" style="display:block;margin:0 auto 22px;border-radius:12px;"></td></tr><tr><td align="center"><h1 style="margin:0;font-size:34px;font-weight:700;color:#ffffff;letter-spacing:-.01em;">${title}</h1><p style="margin:16px 0 0;font-size:16px;line-height:28px;color:rgba(255,255,255,.92);">${subtitle}</p></td></tr></table></td></tr>`;
}

function footerHtml(): string {
  return `<tr><td style="padding:36px 48px;background:#ffffff;text-align:center;border-top:1px solid #f1f3f4;"><p style="margin:0;font-size:16px;font-weight:700;color:#202124;">Tirbeo</p><p style="margin:14px 0 0;font-size:13px;color:#80868b;line-height:22px;">&copy; 2026 Tirbeo. All rights reserved.<br>123 Market St, Suite 400, San Francisco, CA 94105</p></td></tr></table></td></tr></table></body></html>`;
}

function bodyStart(): string {
  return `<tr><td style="padding:52px 48px;background:#ffffff;">`;
}

function bodyEnd(): string {
  return `</td></tr>`;
}

function divider(): string {
  return `<div style="margin:36px 0;height:1px;background:#f1f3f4;"></div>`;
}

const DEFAULT_IMAGE_BASE = 'https://api.tirbeo.app/image';

function heroImg(imageBase: string, name: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td align="center" style="padding:40px 48px 0;background:#ffffff;"><img src="${imageBase}/${name}.png" width="100%" alt="" style="max-width:480px;width:100%;height:auto;display:block;margin:0 auto;border-radius:14px;border:1px solid #e8eaed;"></td></tr></table>`;
}

export function otpCodeBlock(code: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:2px dashed #1A73E8;border-radius:14px;"><tr><td align="center" style="padding:32px;font-size:40px;font-weight:700;letter-spacing:12px;color:#1A73E8;font-family:monospace;">${code}</td></tr></table>`;
}

export function buttonBlock(url: string, label: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><a href="${url}" style="display:inline-block;padding:16px 44px;background:#1A73E8;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 2px 8px rgba(26,115,232,.25);">${label}</a></td></tr></table>`;
}

export const EMAIL_TEMPLATES: Record<string, (logo: string, imageBase: string) => EmailTemplate> = {
  signup_otp: (logo, imageBase) => tpl(
    'Your Tirbeo verification code is {{otp}}',
    `${head('Verify Your Email')}${headerHtml(logo, 'Verify your email', 'Complete your account setup securely.')}${bodyStart()}${heroImg(imageBase, 'email-verification')}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Use the verification code below to activate your Tirbeo account. This code expires in <strong style="color:#202124;">10 minutes</strong>.</p>${otpCodeBlock('{{otp}}')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this verification, you can safely ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  login_otp: (logo) => tpl(
    'Your Tirbeo login code is {{otp}}',
    `${head('Your Login Code')}${headerHtml(logo, 'Your login code', 'Use this code to sign in to your account.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Here is your login verification code. It expires in <strong style="color:#202124;">10 minutes</strong>.</p>${otpCodeBlock('{{otp}}')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this login, you can safely ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  welcome: (logo, imageBase) => tpl(
    'Welcome to Tirbeo, {{name}}!',
    `${head('Welcome to Tirbeo')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:50px 20px;"><tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e8eaed;border-radius:16px;overflow:hidden;"><tr><td align="center" style="padding:56px 40px;background:linear-gradient(135deg,#1A73E8,#1557B0);"><img src="${logo}" width="60" alt="Tirbeo" style="display:block;margin:0 auto 20px;"><h1 style="margin:0;color:#FFFFFF;font-size:34px;font-weight:700;">Welcome to Tirbeo</h1><p style="margin:18px 0 0;color:rgba(255,255,255,.92);font-size:17px;line-height:30px;">Your workspace is ready. Let's build something amazing together.</p></td></tr>${heroImg(imageBase, 'account-created')}<tr><td style="padding:48px 40px;background:#ffffff;"><p style="margin:0;color:#202124;font-size:20px;font-weight:600;">Hi {{name}},</p><p style="margin:22px 0;color:#5f6368;font-size:16px;line-height:30px;">Thanks for joining <strong style="color:#202124;">Tirbeo</strong>. Your account has been created successfully and you're ready to start exploring everything our platform has to offer.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:18px;background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;"><p style="margin:0;font-size:15px;color:#202124;font-weight:600;">Explore Communities</p><p style="margin:10px 0 0;color:#5f6368;font-size:14px;line-height:24px;">Discover discussions and connect with people who share your interests.</p></td></tr></table>${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">Questions? Visit our <a href="https://tirbeo.app/help" style="color:#1A73E8;text-decoration:none;">Help Center</a></p></td></tr>${footerHtml()}`
  ),

  password_reset_otp: (logo) => tpl(
    'Your Tirbeo password reset code is {{otp}}',
    `${head('Reset Your Password')}${headerHtml(logo, 'Reset your password', 'Use the code below to reset your password.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">We received a request to reset the password for your Tirbeo account. Use the code below to reset your password. This code expires in <strong style="color:#202124;">15 minutes</strong>.</p>${otpCodeBlock('{{otp}}')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this, you can safely ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  password_reset_link: (logo) => tpl(
    'Reset your Tirbeo password',
    `${head('Reset Your Password')}${headerHtml(logo, 'Reset your password', 'Click the link below to securely reset your password.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">We received a request to reset the password for your Tirbeo account. Click the button below to reset it. This link expires in <strong style="color:#202124;">1 hour</strong>.</p>${buttonBlock('{{resetUrl}}', 'Reset Password')}<p style="margin:32px 0 0;font-size:14px;line-height:24px;color:#80868b;">If the button doesn't work, copy and paste this link:</p><p style="font-size:13px;line-height:20px;color:#1A73E8;word-break:break-all;">{{resetUrl}}</p>${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this, you can safely ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  verify_email: (logo, imageBase) => tpl(
    'Verify your Tirbeo email',
    `${head('Verify Your Email')}${headerHtml(logo, 'Verify your email', 'Confirm your email address securely.')}${bodyStart()}${heroImg(imageBase, 'email-verification')}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Your verification code:</p>${otpCodeBlock('{{otp}}')}<p style="margin:28px 0 0;font-size:15px;line-height:26px;color:#80868b;">This code expires in 10 minutes.</p>${bodyEnd()}${footerHtml()}`
  ),

  magic_link: (logo) => tpl(
    'Sign in to Tirbeo',
    `${head('Sign in to Tirbeo')}${headerHtml(logo, 'Sign in to Tirbeo', 'One click and you are in.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hi {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Click the button below to sign in to your Tirbeo account. This link expires in <strong style="color:#202124;">15 minutes</strong>.</p>${buttonBlock('{{magicLink}}', 'Sign In to Tirbeo')}<p style="margin:32px 0 0;font-size:14px;line-height:24px;color:#80868b;">If the button does not work, copy and paste this link into your browser:</p><p style="margin:8px 0 0;font-size:13px;line-height:20px;color:#1A73E8;word-break:break-all;">{{magicLink}}</p>${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this, you can safely ignore it.</p>${bodyEnd()}${footerHtml()}`
  ),

  notification_digest: (logo) => tpl(
    'Your Tirbeo digest — {{count}} new updates',
    `${head('Your Tirbeo Digest')}${headerHtml(logo, 'Your Digest', 'You have <strong style="color:#ffffff;">{{count}}</strong> new updates.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Here's what's new since your last visit:</p>{{digestItems}}${buttonBlock('{{dashboardUrl}}', 'View All Updates')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">You received this email because you have notifications enabled. <a href="{{dashboardUrl}}/settings/notifications" style="color:#1A73E8;text-decoration:none;">Manage preferences</a></p>${bodyEnd()}${footerHtml()}`
  ),

  form_submission_confirmation: (logo) => tpl(
    'Form submitted successfully',
    `${head('Form Submitted')}${headerHtml(logo, 'Form submitted', 'Your response has been recorded.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Thank you for submitting the form <strong style="color:#202124;">{{formName}}</strong>. Your response has been recorded successfully.</p>${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't submit this form, you can ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  form_response: (logo) => tpl(
    'New response to "{{formTitle}}"',
    `${head('New Form Response')}${headerHtml(logo, 'New Form Response', 'A new response was submitted to your form.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">A new response has been submitted to your form <strong style="color:#202124;">{{formTitle}}</strong>.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Respondent:</strong> {{respondentName}} ({{respondentEmail}})</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Submitted:</strong> {{submittedAt}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Response ID:</strong> {{responseId}}</p></div><h2 style="font-size:16px;color:#202124;margin:16px 0 8px;">Responses</h2><div style="margin:16px 0;">{{answers}}</div>${buttonBlock('{{adminUrl}}', 'View in Admin')}${bodyEnd()}${footerHtml()}`
  ),

  form_notification: (logo) => tpl(
    'New form submission: {{formTitle}}',
    `${head('New Form Submission')}${headerHtml(logo, 'New submission', 'A new submission was received.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">A new submission was received for <strong style="color:#202124;">{{formTitle}}</strong>.</p>{{submissionData}}${buttonBlock('{{formUrl}}', 'View Submission')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">This is an automated notification from Tirbeo Forms.</p>${bodyEnd()}${footerHtml()}`
  ),

  account_recovery: (logo, imageBase) => tpl(
    'Your Tirbeo account recovery code',
    `${head('Account Recovery')}${headerHtml(logo, 'Account recovery', 'Use this code to recover your account.')}${bodyStart()}${heroImg(imageBase, 'account-recovery')}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Use this code to recover your Tirbeo account. This code expires in <strong style="color:#202124;">15 minutes</strong>.</p>${otpCodeBlock('{{otp}}')}${divider()}<p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you didn't request this, you can safely ignore this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  password_changed: (logo) => tpl(
    'Your Tirbeo password was changed',
    `${head('Password Changed')}${headerHtml(logo, 'Password changed', 'Your password was updated successfully.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your Tirbeo password was changed successfully.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Time:</strong> {{changedAt}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">IP:</strong> {{ipAddress}}</p></div><p style="margin:20px 0 0;font-size:14px;line-height:24px;color:#80868b;">If you didn't make this change, please reset your password immediately or contact support.</p>${bodyEnd()}${footerHtml()}`
  ),

  suspicious_login: (logo, imageBase) => tpl(
    'Suspicious login detected on your Tirbeo account',
    `${head('Security Alert')}${headerHtml(logo, 'Suspicious login detected', 'We noticed a sign-in from an unusual location.', 'linear-gradient(135deg,#b91c1c,#7f1d1d,#4a1a1a)')}${bodyStart()}${heroImg(imageBase, 'suspicious-login')}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">We noticed a sign-in to your Tirbeo account from an unusual location or device.</p><div style="background:#fff3e0;border:1px solid #ffe0b2;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Location:</strong> {{location}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Device:</strong> {{device}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Time:</strong> {{loginTime}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">IP:</strong> {{ipAddress}}</p></div><p style="margin:20px 0 0;font-size:14px;line-height:24px;color:#80868b;">If this was you, you can ignore this alert. If not, please secure your account immediately.</p>${buttonBlock('{{dashboardUrl}}', 'Review Account')}${bodyEnd()}${footerHtml()}`
  ),

  login_alert: (logo, imageBase) => tpl(
    'New sign-in to your Tirbeo account',
    `${head('New Sign-in')}${headerHtml(logo, 'New sign-in detected', 'A new sign-in was detected on your account.')}${bodyStart()}${heroImg(imageBase, 'new-device')}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello {{name}},</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">A new sign-in was detected on your Tirbeo account. If this was you, you can ignore this email.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:14px;padding:20px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Location:</strong> {{location}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Device:</strong> {{device}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Time:</strong> {{loginTime}}</p></div><p style="margin:20px 0 0;font-size:14px;line-height:24px;color:#80868b;">If this wasn't you, please change your password immediately and review your active sessions.</p>${buttonBlock('{{dashboardUrl}}', 'Review Account')}${bodyEnd()}${footerHtml()}`
  ),

  admin_alert: (logo) => tpl(
    '[Admin] {{subject}}',
    `${head('Admin Alert')}${headerHtml(logo, 'Admin Alert', '{{subject}}', 'linear-gradient(135deg,#b91c1c,#7f1d1d,#4a1a1a)')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello Admin,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">{{message}}</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;">{{details}}</div>${buttonBlock('{{dashboardUrl}}', 'View Admin Dashboard')}${divider()}<p style="margin:0;font-size:13px;line-height:22px;color:#80868b;">This is an automated alert from Tirbeo. Do not reply to this email.</p>${bodyEnd()}${footerHtml()}`
  ),

  system_alert: (logo) => tpl(
    '[System] {{subject}}',
    `${head('System Alert')}${headerHtml(logo, 'System Alert', '{{message}}', 'linear-gradient(135deg,#b91c1c,#7f1d1d,#4a1a1a)')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">{{message}}</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Service:</strong> {{service}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Time:</strong> {{alertTime}}</p></div>${bodyEnd()}${footerHtml()}`
  ),

  invoice: (logo) => tpl(
    'Your Tirbeo receipt — {{plan}}',
    `${head('Receipt')}${headerHtml(logo, 'Receipt', 'Thank you for your payment.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Thank you for your payment, {{name}}.</p><table style="width:100%;border-collapse:collapse;margin:16px 0;"><tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#5f6368;">Plan</td><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#202124;font-weight:600;text-align:right;">{{plan}}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#5f6368;">Amount</td><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#202124;font-weight:600;text-align:right;">{{amount}}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#5f6368;">Date</td><td style="padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px;color:#202124;font-weight:600;text-align:right;">{{date}}</td></tr></table>${bodyEnd()}${footerHtml()}`
  ),

  form_published: (logo) => tpl(
    'Your form "{{formTitle}}" is now live',
    `${head('Form Published')}${headerHtml(logo, 'Form is now live', 'Your form is accepting responses.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your form <strong style="color:#202124;">{{formTitle}}</strong> has been published and is now accepting responses.</p>${buttonBlock('{{formUrl}}', 'View Form')}${bodyEnd()}${footerHtml()}`
  ),

  form_closed: (logo) => tpl(
    'Your form "{{formTitle}}" has been closed',
    `${head('Form Closed')}${headerHtml(logo, 'Form closed', 'Your form is no longer accepting responses.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your form <strong style="color:#202124;">{{formTitle}}</strong> has been closed and is no longer accepting responses.</p><p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">You can reopen it anytime from your dashboard.</p>${bodyEnd()}${footerHtml()}`
  ),

  form_deleted: (logo) => tpl(
    'Your form "{{formTitle}}" has been deleted',
    `${head('Form Deleted')}${headerHtml(logo, 'Form deleted', 'Your form has been permanently deleted.', 'linear-gradient(135deg,#b91c1c,#7f1d1d,#4a1a1a)')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your form <strong style="color:#202124;">{{formTitle}}</strong> has been permanently deleted.</p><p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">This action cannot be undone. If this was a mistake, please contact support.</p>${bodyEnd()}${footerHtml()}`
  ),

  form_archived: (logo) => tpl(
    'Your form "{{formTitle}}" has been archived',
    `${head('Form Archived')}${headerHtml(logo, 'Form archived', 'Your form has been archived.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your form <strong style="color:#202124;">{{formTitle}}</strong> has been archived.</p><p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">Archived forms are hidden from your dashboard but can be restored anytime.</p>${bodyEnd()}${footerHtml()}`
  ),

  response_updated: (logo) => tpl(
    'A response to "{{formTitle}}" was updated',
    `${head('Response Updated')}${headerHtml(logo, 'Response updated', 'A form response was modified.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">A response to your form <strong style="color:#202124;">{{formTitle}}</strong> was updated.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Response ID:</strong> {{responseId}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Updated at:</strong> {{updatedAt}}</p></div>${bodyEnd()}${footerHtml()}`
  ),

  response_deleted: (logo) => tpl(
    'A response to "{{formTitle}}" was deleted',
    `${head('Response Deleted')}${headerHtml(logo, 'Response deleted', 'A form response was removed.', 'linear-gradient(135deg,#b91c1c,#7f1d1d,#4a1a1a)')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">A response to your form <strong style="color:#202124;">{{formTitle}}</strong> was deleted.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Response ID:</strong> {{responseId}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Deleted at:</strong> {{deletedAt}}</p></div>${bodyEnd()}${footerHtml()}`
  ),

  ticket_created: (logo) => tpl(
    'Support ticket opened: {{ticketSubject}}',
    `${head('Support Ticket Opened')}${headerHtml(logo, 'Support ticket opened', 'Your support ticket has been created.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your support ticket has been created.</p><div style="background:#f0f7ff;border:1px solid #e8eaed;border-radius:12px;padding:16px;margin:16px 0;"><p style="margin:0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Ticket:</strong> {{ticketId}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Subject:</strong> {{ticketSubject}}</p><p style="margin:8px 0 0;font-size:14px;color:#5f6368;"><strong style="color:#202124;">Status:</strong> {{ticketStatus}}</p></div>${buttonBlock('{{ticketUrl}}', 'View Ticket')}${bodyEnd()}${footerHtml()}`
  ),

  ticket_updated: (logo) => tpl(
    'Update on your support ticket {{ticketId}}',
    `${head('Ticket Updated')}${headerHtml(logo, 'Ticket updated', 'Your support ticket has a new update.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your support ticket <strong style="color:#202124;">{{ticketId}}</strong> has been updated.</p><p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">{{updateMessage}}</p>${buttonBlock('{{ticketUrl}}', 'View Ticket')}${bodyEnd()}${footerHtml()}`
  ),

  ticket_closed: (logo) => tpl(
    'Your support ticket {{ticketId}} has been closed',
    `${head('Ticket Closed')}${headerHtml(logo, 'Ticket closed', 'Your support ticket has been resolved.')}${bodyStart()}<p style="margin:0;font-size:16px;line-height:28px;color:#5f6368;">Hello,</p><p style="margin:20px 0 35px;font-size:16px;line-height:28px;color:#5f6368;">Your support ticket <strong style="color:#202124;">{{ticketId}}</strong> has been closed.</p><p style="margin:0;font-size:14px;line-height:24px;color:#80868b;">If you still need help, feel free to open a new ticket.</p>${bodyEnd()}${footerHtml()}`
  ),
};

export function buildTemplates(logoUrl: string = '', imageBase: string = DEFAULT_IMAGE_BASE): Record<string, EmailTemplate> {
  const logo = logoUrl || '';
  const result: Record<string, EmailTemplate> = {};
  for (const [key, fn] of Object.entries(EMAIL_TEMPLATES)) {
    result[key] = fn(logo, imageBase);
  }
  return result;
}

export function renderTemplate(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi'), val.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]));
  }
  return result;
}
