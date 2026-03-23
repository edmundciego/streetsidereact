import toast from "react-hot-toast"
import {
  buildFailedPaymentCallbackUrl,
  handleFailedOrderPlace,
  initiateFailedPaymentRedirect,
} from "../paymentFailureHandler"
import { OrderApi } from "../../api-manage/another-formated-api/orderApi"

jest.mock("../../api-manage/another-formated-api/orderApi", () => ({
  OrderApi: {
    initiatePayment: jest.fn(),
  },
}))

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}))

describe("paymentFailureHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("builds the my-orders callback URL used by PlaceToPay redirects", () => {
    expect(buildFailedPaymentCallbackUrl("https://streetside.test")).toBe(
      "https://streetside.test/profile?page=my-orders"
    )
  })

  it("initiates a PlaceToPay payment and redirects to the gateway URL", async () => {
    const router = { push: jest.fn().mockResolvedValue(true) }
    const storage = { setItem: jest.fn() }

    OrderApi.initiatePayment.mockResolvedValue({
      data: {
        redirect_url: "https://checkout.placetopay.test/session/abc123",
        payment_id: "payment-123",
      },
    })

    const result = await initiateFailedPaymentRedirect({
      paymentMethod: "placetopay",
      orderId: 45,
      customerId: 9,
      router,
      storage,
      origin: "https://streetside.test",
    })

    expect(OrderApi.initiatePayment).toHaveBeenCalledWith({
      order_id: 45,
      customer_id: 9,
      payment_platform: "web",
      callback: "https://streetside.test/profile?page=my-orders",
      payment_method: "placetopay",
    })
    expect(storage.setItem).toHaveBeenCalledWith(
      "pending_payment_45",
      "payment-123"
    )
    expect(router.push).toHaveBeenCalledWith(
      "https://checkout.placetopay.test/session/abc123",
      undefined,
      { shallow: true }
    )
    expect(result).toEqual({
      callback: "https://streetside.test/profile?page=my-orders",
      paymentId: "payment-123",
      redirectUrl: "https://checkout.placetopay.test/session/abc123",
    })
  })

  it("falls back to the payment id embedded in the redirect URL for PlaceToPay", async () => {
    const router = { push: jest.fn().mockResolvedValue(true) }
    const storage = { setItem: jest.fn() }

    OrderApi.initiatePayment.mockResolvedValue({
      data: {
        redirect_url:
          "https://base.streetsideapp.com/payment/placetoPay/pay/?payment_id=embedded-456",
      },
    })

    const result = await initiateFailedPaymentRedirect({
      paymentMethod: "placetopay",
      orderId: 52,
      customerId: 9,
      router,
      storage,
      origin: "https://streetside.test",
    })

    expect(storage.setItem).toHaveBeenCalledWith(
      "pending_payment_52",
      "embedded-456"
    )
    expect(router.push).toHaveBeenCalledWith(
      "https://base.streetsideapp.com/payment/placetoPay/pay/?payment_id=embedded-456",
      undefined,
      { shallow: true }
    )
    expect(result).toEqual({
      callback: "https://streetside.test/profile?page=my-orders",
      paymentId: "embedded-456",
      redirectUrl:
        "https://base.streetsideapp.com/payment/placetoPay/pay/?payment_id=embedded-456",
    })
  })

  it("keeps the DigiWallet branch separate from the PlaceToPay redirect flow", async () => {
    const router = { push: jest.fn().mockResolvedValue(true) }

    OrderApi.initiatePayment.mockResolvedValue({
      data: {
        redirect_url: "https://gateway.example.test/ignored",
        payment_id: "payment-xyz",
      },
    })

    await handleFailedOrderPlace({
      paymentMethod: "digiwallet",
      profileInfo: { id: 11 },
      orderId: 78,
      router,
      origin: "https://streetside.test",
      storage: { setItem: jest.fn() },
    })

    expect(router.push).toHaveBeenCalledWith(
      {
        pathname: "/digiwallet-payment",
        query: {
          payment_id: "payment-xyz",
          order_id: 78,
          callback: "https://streetside.test/profile?page=my-orders",
        },
      },
      undefined,
      { shallow: true }
    )
  })

  it("surfaces an initiation error when the PlaceToPay response is incomplete", async () => {
    const router = { push: jest.fn() }

    OrderApi.initiatePayment.mockResolvedValue({
      data: {
        payment_id: "payment-123",
      },
    })

    const result = await initiateFailedPaymentRedirect({
      paymentMethod: "placeToPay",
      orderId: 91,
      customerId: 17,
      router,
      origin: "https://streetside.test",
    })

    expect(router.push).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith("Missing payment redirect.")
    expect(result).toBeNull()
  })
})
