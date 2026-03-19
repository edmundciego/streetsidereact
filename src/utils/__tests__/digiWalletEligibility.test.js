import {
  filterDigiWalletMethods,
  isBelizeDigiWalletEligible,
} from "../digiWalletEligibility"

describe("digiWalletEligibility", () => {
  it("accepts verified Belize numbers for DigiWallet", () => {
    expect(
      isBelizeDigiWalletEligible({
        is_phone_verified: 1,
        phone: "+5016205821",
      })
    ).toBe(true)
  })

  it("rejects unverified or non-Belize profiles for DigiWallet", () => {
    expect(
      isBelizeDigiWalletEligible({
        is_phone_verified: 0,
        phone: "+5016205821",
      })
    ).toBe(false)

    expect(
      isBelizeDigiWalletEligible({
        is_phone_verified: 1,
        phone: "+15551234567",
      })
    ).toBe(false)
  })

  it("filters DigiWallet out while leaving other gateways intact", () => {
    const methods = [
      { gateway: "digiWallet", gateway_title: "DigiWallet" },
      { gateway: "stripe", gateway_title: "Stripe" },
    ]

    expect(
      filterDigiWalletMethods(methods, {
        is_phone_verified: 0,
        phone: "+5016205821",
      })
    ).toEqual([{ gateway: "stripe", gateway_title: "Stripe" }])

    expect(
      filterDigiWalletMethods(methods, {
        is_phone_verified: 1,
        phone: "6205821",
      })
    ).toEqual(methods)
  })
})
