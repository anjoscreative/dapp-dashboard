"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

type DataPoint = {
  date: string;
  value: number;
};

type Balance = {
  symbol: string;
  decimals: number;
  balance: string;
};

const tokenMap: Record<string, string> = {
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
};

export default function PortfolioChart({ balances }: { balances: Balance[] }) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    async function fetchPortfolioHistory() {
      if (balances.length === 0) return;

      // Convert Moralis balances into clean token list
      const tokens = balances
        .map((t) => {
          const id = tokenMap[t.symbol];
          if (!id) return null;
          const amount = Number(t.balance) / 10 ** t.decimals;
          return { symbol: t.symbol, id, amount };
        })
        .filter(Boolean) as { symbol: string; id: string; amount: number }[];

      // Fetch historical prices for each token
      async function getHistory(id: string) {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        const json = await res.json();
        return json.prices; // [[timestamp, price], ...]
      }

      const histories = await Promise.all(tokens.map((t) => getHistory(t.id)));

      // Build daily total portfolio values
      const days = histories[0].map((entry: [number, number], i: number) => {
        const date = new Date(entry[0]).toLocaleDateString("en-US", {
          weekday: "short",
        });

        let total = 0;
        tokens.forEach((t, idx) => {
          const price = histories[idx][i][1]; // token price at that day
          total += t.amount * price;
        });

        return { date, value: total };
      });

      setData(days);
    }

    fetchPortfolioHistory();
  }, [balances]);

  return (
    <div className="bg-[#111f24] border border-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2b30" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d1b1e",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
              strokeOpacity={0.9}
              activeDot={{
                r: 6,
                fill: "#f97316",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
