import { ENV } from '../config/env';
import { resendClient, isResendConfigured } from '../config/resend';

export interface SendVerificationEmailParams {
  to: string;
  verificationLink: string;
  otpCode?: string;
  isNewUserLogin?: boolean;
}

export class EmailService {
  /**
   * Generates a modern, dark-themed, responsive HTML email template
   * matching DB-Generator Studio's Obsidian Nebula design system.
   */
  public static generateVerificationEmailHtml(params: {
    email: string;
    verificationLink: string;
    otpCode?: string;
    isNewUserLogin?: boolean;
  }): string {
    const { email, verificationLink, otpCode, isNewUserLogin } = params;

    const headline = isNewUserLogin
      ? 'Verify Your Email to Complete Login'
      : 'Verify Your Email Address';

    const subheadline = isNewUserLogin
      ? 'A new login attempt requires email confirmation before accessing your DB-Generator Studio workspace.'
      : 'Welcome to DB-Generator Studio! Complete your registration to start generating 3NF relational schemas, visual ERDs, and production migrations.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <meta name="supported-color-schemes" content="dark light" />
  <title>${headline} - DB-Generator Studio</title>
  <style>
    :root {
      color-scheme: dark;
    }
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #07060d;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07060d; color: #f1f5f9;">
  <!-- Outer Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #07060d; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <!-- Container Table -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 10px 14px; border-radius: 12px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%); border: 1px solid rgba(139, 92, 246, 0.3);">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align: middle; padding-right: 10px;">
                            <div style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); text-align: center; line-height: 28px; color: #ffffff; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.5);">
                              &#9881;
                            </div>
                          </td>
                          <td style="vertical-align: middle;">
                            <span style="font-size: 18px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff; text-decoration: none;">
                              DB-Generator <span style="color: #a78bfa; font-weight: 400; font-size: 14px;">Studio</span>
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f1322; border-radius: 16px; border: 1px solid #232942; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6); overflow: hidden;">
                <!-- Card Header Accent Line -->
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #7c3aed 0%, #6366f1 50%, #38bdf8 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

                <!-- Card Body -->
                <tr>
                  <td style="padding: 36px 32px 32px 32px;">
                    <!-- Badge -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 9999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.5px;">
                          Security Verification
                        </td>
                      </tr>
                    </table>

                    <!-- Headline -->
                    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.5px;">
                      ${headline}
                    </h1>

                    <!-- Paragraph -->
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                      ${subheadline}
                    </p>

