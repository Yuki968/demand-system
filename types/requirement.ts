import type {
  FEEDBACK_STATUS_VALUES,
  PRIORITY_VALUES,
  REQUIREMENT_BELONG_VALUES,
  REQUIREMENT_TYPE_VALUES,
  STAGE_SEQUENCE,
  STATUS_VALUES,
  YES_NO_VALUES,
} from "@/constants/requirement";

export type RequirementTypeKey = (typeof REQUIREMENT_TYPE_VALUES)[number];
export type RequirementBelongKey = (typeof REQUIREMENT_BELONG_VALUES)[number];
export type PriorityKey = (typeof PRIORITY_VALUES)[number];
export type StageNameKey = (typeof STAGE_SEQUENCE)[number];
export type RequirementStatusKey = (typeof STATUS_VALUES)[number];
export type YesNoKey = (typeof YES_NO_VALUES)[number];
export type FeedbackStatusKey = (typeof FEEDBACK_STATUS_VALUES)[number];

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface RequirementStageRecord {
  id: number;
  requirementId: number;
  stageName: StageNameKey;
  stageOrder: number;
  stageReached: boolean;
  ownerName: string | null;
  startTime: string | null;
  endTime: string | null;
  relatedCustomer: string | null;
  outputProductRequirement: YesNoKey | null;
  outputSolution: YesNoKey | null;
  planCompleted: YesNoKey | null;
  deliveryCompleted: YesNoKey | null;
  feedbackStatus: FeedbackStatusKey | null;
  feedbackContent: string | null;
  includeNextProduct: YesNoKey | null;
  targetProduct: string | null;
  durationValue: number | null;
  durationIsManual: boolean;
  updatedAt: string;
}

export interface RequirementRecord {
  id: number;
  requirementNo: number;
  createdAt: string;
  requirementName: string;
  requirementType: RequirementTypeKey;
  requirementBelong: RequirementBelongKey;
  priority: PriorityKey;
  currentStatus: RequirementStatusKey;
  currentOwner: string | null;
  relatedProject: string | null;
  createdBy: string;
  relatedCustomer: string | null;
  isFinished: boolean;
  totalDurationValue: number | null;
  totalDurationIsManual: boolean;
  updatedAt: string;
  stages: RequirementStageRecord[];
}

export interface RequirementQueryParams {
  status?: RequirementStatusKey | "";
  owner?: string;
  type?: RequirementTypeKey | "";
  keyword?: string;
}

export interface CreateRequirementInput {
  requirementName: string;
  requirementType: RequirementTypeKey;
  requirementBelong: RequirementBelongKey;
  priority: PriorityKey;
  createdAt: string;
  createdBy: string;
  relatedCustomer?: string | null;
  relatedProject?: string | null;
}

export interface UpdateRequirementInput {
  requirement?: Partial<CreateRequirementInput> & {
    totalDurationValue?: number | null;
    totalDurationIsManual?: boolean;
  };
  stages?: Array<{
    id?: number;
    stageName: StageNameKey;
    ownerName?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    relatedCustomer?: string | null;
    outputProductRequirement?: YesNoKey | null;
    outputSolution?: YesNoKey | null;
    planCompleted?: YesNoKey | null;
    deliveryCompleted?: YesNoKey | null;
    feedbackStatus?: FeedbackStatusKey | null;
    feedbackContent?: string | null;
    includeNextProduct?: YesNoKey | null;
    targetProduct?: string | null;
  }>;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: string[];
  };
}
