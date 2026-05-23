export function getRiskLabel(value = 0) {
  if (value >= 80) return "Critical";
  if (value >= 60) return "High";
  if (value >= 35) return "Medium";
  return "Low";
}