                    <!-- Account Info Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #171c2e; border: 1px solid #28314e; border-radius: 10px;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <div style="font-size: 12px; font-weight: 500; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Target Account</div>
                          <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 14px; font-weight: 600; color: #e2e8f0; word-break: break-all;">
                            ${email}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); box-shadow: 0 4px 20px rgba(124, 58, 237, 0.45);">
                                <a href="${verificationLink}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">
                                  Verify Email Address &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${
                      otpCode
                        ? `
                    <!-- One-Time Code Section -->
                    <div style="margin-bottom: 28px; text-align: center;">
                      <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">Or enter this one-time verification code:</div>
                      <div style="display: inline-block; background-color: #171c2e; border: 1px solid #3b4262; border-radius: 8px; padding: 12px 24px; font-family: monospace; font-size: 26px; font-weight: 700; letter-spacing: 6px; color: #a78bfa;">
                        ${otpCode}
                      </div>
                    </div>
                    `
                        : ''
                    }

                    <!-- Fallback Link Section -->
                    <div style="padding-top: 20px; border-top: 1px solid #1e2439; margin-top: 10px;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                        If the button above does not work, copy and paste this verification link into your browser:
                      </p>
                      <p style="margin: 0; font-size: 12px; line-height: 1.4; word-break: break-all;">
                        <a href="${verificationLink}" target="_blank" style="color: #a78bfa; text-decoration: underline; font-family: monospace;">
                          ${verificationLink}
                        </a>
                      </p>
                    </div>

                    <!-- Security Reminder -->
                    <div style="margin-top: 24px; background-color: rgba(30, 41, 59, 0.5); border-left: 3px solid #8b5cf6; border-radius: 0 6px 6px 0; padding: 12px 14px;">
                      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                        &#128274; <strong>Security Notice:</strong> This link expires in <strong>24 hours</strong>. If you did not request this email or attempt to log in to DB-Generator Studio, please disregard it. Your account remains protected.
                      </p>
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 28px; padding-bottom: 16px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                &copy; ${new Date().getFullYear()} DB-Generator Studio. Next-Generation AI Database Architect.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                This automated email was dispatched via Resend. Please do not reply directly to this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /**
   * Plain text fallback for email clients that do not render HTML.
   */
  public static generateVerificationEmailText(params: {
    email: string;
    verificationLink: string;
    otpCode?: string;
    isNewUserLogin?: boolean;
  }): string {
    const { email, verificationLink, otpCode, isNewUserLogin } = params;

    let text = `DB-Generator Studio - Email Verification\n`;
    text += `=========================================\n\n`;

    if (isNewUserLogin) {
      text += `A new login attempt was made for your account: ${email}.\n`;
      text += `Please verify your email address to complete your login.\n\n`;
    } else {
      text += `Welcome to DB-Generator Studio!\n`;
      text += `Please verify your email address (${email}) to activate your account.\n\n`;
    }

    text += `Click the link below to verify your email:\n`;
    text += `${verificationLink}\n\n`;

    if (otpCode) {
      text += `Verification Code: ${otpCode}\n\n`;
    }

    text += `This link expires in 24 hours.\n`;
    text += `If you did not request this, you can safely ignore this email.\n\n`;
    text += `--\nDB-Generator Studio Team\n`;

    return text;
  }

  /**
   * Sends a verification email to the user using Resend.
   */
  public static async sendVerificationEmail(
    params: SendVerificationEmailParams
  ): Promise<{ success: boolean; id?: string; simulated?: boolean; message?: string; verificationLink?: string }> {
    const { to, verificationLink, otpCode, isNewUserLogin } = params;

    if (!to || !verificationLink) {
      throw new Error('Recipient email and verification link are required');
    }

    const html = this.generateVerificationEmailHtml({
      email: to,
      verificationLink,
      otpCode,
      isNewUserLogin,
    });

    const text = this.generateVerificationEmailText({
      email: to,
      verificationLink,
      otpCode,
      isNewUserLogin,
    });

    const subject = isNewUserLogin
      ? 'Verify your email to complete login - DB-Generator Studio'
      : 'Verify your email address - DB-Generator Studio';

    // If Resend is not configured, gracefully simulate in local development
    if (!isResendConfigured()) {
      console.warn(
        `\n[Resend Email Service - Simulation Mode]` +
        `\n  To: ${to}` +
        `\n  Subject: ${subject}` +
        `\n  Verification Link: ${verificationLink}` +
        (otpCode ? `\n  OTP Code: ${otpCode}` : '') +
        `\n  (Set RESEND_API_KEY in .env to deliver real emails)\n`
      );

      return {
        success: true,
        simulated: true,
        message: 'Verification email simulated (RESEND_API_KEY not configured). Check server console for link.',
      };
    }

    try {
      const fromEmail = ENV.RESEND_FROM_EMAIL || 'DB-Generator Studio <onboarding@resend.dev>';

      const response = await resendClient.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text,
      });

      if (response.error) {
        console.warn('[Resend Email Service] Resend dispatch note:', response.error.message);
        console.log(`\n==================================================`);
        console.log(`[RESEND SANDBOX / SIMULATION LINK]`);
        console.log(`Recipient: ${to}`);
        console.log(`Verification URL: ${verificationLink}`);
        if (otpCode) console.log(`OTP Code: ${otpCode}`);
        console.log(`Reason: ${response.error.message}`);
        console.log(`==================================================\n`);

        return {
          success: true,
          simulated: true,
          verificationLink,
          message: `Verification link generated! (Resend sandbox: deliverable only to account owner or via server console).`,
        };
      }

      console.log(`[Resend Email Service] Email delivered to ${to}, Resend ID: ${response.data?.id}`);

      return {
        success: true,
        id: response.data?.id,
        simulated: false,
        verificationLink,
        message: 'Verification email delivered successfully.',
      };
    } catch (err: any) {
      console.warn('[Resend Email Service] Exception sending email:', err.message || err);
      console.log(`\n==================================================`);
      console.log(`[FALLBACK VERIFICATION LINK]`);
      console.log(`Recipient: ${to}`);
      console.log(`Verification URL: ${verificationLink}`);
      if (otpCode) console.log(`OTP Code: ${otpCode}`);
      console.log(`==================================================\n`);

      return {
        success: true,
        simulated: true,
        verificationLink,
        message: 'Verification link generated (check server console or use direct link).',
      };
    }
  }

  /**
   * Generates a modern, dark-themed HTML password reset email template.
   */
  public static generatePasswordResetEmailHtml(params: {
    email: string;
    resetLink: string;
  }): string {
    const { email, resetLink } = params;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password - DB-Generator Studio</title>
  <style>
    body {
      margin: 0; padding: 0; width: 100% !important; background-color: #07060d; color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07060d; color: #f1f5f9;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #07060d; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <span style="font-size: 18px; font-weight: 700; color: #ffffff;">
                DB-Generator <span style="color: #a78bfa; font-weight: 400; font-size: 14px;">Studio</span>
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f1322; border-radius: 16px; border: 1px solid #232942; overflow: hidden;">
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #38bdf8 100%);">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 36px 32px 32px 32px;">
                    <div style="display: inline-block; background-color: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.35); border-radius: 9999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #f472b6; text-transform: uppercase; margin-bottom: 20px;">
                      Password Recovery
                    </div>
                    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
                      Reset Your Password
                    </h1>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                      We received a request to reset the password for your DB-Generator Studio account. Click the button below to choose a new password.
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #171c2e; border: 1px solid #28314e; border-radius: 10px;">
                      <tr>
                        <td style="padding: 14px 18px;">
                          <div style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px;">Account</div>
                          <div style="font-family: monospace; font-size: 14px; font-weight: 600; color: #e2e8f0;">${email}</div>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 15px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); box-shadow: 0 4px 20px rgba(124, 58, 237, 0.45);">
                            Reset Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="padding-top: 20px; border-top: 1px solid #1e2439; margin-top: 10px;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                        If the button above doesn't work, copy and paste this link:
                      </p>
                      <p style="margin: 0; font-size: 12px; word-break: break-all;">
                        <a href="${resetLink}" target="_blank" style="color: #a78bfa; font-family: monospace;">${resetLink}</a>
                      </p>
                    </div>
                    <div style="margin-top: 24px; background-color: rgba(30, 41, 59, 0.5); border-left: 3px solid #ec4899; padding: 12px 14px; border-radius: 0 6px 6px 0;">
                      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                        &#128274; This link is valid for <strong>1 hour</strong>. If you did not request a password reset, please ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /**
   * Sends a password reset email using Resend with graceful fallback.
   */
  public static async sendPasswordResetEmail(params: {
    to: string;
    resetLink: string;
  }): Promise<{ success: boolean; id?: string; simulated?: boolean; message?: string; resetLink?: string }> {
    const { to, resetLink } = params;

    if (!to || !resetLink) {
      throw new Error('Recipient email and reset link are required');
    }

    const html = this.generatePasswordResetEmailHtml({ email: to, resetLink });
    const text = `DB-Generator Studio - Password Reset\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`;
    const subject = 'Reset your password - DB-Generator Studio';

    if (!isResendConfigured()) {
      console.warn(
        `\n[Resend Email Service - Password Reset Simulation]` +
        `\n  To: ${to}` +
        `\n  Reset Link: ${resetLink}\n`
      );
      return {
        success: true,
        simulated: true,
        resetLink,
        message: 'Password reset link simulated (RESEND_API_KEY not configured). Check server console.',
      };
    }

    try {
      const fromEmail = ENV.RESEND_FROM_EMAIL || 'DB-Generator Studio <onboarding@resend.dev>';
      const response = await resendClient.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text,
      });

      if (response.error) {
        console.warn('[Resend Email Service] Password reset dispatch notice:', response.error.message);
        console.log(`\n==================================================`);
        console.log(`[RESEND SANDBOX / PASSWORD RESET LINK]`);
        console.log(`Recipient: ${to}`);
        console.log(`Reset URL: ${resetLink}`);
        console.log(`Reason: ${response.error.message}`);
        console.log(`==================================================\n`);

        return {
          success: true,
          simulated: true,
          resetLink,
          message: 'Password reset link generated! (Resend sandbox: check server console or use direct link).',
        };
      }

      console.log(`[Resend Email Service] Password reset email delivered to ${to}, Resend ID: ${response.data?.id}`);
      return {
        success: true,
        id: response.data?.id,
        simulated: false,
        resetLink,
        message: 'Password reset email sent successfully.',
      };
    } catch (err: any) {
      console.warn('[Resend Email Service] Exception sending password reset:', err.message || err);
      console.log(`\n==================================================`);
      console.log(`[FALLBACK PASSWORD RESET LINK]`);
      console.log(`Recipient: ${to}`);
      console.log(`Reset URL: ${resetLink}`);
      console.log(`==================================================\n`);

      return {
        success: true,
        simulated: true,
        resetLink,
        message: 'Password reset link generated (check server console or use direct link).',
      };
    }
  }
}
