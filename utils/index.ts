// utils/groupTransactions.ts
import { Transaction } from "@/types/type";

interface GroupedItem {
    title: string;
    data: Transaction[];
}

type AccType = {
    [year: number]: {
        [month: string]: {
            [day: number]: Transaction[];
        };
    };
};

/**
 * Group transactions by Year → Month → Day
 * Returns array of { title: "Day Month", data: Transaction[] }
 */
export const groupTransactionsByDate = (transactions: Transaction[]): GroupedItem[] => {
    const grouped = Object.values(
        transactions.reduce<AccType>((acc, tx) => {
            const d = new Date(tx.date);
            const year = d.getFullYear();
            const month = d.toLocaleString("default", { month: "long" });
            const day = d.getDate();

            if (!acc[year]) acc[year] = {};
            if (!acc[year][month]) acc[year][month] = {};
            if (!acc[year][month][day]) acc[year][month][day] = [];

            acc[year][month][day].push(tx);
            return acc;
        }, {})
    ).flatMap(yearObj =>
        Object.entries(yearObj).flatMap(([month, days]) =>
            Object.entries(days).map(([day, items]) => ({
                title: `${day} ${month}`,
                data: items,
            }))
        )
    );

    return grouped;
};

export const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" }); // "Feb"
    const year = d.getFullYear();

    // Add "st", "nd", "rd", "th"
    const getOrdinal = (n: number) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${month} ${day}${getOrdinal(day)}, ${year}`;
};