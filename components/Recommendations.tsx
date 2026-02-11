import { getCurrentPlan } from "@/lib/usePlan";
import { PLANS } from "@/lib/plans";

export default function Recommendations() {
  const plan = getCurrentPlan();

  if (!PLANS[plan].features.advancedRecommendations) {
    return (
      <div className="bg-[#111827] border border-yellow-500/40 rounded-xl p-6 text-center">
        <p className="text-gray-300 mb-4">
          Advanced recommendations are available on Plus.
        </p>
        <a
          href="/store"
          className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
        >
          Upgrade
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* REAL advanced recommendation UI */}
    </div>
  );
}
