import React, { useEffect, useState } from "react";
import { FaChessRook } from "react-icons/fa";
import { CONTRACT_ADDRESS } from "../web3.config";
import { SiApachetomcat } from "react-icons/si";

const Intro = ({ totalNft, mintedNft, myNft }) => {
  const ranNum = Math.round(Math.random() * totalNft + 1);
  const imgSrc = `${process.env.REACT_APP_IMAGE_URL}/${ranNum}.png`;

  return (
    // from-transparent via-white 등으로 섞을 수 있음!
    <div className="bg-gradient-to-b from-main to-red-400 pt-10">
      <div className="max-w-screen-xl mx-auto px-4 relative">
        {/* 부모를 relative 처리 후, 자식을 absolute 처리하면 붕 뜨게된다. */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-red-300 truncate opacity-70">
          TEST NFT
        </div>
        <div className="relative w-40 h-40">
          <img
            className="absolute rounded-full w-40 h-40 z-10"
            src={imgSrc}
            alt="img"
          />
          <div className="absolute top-0 rounded-full w-40 h-40 bg-white text-gray-900 flex justify-center items-center">
            Loading...
          </div>
        </div>
        <div className="mt-4 text-2xl font-bold flex items-center">
          TEST NFT
          <div className="bg-gray-500 w-8 h-8 rounded-full flex justify-center items-center ml-4 text-gray-950">
            <SiApachetomcat size={50} />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center text-gray-900">
        by
        <div className="text-gray-700 ml-2">{CONTRACT_ADDRESS}</div>
      </div>
      <div className="text-2xl mt-2 text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
        <div className="flex text-center py-4">
          <div className="ml-4">
            <div>{totalNft}</div>
            <div> 총 NFT 발행량 </div>
          </div>
          <div className="ml-4">
            <div>{mintedNft}</div>
            <div> 발행된 NFT </div>
          </div>
          <div className="ml-4">
            <div>{myNft}</div>
            <div> 내 NFT </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
