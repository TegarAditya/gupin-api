export function romanToInt(roman: string): number {
    const romanMap: Record<string, number> = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    }
    let total = 0,
        prev = 0

    for (let i = roman.length - 1; i >= 0; i--) {
        const current = romanMap[roman[i]]
        if (current < prev) {
            total -= current
        } else {
            total += current
        }
        prev = current
    }
    return total
}
