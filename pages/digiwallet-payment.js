import React, { useEffect } from "react";
import MainLayout from "../src/components/layout/MainLayout";
import DigiWalletPayment from "../src/components/payment/digiwallet/DigiWalletPayment";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { hydrateFromQuery } from "../src/redux/slices/digiWalletSlice";

const DigiWalletPaymentPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const {
      payment_id,
      order_id,
      request_id,
      amount,
      phone,
      status,
      message,
      callback,
    } = router.query;
    if (payment_id) {
      dispatch(
        hydrateFromQuery({
          paymentId: payment_id,
          orderId: order_id,
          requestId: request_id,
          amount,
          phone,
          status,
          message,
          callback,
        })
      );
    }
  }, [dispatch, router.isReady, router.query]);

  return (
    <MainLayout>
      <DigiWalletPayment />
    </MainLayout>
  );
};

export default DigiWalletPaymentPage;
