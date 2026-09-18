import requirementData from "@/data/requirements.json";
import type { RequirementRecord } from "@/types/requirement";

const requirements = requirementData as RequirementRecord[];

export function getStaticRequirements(): RequirementRecord[] {
  return requirements;
}

export function getStaticRequirementById(id: number): RequirementRecord | null {
  return requirements.find((item) => item.id === id) ?? null;
}

export function getStaticRequirementParams() {
  return requirements.map((item) => ({ id: String(item.id) }));
}
