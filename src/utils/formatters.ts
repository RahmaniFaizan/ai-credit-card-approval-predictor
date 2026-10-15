/**
 * AI Credit Card Approval Predictor – Indian Rupee Formatter Utility
 * Formats numbers into Indian Numbering System (e.g., ₹1,25,000 instead of ₹125,000)
 */

export function formatRupee(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  // Use Intl.NumberFormat with 'en-IN' locale for standard Indian digit grouping
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absVal);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function parseRupeeInput(val: string): number {
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
