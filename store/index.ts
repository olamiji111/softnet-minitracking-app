// stores/useTransactionStore.ts
import { transactions as initialData } from "@/lib/data";
import { create } from "zustand";

type Transaction = typeof initialData[0];

interface TransactionState {
    allTransactions: Transaction[];
    loadedCount: number;
    batchSize: number;

    activeCategory: string;
    activeStatus: string;

    setCategory: (c: string) => void;
    setStatus: (s: string) => void;

    getFiltered: () => Transaction[];
    getNextBatch: () => Transaction[];
    hasMore: () => boolean;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    allTransactions: initialData
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    loadedCount: 10,
    batchSize: 10,

    activeCategory: "All Categories",
    activeStatus: "All Status",

    setCategory: (c) => set({ activeCategory: c, loadedCount: 10 }),
    setStatus: (s) => set({ activeStatus: s, loadedCount: 10 }),

    getFiltered: () => {
        const { allTransactions, activeCategory, activeStatus } = get();

        return allTransactions.filter(tx => {
            const catOk =
                activeCategory === "All Categories" ||
                tx.category.toLowerCase() === activeCategory.toLowerCase();

            const statusOk =
                activeStatus === "All Status" ||
                tx.status.toLowerCase() === activeStatus.toLowerCase();

            return catOk && statusOk;
        });
    },

    getNextBatch: () => {
        const { loadedCount, batchSize } = get();
        const filtered = get().getFiltered();

        const next = filtered.slice(
            loadedCount,
            loadedCount + batchSize
        );

        set({ loadedCount: loadedCount + next.length });

        return next;
    },

    hasMore: () => {
        const { loadedCount } = get();
        const filtered = get().getFiltered();

        return loadedCount < filtered.length;
    },
}));