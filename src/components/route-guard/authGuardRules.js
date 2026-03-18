export const canAccessProtectedRoute = ({
  token,
  guest,
  orderId,
  guestCheckoutStatus,
}) => {
  if (token) {
    return true;
  }

  if (guest && orderId) {
    return true;
  }

  return Boolean(guest && guestCheckoutStatus === 1);
};
