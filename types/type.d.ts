export type Transaction = {
    id: string;
    amount: number;
    merchant: string;
    category:
    | "Groceries"
    | "Transportation"
    | "Dining"
    | "Entertainment"
    | "Healthcare"
    | "Shopping"
    | "Utilities";
    date: string; // YYYY-MM-DD
    status: "completed" | "pending" | "failed" | "to be paid" | "reversed";
};