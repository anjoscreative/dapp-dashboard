export async function getTokenPrices(ids: string[]) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
      ","
    )}&vs_currencies=usd`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch token prices");
  }

  return res.json();
}
