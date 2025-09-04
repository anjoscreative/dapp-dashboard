"use client";

import Layout from "./components/Layout";
import StatCard from "./components/StatCard";
import PortfolioChart from "./components/PortfolioChart";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getWalletBalances } from "./lib/moralis";
import { getTokenPrices } from "./lib/coingecko";
import NFTCard from "./components/NFTCard";

type Balance = {
  token_address: string;
  symbol: string;
  balance: string;
  decimals: number;
  name: string;
};

type NFT = {
  name: string;
  token_id: string;
  metadata: string | null;
  image: any;
};

export default function Home() {
  const [wallet, setWallet] = useState(
    "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"
  );
  const [balances, setBalances] = useState<Balance[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    async function load() {
      if (!wallet) return;

      // ERC20 balances
      const data = await getWalletBalances(wallet);
      setBalances(data);

      // NFT holdings
      const nftData = await getWalletBalances(wallet);
      setNfts(nftData);

      // Token mapping for prices
      const tokenMap: Record<string, string> = {
        ETH: "ethereum",
        USDT: "tether",
        USDC: "usd-coin",
      };

      const ids = data.map((t: Balance) => tokenMap[t.symbol]).filter(Boolean);

      const prices = await getTokenPrices(ids);

      let total = 0;
      data.forEach((t: Balance) => {
        const id = tokenMap[t.symbol];
        if (id && prices[id]) {
          const amount = Number(t.balance) / 10 ** t.decimals;
          total += amount * prices[id].usd;
        }
      });

      setPortfolioValue(total);
    }
    load();
  }, [wallet]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6 sm:pt-14 pt-0">
        Welcome Back
      </h2>

      {/* Wallet input */}
      <div className="mb-6 flex flex-row sm:flex-col gap-2">
        
      <label className="text-orange-400">Enter an Ethereum wallet address (0x...)</label>
        <input
          type="text"
          placeholder="Enter an Ethereum wallet address (0x...)"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="flex-1 bg-[#111f24] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <h3 className="text-lg font-semibold mb-4">Overview</h3>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Wallet size={24} />}
          label="Token Holdings"
          value={balances.length > 0 ? balances.length : "--"}
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="First Token"
          value={
            balances.length > 0
              ? `${balances[0].symbol} ${(
                  Number(balances[0].balance) /
                  10 ** balances[0].decimals
                ).toFixed(2)}`
              : "--"
          }
        />
        <StatCard icon={<TrendingUp size={24} />} label="APY" value="+15.5%" />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Portfolio Value"
          value={portfolioValue > 0 ? `$${portfolioValue.toFixed(2)}` : "--"}
        />
      </div>

      {/* Live Portfolio Chart */}
      <PortfolioChart balances={balances} />

      {/* NFT Gallery */}
      <h3 className="text-lg font-semibold mt-10 mb-4">NFT Holdings</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {nfts.length > 0 ? (
          nfts.slice(0, 10).map((nft) => {
            let image = "";

            try {
              const metadata = nft.metadata ? JSON.parse(nft.metadata) : null;
              image = metadata?.image || "";

              // Fix IPFS links
              if (image.startsWith("ipfs://")) {
                image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
              }

              // Fix Arweave links
              if (image.startsWith("ar://")) {
                image = image.replace("ar://", "https://arweave.net/");
              }

              // Use animation_url if image missing
              if (!image && metadata?.animation_url) {
                image = metadata.animation_url;
              }
            } catch (e) {
              console.error("Invalid metadata", e);
            }

            // Final fallback: if image is still empty
            if (!image) {
              console.warn("NFT has no valid image:", nft.name, nft.token_id);
              image = "./fallback-nft.svg"; // make sure you add a placeholder image in /public
            }
            return (
              <NFTCard
                key={nft.token_id}
                name={nft.name}
                tokenId={nft.token_id}
                image={image}
              />
            );
          })
        ) : (
          <p className="text-gray-400">No NFTs found for this wallet.</p>
        )}
      </div>
    </Layout>
  );
}
