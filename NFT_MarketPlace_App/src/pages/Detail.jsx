import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { FaChessRook } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../web3.config";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// 디테일 페이지는 동적 라우팅을 씀
// 토큰id 값이 params 값으로 사용되므로 params 함수 사용.

const Detail = () => {
  const [metadata, setMetadata] = useState();
  const { tokenId } = useParams();
  const [nftOwner, setNftOwner] = useState();

  const getNft = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON_URL}/${tokenId}.json`
      );
      setMetadata(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // NFT 소유자 확인
  const isNftOwner = async () => {
    try {
      const response = await contract.methods.ownerOf(tokenId).call();
      console.log(tokenId);
      setNftOwner(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNft();
    isNftOwner();
  }, []);

  useEffect(() => console.log(metadata), [metadata]);

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-center items-center py-16 bg-gray-900">
        {metadata ? (
          <>
            <div className="max-w-[512px]">
              <img className="rounded-t-2xl" src={metadata.image} alt="NFT" />
              <ul className="grid grid-cols-3 gap-8 py-8 bg-gray-600 rounded-b-2xl text-center">
                {metadata.attributes.map((v, i) => {
                  return (
                    <li key={i} className="mx-4">
                      <div>{v.trait_type}</div>
                      <div className="mt-1 border-t-2 font-bold">{v.value}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="m-8">
              <div className="text-4xl flex items-center">
                <div>{metadata.name}</div>
                <div className="bg-main w-8 h-8 rounded-full flex justify-center items-center ml-2 text-gray-950">
                  <FaChessRook size={18} />
                </div>
              </div>
              <div className="mt-8 text-2xl">{metadata.description}</div>
              <div className="mt-8 text-l">Owner : {nftOwner}</div>
            </div>
          </>
        ) : (
          <div>로딩중입니다...</div>
        )}
      </div>
      <div className="flex justify-center items-end">
        <Link to="/">
          <button className="flex">
            <AiOutlineHome size={30} className="mr-1 mb-2" />
            <div className="mt-1">Back to Main</div>
          </button>
        </Link>
      </div>
    </>
  );
};

export default Detail;
