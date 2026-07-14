"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const CREDITS_PER_DOLLAR = 20;
const MIN_WITHDRAWAL_CREDITS = 200;

function WithdrawalsContent() {
  const { user } = useAuth();
  const [availableCredits, setAvailableCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creditsToWithdraw, setCreditsToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("Stripe");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAvailable = () => {
    axiosInstance
      .get("/withdrawals/available-credits")
      .then((res) => setAvailableCredits(res.data.availableCredits))
      .catch(() => toast.error("Failed to load available credits"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAvailable();
  }, []);

  const withdrawAmountDollars = creditsToWithdraw
    ? (Number(creditsToWithdraw) / CREDITS_PER_DOLLAR).toFixed(2)
    : "0.00";

  const canWithdraw = availableCredits >= MIN_WITHDRAWAL_CREDITS;

  const handleSubmit = async () => {
    setError("");
    const credits = Number(creditsToWithdraw);

    if (!credits || credits < MIN_WITHDRAWAL_CREDITS) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAWAL_CREDITS} credits`);
      return;
    }
    if (credits > availableCredits) {
      setError("Cannot exceed your total raised credits");
      return;
    }
    if (!accountNumber) {
      setError("Enter an account number");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post("/withdrawals", {
        withdrawal_credit: credits,
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      toast.success("Withdrawal request submitted");
      setCreditsToWithdraw("");
      setAccountNumber("");
      fetchAvailable();
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (user && user.role !== "Creator") {
    return (
      <p className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Only Creators can view this page.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg mb-16">
      <h1 className="text-2xl font-bold mb-2">Withdrawals</h1>
      <p className="text-slate-600 mb-6">
        Available: <strong>{availableCredits} credits</strong> (
        {(availableCredits / CREDITS_PER_DOLLAR).toFixed(2)} USD)
      </p>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex flex-col gap-3">
        <input
          type="number"
          min={MIN_WITHDRAWAL_CREDITS}
          placeholder={`Credits To Withdraw (min ${MIN_WITHDRAWAL_CREDITS})`}
          value={creditsToWithdraw}
          onChange={(e) => setCreditsToWithdraw(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={`$${withdrawAmountDollars}`}
          disabled
          className="border p-2 rounded bg-slate-50 text-slate-500"
        />
        <select
          value={paymentSystem}
          onChange={(e) => setPaymentSystem(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Stripe">Stripe</option>
          <option value="Bkash">Bkash</option>
          <option value="Rocket">Rocket</option>
          <option value="Nagad">Nagad</option>
        </select>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border p-2 rounded"
        />

        {canWithdraw ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-indigo-600 text-white p-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Withdraw"}
          </button>
        ) : (
          <p className="text-red-500 text-sm text-center">Insufficient credit</p>
        )}
      </div>
    </div>
  );
}

export default function WithdrawalsPage() {
  return (
    <PrivateRoute>
      <WithdrawalsContent />
    </PrivateRoute>
  );
}