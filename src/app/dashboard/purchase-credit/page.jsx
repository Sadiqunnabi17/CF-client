"use client";
import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import stripePromise from "@/lib/stripe";

const packages = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

function CheckoutForm({ credits, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setSubmitting(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await axiosInstance.post("/payments/confirm", { paymentIntentId: paymentIntent.id });
        toast.success(`${credits} credits added!`);
        onSuccess();
      } catch (err) {
        setError("Payment succeeded but crediting failed — contact support.");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || submitting}
        className="mt-4 w-full bg-indigo-600 text-white p-2 rounded disabled:opacity-50"
      >
        {submitting ? "Processing..." : `Pay $${packages.find((p) => p.credits === credits)?.price}`}
      </button>
    </div>
  );
}

function PurchaseCreditContent() {
  const { user, loginUser } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const handleSelect = async (credits) => {
    setSelectedPackage(credits);
    setClientSecret(null);
    try {
      const res = await axiosInstance.post("/payments/create-payment-intent", { credits });
      setClientSecret(res.data.clientSecret);
    } catch (err) {
      toast.error("Failed to start payment");
    }
  };

  const handleSuccess = async () => {
    const res = await axiosInstance.get("/auth/me");
    loginUser({ token: localStorage.getItem("access-token"), user: res.data });
    setSelectedPackage(null);
    setClientSecret(null);
  };

  if (user && user.role !== "Supporter") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Supporters can purchase credits.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 mb-16">
      <h1 className="text-2xl font-bold mb-2">Purchase Credit</h1>
      <p className="text-slate-500 mb-6">Current balance: {user?.credits} credits</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.credits}
            type="button"
            onClick={() => handleSelect(pkg.credits)}
            className={`border rounded-lg p-4 text-center hover:border-indigo-600 transition-colors ${
              selectedPackage === pkg.credits ? "border-indigo-600 ring-1 ring-slate-900" : ""
            }`}
          >
            <p className="text-xl font-bold">{pkg.credits}</p>
            <p className="text-slate-500 text-sm">credits</p>
            <p className="text-slate-700 font-semibold mt-2">${pkg.price}</p>
          </button>
        ))}
      </div>

      {clientSecret && (
        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="font-semibold mb-2">Pay for {selectedPackage} credits</h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm credits={selectedPackage} onSuccess={handleSuccess} />
          </Elements>
        </div>
      )}
    </div>
  );
}

export default function PurchaseCreditPage() {
  return (
    <PrivateRoute>
      <PurchaseCreditContent />
    </PrivateRoute>
  );
}