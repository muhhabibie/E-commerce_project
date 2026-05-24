export function formatPrice(number: number | string) {
  if (typeof number !== "number") {
    number = parseFloat(number);
  }

  return number.toLocaleString("id-ID");
}
