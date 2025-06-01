export const toCents  = (rub: number | string) => Math.round(parseFloat(rub.toString()) * 100);
export const fromCents = (cents: number) => (cents / 100).toFixed(2);
