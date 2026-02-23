// utils/groupTransactions.ts
import { Transaction } from "@/types/type";



export const generateTransactionNumber = (id: string | number) => {
    const seed = String(id) + Date.now().toString();

    const digits: number[] = [];

    for (let i = 0; digits.length < 22; i++) {
        // pseudo-random from seed + index
        const rand =
            (Number(seed[i % seed.length]) + Math.floor(Math.random() * 10)) % 10;

        const prev1 = digits[digits.length - 1];
        const prev2 = digits[digits.length - 2];

        // prevent triple repetition
        if (prev1 === rand && prev2 === rand) continue;

        digits.push(rand);
    }

    return digits.join("");
};

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