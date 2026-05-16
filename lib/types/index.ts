// Shared TypeScript interfaces for WiseCheck

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  current_balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: "debit" | "credit";
  note: string | null;
  date: string;
  created_at: string;
  categories?: Category[];
}

export interface Borrowed {
  id: string;
  user_id: string;
  from_person: string;
  amount: number;
  reason: string | null;
  borrowed_on: string;
  return_by: string | null;
  is_returned: boolean;
  created_at: string;
}

export interface Lended {
  id: string;
  user_id: string;
  to_person: string;
  amount: number;
  reason: string | null;
  lended_on: string;
  expected_by: string | null;
  is_received: boolean;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  title: string;
  limit_amt: number;
  period: "monthly" | "yearly" | "custom";
  category_id: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  type: "table" | "note" | "checklist";
  content: PlanContent;
  created_at: string;
  updated_at: string;
}

export interface PlanTableRow {
  id: string;
  label: string;
  amount: string;
}

export interface PlanCheckItem {
  id: string;
  text: string;
  checked: boolean;
}

export type PlanContent =
  | { rows: PlanTableRow[] }        // table
  | { text: string }                // note
  | { items: PlanCheckItem[] };     // checklist

export interface AccentColor {
  name: string;
  hex: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Violet",  hex: "#6C63FF" },
  { name: "Cyan",    hex: "#00D4FF" },
  { name: "Coral",   hex: "#FF6B6B" },
  { name: "Emerald", hex: "#4ADE80" },
  { name: "Amber",   hex: "#F59E0B" },
];
