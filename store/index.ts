// stores/useTransactionStore.ts
import { transactions as initialData } from "@/lib/data";
import { CATEGORY_VALUES, STATUS_VALUES, Transaction } from "@/types/type";
import { create } from "zustand";

const STATUSES = ["Completed", "Pending", "Failed", "Reversed", "To be Paid"] as const;

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

    addTransaction: (tx: {
        merchant: string;
        amount: number;
        category: (typeof CATEGORY_VALUES)[number];
    }) => boolean;
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

        const next = filtered.slice(loadedCount, loadedCount + batchSize);

        set({ loadedCount: loadedCount + next.length });

        return next;
    },

    hasMore: () => {
        const { loadedCount } = get();
        const filtered = get().getFiltered();

        return loadedCount < filtered.length;
    },

    addTransaction: ({
        merchant,
        amount,
        category,
    }: {
        merchant: string;
        amount: number;
        category: (typeof CATEGORY_VALUES)[number];
    }) => {
        try {
            const { allTransactions } = get();


            const lastId = allTransactions.length
                ? Math.max(...allTransactions.map(t => Number(t.id)))
                : 0;

            const nextId = String(lastId + 1);


            const status =
                STATUSES[Math.floor(Math.random() * STATUSES.length)] as
                (typeof STATUS_VALUES)[number];

            const newTx: Transaction = {
                id: nextId,
                merchant,
                amount,
                category,
                status,
                date: new Date().toISOString().split("T")[0],
            };

            set({
                allTransactions: [newTx, ...allTransactions],
            });

            return true;
        } catch (e) {
            console.log("Add transaction failed", e);
            return false;
        }
    }

}));