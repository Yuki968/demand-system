export const REQUIREMENT_TYPE_VALUES = [
  "PRODUCT_PLANNING",
  "PRODUCT_ITERATION",
  "CUSTOMER_CUSTOMIZATION",
  "DATA_AND_OPERATION",
] as const;

export const REQUIREMENT_BELONG_VALUES = [
  "TWO_POINT_ZERO",
  "THREE_POINT_ZERO",
  "SMALL_POT",
] as const;

export const PRIORITY_VALUES = ["VERY_HIGH", "HIGH", "MEDIUM"] as const;

export const STAGE_SEQUENCE = [
  "DEMAND_CREATED",
  "PRODUCT_INTAKE",
  "IMPLEMENTATION_DELIVERY",
] as const;

export const STATUS_VALUES = [...STAGE_SEQUENCE, "CLOSED"] as const;

export const STATUS_EVALUATION_ORDER = [
  "CLOSED",
  "IMPLEMENTATION_DELIVERY",
  "PRODUCT_INTAKE",
  "DEMAND_CREATED",
] as const;

export const YES_NO_VALUES = ["YES", "NO"] as const;

export const FEEDBACK_STATUS_VALUES = [
  "FEEDBACK_RECEIVED",
  "FEEDBACK_PENDING",
] as const;

export const REQUIREMENT_TYPE_LABELS = {
  PRODUCT_PLANNING: "产品规划需求",
  PRODUCT_ITERATION: "产品迭代需求",
  CUSTOMER_CUSTOMIZATION: "客户定制需求",
  DATA_AND_OPERATION: "数据与运营需求",
} as const;

export const REQUIREMENT_BELONG_LABELS = {
  TWO_POINT_ZERO: "2.0",
  THREE_POINT_ZERO: "3.0",
  SMALL_POT: "小锅",
} as const;

export const PRIORITY_LABELS = {
  VERY_HIGH: "极高",
  HIGH: "高",
  MEDIUM: "中",
} as const;

export const STATUS_LABELS = {
  DEMAND_CREATED: "需求提出",
  PRODUCT_INTAKE: "产品承接",
  IMPLEMENTATION_DELIVERY: "交付验收",
  CLOSED: "已完成",
} as const;

export const YES_NO_LABELS = {
  YES: "是",
  NO: "否",
} as const;

export const FEEDBACK_STATUS_LABELS = {
  FEEDBACK_RECEIVED: "已反馈",
  FEEDBACK_PENDING: "未反馈",
} as const;

export const STAGE_ORDER_MAP = STAGE_SEQUENCE.reduce<Record<string, number>>(
  (accumulator, stageName, index) => {
    accumulator[stageName] = index + 1;
    return accumulator;
  },
  {},
);

export const STATUS_TONE_MAP = {
  DEMAND_CREATED: "status-created",
  PRODUCT_INTAKE: "status-intake",
  IMPLEMENTATION_DELIVERY: "status-delivery",
  CLOSED: "status-closed",
} as const;

export const PRIORITY_TONE_MAP = {
  VERY_HIGH: "priority-very-high",
  HIGH: "priority-high",
  MEDIUM: "priority-medium",
} as const;

export const REQUIREMENT_TYPE_TONE_MAP = {
  PRODUCT_PLANNING: "type-planning",
  PRODUCT_ITERATION: "type-iteration",
  CUSTOMER_CUSTOMIZATION: "type-customization",
  DATA_AND_OPERATION: "type-operation",
} as const;

export const REQUIREMENT_BELONG_TONE_MAP = {
  TWO_POINT_ZERO: "belong-two",
  THREE_POINT_ZERO: "belong-three",
  SMALL_POT: "belong-pot",
} as const;

export const FIXED_FIELD_OPTIONS = {
  requirementType: REQUIREMENT_TYPE_VALUES.map((value, index) => ({
    fieldName: "requirementType",
    optionValue: value,
    optionLabel: REQUIREMENT_TYPE_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
  requirementBelong: REQUIREMENT_BELONG_VALUES.map((value, index) => ({
    fieldName: "requirementBelong",
    optionValue: value,
    optionLabel: REQUIREMENT_BELONG_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
  priority: PRIORITY_VALUES.map((value, index) => ({
    fieldName: "priority",
    optionValue: value,
    optionLabel: PRIORITY_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
  currentStatus: STATUS_VALUES.map((value, index) => ({
    fieldName: "currentStatus",
    optionValue: value,
    optionLabel: STATUS_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
  yesNo: YES_NO_VALUES.map((value, index) => ({
    fieldName: "yesNo",
    optionValue: value,
    optionLabel: YES_NO_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
  feedbackStatus: FEEDBACK_STATUS_VALUES.map((value, index) => ({
    fieldName: "feedbackStatus",
    optionValue: value,
    optionLabel: FEEDBACK_STATUS_LABELS[value],
    optionGroup: "fixed",
    optionOrder: index + 1,
  })),
} as const;

export const FORM_OPTIONS = {
  requirementType: FIXED_FIELD_OPTIONS.requirementType.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
  requirementBelong: FIXED_FIELD_OPTIONS.requirementBelong.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
  priority: FIXED_FIELD_OPTIONS.priority.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
  currentStatus: FIXED_FIELD_OPTIONS.currentStatus.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
  yesNo: FIXED_FIELD_OPTIONS.yesNo.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
  feedbackStatus: FIXED_FIELD_OPTIONS.feedbackStatus.map(({ optionValue, optionLabel }) => ({
    value: optionValue,
    label: optionLabel,
  })),
} as const;

export const AFTER_SALES_OWNER = "产品运营";
