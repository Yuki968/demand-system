import {
  PRIORITY_LABELS,
  PRIORITY_TONE_MAP,
  REQUIREMENT_BELONG_LABELS,
  REQUIREMENT_BELONG_TONE_MAP,
  REQUIREMENT_TYPE_LABELS,
  REQUIREMENT_TYPE_TONE_MAP,
  STATUS_LABELS,
  STATUS_TONE_MAP,
} from "@/constants/requirement";
import { ToneBadge } from "@/components/ui/tone-badge";
import type {
  PriorityKey,
  RequirementBelongKey,
  RequirementStatusKey,
  RequirementTypeKey,
} from "@/types/requirement";

export function StatusBadge({
  status,
  className,
}: {
  status: RequirementStatusKey;
  className?: string;
}) {
  return (
    <ToneBadge className={className} tone={STATUS_TONE_MAP[status]}>
      {STATUS_LABELS[status]}
    </ToneBadge>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: PriorityKey;
  className?: string;
}) {
  return (
    <ToneBadge className={className} tone={PRIORITY_TONE_MAP[priority]}>
      {PRIORITY_LABELS[priority]}
    </ToneBadge>
  );
}

export function RequirementTypeBadge({
  requirementType,
  className,
}: {
  requirementType: RequirementTypeKey;
  className?: string;
}) {
  return (
    <ToneBadge className={className} tone={REQUIREMENT_TYPE_TONE_MAP[requirementType]}>
      {REQUIREMENT_TYPE_LABELS[requirementType]}
    </ToneBadge>
  );
}

export function RequirementBelongBadge({
  requirementBelong,
  className,
}: {
  requirementBelong: RequirementBelongKey;
  className?: string;
}) {
  return (
    <ToneBadge className={className} tone={REQUIREMENT_BELONG_TONE_MAP[requirementBelong]}>
      {REQUIREMENT_BELONG_LABELS[requirementBelong]}
    </ToneBadge>
  );
}
