export const DIGIWALLET_ERROR_CODES = {
  INVALID_MOBILE: '100508',
  INVALID_OTP: '100512',
  OTP_ALREADY_USED: '100513',
  INSUFFICIENT_FUNDS: '100702',
};

export const DIGIWALLET_ERRORS = {
  INVALID_MOBILE: {
    code: '100508',
    status: 'INVALID_MOBILE',
    title: 'Invalid Mobile Number',
    message: 'The mobile number you entered is not registered with DigiWallet.',
    action: 'Please verify your DigiWallet mobile number and try again.',
    allowRetry: true,
    icon: '📱',
  },
  INVALID_OTP: {
    code: '100512',
    status: 'INVALID_OTP',
    title: 'Incorrect Code',
    message: 'The confirmation code you entered is incorrect.',
    action: 'Please check the SMS we sent and try again.',
    allowRetry: true,
    icon: '🔢',
  },
  OTP_ALREADY_USED: {
    code: '100513',
    status: 'OTP_ALREADY_USED',
    title: 'Payment Already Completed',
    message: 'This payment has already been processed.',
    action: 'Check your order history for details.',
    allowRetry: false,
    icon: '✅',
  },
  INSUFFICIENT_FUNDS: {
    code: '100702',
    status: 'INSUFFICIENT_FUNDS',
    title: 'Insufficient Balance',
    message: "You don't have enough balance in your DigiWallet account.",
    action: 'Please top up your account or choose another payment method.',
    allowRetry: true,
    icon: '💰',
  },
};

/**
 * Get user-friendly error details from API response
 * @param {Object} errorResponse - API error response
 * @returns {Object} Error details with user-friendly messages
 */
export const getDigiWalletError = (errorResponse) => {
  const status = String(errorResponse?.status || '').toUpperCase();
  const errorCode = errorResponse?.error_code || errorResponse?.code;
  
  // Try to match by status first
  if (DIGIWALLET_ERRORS[status]) {
    return DIGIWALLET_ERRORS[status];
  }
  
  // Try to match by error code
  const errorByCode = Object.values(DIGIWALLET_ERRORS).find(
    (err) => err.code === String(errorCode)
  );
  if (errorByCode) {
    return errorByCode;
  }
  
  // Default error
  return {
    status: 'ERROR',
    title: 'Payment Error',
    message: errorResponse?.message || 'An error occurred while processing your payment.',
    action: 'Please try again or contact support.',
    allowRetry: true,
    icon: '⚠️',
  };
};

/**
 * Check if error allows retry
 * @param {string} errorStatus - Error status from API
 * @returns {boolean}
 */
export const canRetryPayment = (errorStatus) => {
  const error = DIGIWALLET_ERRORS[errorStatus];
  return error ? error.allowRetry : true;
};
