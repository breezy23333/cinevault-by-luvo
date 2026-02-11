import { Plan } from "./plans";

export function getCurrentPlan(): Plan {
  // TEMP: simulate logged-in user
  return "free"; // change to "plus" or "supporter" to test
}
