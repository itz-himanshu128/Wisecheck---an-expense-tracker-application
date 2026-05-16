"use client";
import { create } from "zustand";

export interface PendingExpense {
  _localId: string;
  title: string;
  amount: number;
  type: "debit" | "credit";
  note: string;
  date: string;
  categoryIds: string[];
}

interface ExpenseStore {
  pending: PendingExpense[];
  addPending: (e: PendingExpense) => void;
  removePending: (localId: string) => void;
  clearPending: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  pending: [],
  addPending: (e) => set((s) => ({ pending: [...s.pending, e] })),
  removePending: (localId) =>
    set((s) => ({ pending: s.pending.filter((p) => p._localId !== localId) })),
  clearPending: () => set({ pending: [] }),
}));
