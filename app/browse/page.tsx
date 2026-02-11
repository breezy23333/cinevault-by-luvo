import { getCurrentPlan } from "@/lib/usePlan";
import { PLANS } from "@/lib/plans";

export default function BrowsePage() {
  const plan = getCurrentPlan();

  return (
    <main>
      {PLANS[plan].features.advancedRecommendations ? (
        <AdvancedBrowse />
      ) : (
        <UpgradePrompt />
      )}
    </main>
  );
}
