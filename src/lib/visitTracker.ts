const VISIT_KEY = "urbanmart_has_visited";

export function hasVisitedBefore(): boolean {
  return localStorage.getItem(VISIT_KEY) === "true";
}

export function markAsVisited(): void {
  localStorage.setItem(VISIT_KEY, "true");
}
