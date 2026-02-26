
export const CATEGORY_VALUES = [
  "Groceries",
  "Transportation",
  "Dining",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Utilities",
] as const;

export const STATUS_VALUES = [
  "completed",
  "pending",
  "failed",
  "to be paid",
  "reversed",
] as const;


export type Transaction = {
  id: string;
  amount: number;
  merchant: string;
  category: (typeof CATEGORY_VALUES)[number];
  date: string;
  status: (typeof STATUS_VALUES)[number];
};