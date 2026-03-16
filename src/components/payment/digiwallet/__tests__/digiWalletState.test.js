import {
  getDigiWalletErrorMessage,
  resolveDigiWalletConfirmation,
  resolveDigiWalletInitiation,
  resolveDigiWalletPollStatus,
  resolveDigiWalletResend,
} from "../digiWalletState"

const t = (value) => value

describe("digiWalletState", () => {
  it("maps a successful OTP request into the otp_sent state", () => {
    expect(
      resolveDigiWalletInitiation(
        {
          status: "OTP_SENT",
          request_id: "394",
          message: "Target account found, id = 2038 group = 11 balance = 144.17",
        },
        t
      )
    ).toEqual({
      nextStatus: "otp_sent",
      requestId: "394",
      message: "Target account found, id = 2038 group = 11 balance = 144.17",
      error: "",
      resendCooldown: 60,
    })
  })

  it("surfaces the invalid mobile error described in the staging spec", () => {
    expect(
      resolveDigiWalletInitiation(
        {
          status: "INVALID_MOBILE",
          message:
            "The mobile number you entered is not registered with DigiWallet. Please use a valid Belize number (501-XXX-XXXX).",
        },
        t
      )
    ).toEqual({
      nextStatus: "failed",
      requestId: null,
      message: "",
      error:
        "The mobile number you entered is not registered with DigiWallet. Please use a valid Belize number (501-XXX-XXXX).",
      resendCooldown: 0,
    })
  })

  it("keeps the OTP screen active when DigiWallet rejects an incorrect confirmation code", () => {
    expect(
      resolveDigiWalletConfirmation(
        {
          status: "INVALID_OTP",
          allow_retry: true,
          message:
            "The confirmation code you entered is incorrect. Please check the SMS and try again.",
        },
        t
      )
    ).toEqual({
      nextStatus: "otp_sent",
      message: "",
      error:
        "The confirmation code you entered is incorrect. Please check the SMS and try again.",
    })
  })

  it("fails hard when DigiWallet reports the OTP has already been used", () => {
    expect(
      resolveDigiWalletConfirmation(
        {
          status: "OTP_ALREADY_USED",
          allow_retry: false,
          message:
            "This payment has already been completed. Please check your transaction history.",
        },
        t
      )
    ).toEqual({
      nextStatus: "failed",
      message: "",
      error:
        "This payment has already been completed. Please check your transaction history.",
    })
  })

  it("maps polling success from the DigiWallet status endpoint", () => {
    expect(
      resolveDigiWalletPollStatus({
        data: { digiwallet_status: "APPROVED" },
        pollCount: 4,
        t,
      })
    ).toEqual({
      nextStatus: "success",
      message: "Payment completed successfully.",
      error: "",
      pollCount: 4,
    })
  })

  it("moves to pending after repeated unresolved status polls", () => {
    expect(
      resolveDigiWalletPollStatus({
        data: { digiwallet_status: "PENDING" },
        pollCount: 30,
        t,
      })
    ).toEqual({
      nextStatus: "pending",
      message: "Payment is still pending. Please check again later.",
      error: "",
      pollCount: 31,
    })
  })

  it("maps OTP resend success to a fresh request id and cooldown", () => {
    expect(
      resolveDigiWalletResend(
        {
          status: "OTP_SENT",
          request_id: "395",
          message: "A new OTP has been sent",
        },
        t
      )
    ).toEqual({
      nextStatus: "otp_sent",
      requestId: "395",
      message: "A new OTP has been sent",
      error: "",
      resendCooldown: 60,
      clearOtp: true,
    })
  })

  it("extracts a useful error message from failed DigiWallet requests", () => {
    expect(
      getDigiWalletErrorMessage(
        {
          response: {
            data: {
              message:
                "You don't have enough balance in your DigiWallet account. Please top up and try again.",
            },
          },
        },
        "fallback"
      )
    ).toBe(
      "You don't have enough balance in your DigiWallet account. Please top up and try again."
    )
  })
})
