import { getCurrentPlan } from "@/lib/usePlan";
import { PLANS } from "@/lib/plans";

export function SmartButton() {
  const plan = getCurrentPlan();
  const locked = !PLANS[plan].features.noAds;

  return (
    <button
      disabled={locked}
      className={`px-4 py-2 rounded-lg ${
        locked
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-yellow-500 text-black"
      }`}
    >
      {locked ? "Upgrade to unlock" : "Continue"}
    </button>
  );
}
