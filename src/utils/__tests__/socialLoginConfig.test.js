const {
  getSocialLoginClientId,
  getSocialLoginConfig,
} = require("../socialLoginConfig");

describe("socialLoginConfig", () => {
  it("returns the matching social login config when available", () => {
    const config = {
      social_login: [
        { login_medium: "google", client_id: "google-client-id" },
        { login_medium: "facebook", client_id: "facebook-client-id" },
      ],
    };

    expect(getSocialLoginConfig(config, "google")).toEqual({
      login_medium: "google",
      client_id: "google-client-id",
    });
  });

  it("returns an empty client id when the social login config is missing", () => {
    expect(getSocialLoginClientId({}, "google")).toBe("");
    expect(getSocialLoginClientId(null, "google")).toBe("");
  });

  it("returns the configured client id for the requested provider", () => {
    const config = {
      social_login: [{ login_medium: "facebook", client_id: "fb-client-id" }],
    };

    expect(getSocialLoginClientId(config, "facebook")).toBe("fb-client-id");
  });
});
