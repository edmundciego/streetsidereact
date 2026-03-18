const { canAccessProtectedRoute } = require("../authGuardRules");

describe("authGuardRules", () => {
  it("allows signed-in customers without requiring an order id", () => {
    expect(
      canAccessProtectedRoute({
        token: "customer-token",
        guest: null,
        orderId: undefined,
        guestCheckoutStatus: 0,
      })
    ).toBe(true);
  });

  it("allows guest users when they have an order id", () => {
    expect(
      canAccessProtectedRoute({
        token: null,
        guest: "guest-id",
        orderId: "12345",
        guestCheckoutStatus: 0,
      })
    ).toBe(true);
  });

  it("allows guest checkout when the feature is enabled", () => {
    expect(
      canAccessProtectedRoute({
        token: null,
        guest: "guest-id",
        orderId: undefined,
        guestCheckoutStatus: 1,
      })
    ).toBe(true);
  });

  it("blocks access when no allowed auth state is present", () => {
    expect(
      canAccessProtectedRoute({
        token: null,
        guest: null,
        orderId: undefined,
        guestCheckoutStatus: 0,
      })
    ).toBe(false);
  });
});
