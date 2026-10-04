import { Resend } from 'resend';
import { ENV } from './env';

// Initialize Resend client with API key from ENV
export const resendClient = new Resend(ENV.RESEND_API_KEY || 're_placeholder');

export const isResendConfigured = (): boolean => {
  return Boolean(
    ENV.RESEND_API_KEY &&
    !ENV.RESEND_API_KEY.includes('your-resend-api-key') &&
    !ENV.RESEND_API_KEY.includes('placeholder')
  );
};
