import { FaChessRook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GrInfo } from "react-icons/gr";
import { SiApachetomcat } from "react-icons/si";

const NftCard = ({ tokenId, metadata, mintedNft }) => {
  return (
    <div className="relative rounded-2xl bg-gray-800 pb-4">
      {parseInt(mintedNft) < tokenId && (
        <div className="absolute h-full w-full bg-black bg-opacity-50 flex justify-center items-center text-2xl">
          Not Minted..
        </div>
      )}
      <img className="rounded-t-2xl" src={metadata.image} alt={metadata.name} />
      <div className="absolute translate-y-3 translate-x-3 bg-main w-8 h-8 rounded-2xl flex justify-center items-center">
        <SiApachetomcat size={40} />
      </div>
      <div className="mt-4 ml-10 text-xl font-bold flex items-center px-4 text-gray-300">
        Test NFT {tokenId}
      </div>
      <div className="flex mt-4 text-xl justify-end px-4">
        {/* 클릭했을 때, tokenId 에 따라 이동 */}
        <Link to={`${tokenId}`}>
          <button
            disabled={parseInt(mintedNft) < tokenId}
            className="bg-gray-300 text-gray-600 px-3 py-2  rounded-xl hover:bg-white flex justify-center items-center gap-1"
          >
            <GrInfo size={18} />
            Detail
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NftCard;
