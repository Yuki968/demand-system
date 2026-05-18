import { isNonEmptyString } from "@/lib/utils";
import type { RequirementQueryParams, RequirementRecord } from "@/types/requirement";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getAllOwnerNames(item: RequirementRecord) {
  return item.stages.map((stage) => stage.ownerName).filter(isNonEmptyString);
}

export function getOwnerOptions(items: RequirementRecord[]) {
  return Array.from(new Set(items.map((item) => item.currentOwner).filter(isNonEmptyString))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function matchesRequirementKeyword(item: RequirementRecord, keyword: string) {
  const normalizedKeyword = normalize(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const searchableFields = [
    item.requirementName,
    item.relatedProject,
    item.relatedCustomer,
    item.createdBy,
    item.currentOwner,
    ...getAllOwnerNames(item),
  ].filter(isNonEmptyString);

  return searchableFields.some((field) => normalize(field).includes(normalizedKeyword));
}

export function filterRequirementList(items: RequirementRecord[], filters: RequirementQueryParams = {}) {
  return [...items]
    .filter((item) => !filters.status || item.currentStatus === filters.status)
    .filter((item) => !filters.owner || item.currentOwner === filters.owner)
    .filter((item) => !filters.type || item.requirementType === filters.type)
    .filter((item) => !filters.keyword || matchesRequirementKeyword(item, filters.keyword))
    .sort((left, right) => right.requirementNo - left.requirementNo || right.id - left.id);
}