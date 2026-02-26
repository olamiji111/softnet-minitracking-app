// utils/groupTransactions.ts



export const generateTransactionNumber = (id: string | number) => {
    const seed = String(id) + Date.now().toString();

    const digits: number[] = [];

    for (let i = 0; digits.length < 22; i++) {

        const rand =
            (Number(seed[i % seed.length]) + Math.floor(Math.random() * 10)) % 10;

        const prev1 = digits[digits.length - 1];
        const prev2 = digits[digits.length - 2];


        if (prev1 === rand && prev2 === rand) continue;

        digits.push(rand);
    }

    return digits.join("");
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