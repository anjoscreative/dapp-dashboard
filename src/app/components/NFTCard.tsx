type NFTCardProps = {
  name: string;
  image: string;
  tokenId: string;
};

export default function NFTCard({ name, image, tokenId }: NFTCardProps) {
  const isPlaceholder = image.includes("fallback-nft");

  return (
    <div
      className={`bg-[#111f24] border border-gray-800 rounded-xl overflow-hidden hover:border-orange-400/60 transition ${
        isPlaceholder ? "animate-glitch" : ""
      }`}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover border-b border-gray-700"
      />
      <div className="p-3">
        <p className="text-sm font-semibold truncate">{name || "Unnamed NFT"}</p>
        <p className="text-xs text-gray-400">ID: {tokenId}</p>
      </div>
    </div>
  );
}
