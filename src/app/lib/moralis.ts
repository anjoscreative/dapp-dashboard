export async function getWalletBalances(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
  const res = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`,
    //`https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=eth&format=decimal`,
    {
      headers: {
        "X-API-Key": apiKey || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch balances");
  }

  const data = await res.json();
  return data;
}
