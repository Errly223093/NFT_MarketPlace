import React, { useEffect, useState } from "react";
import { GrInfo } from "react-icons/gr";
import { MdSell, MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiNftLine } from "react-icons/ri";
import Intro from "../components/Intro";
import axios from "axios";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../web3.config";

const web3 = new Web3(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_APIKEY}`
);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const MyNft = ({ account }) => {
  const [tokenIds, setTokenIds] = useState([]);
  const [price, setPrice] = useState(0);
  const [myNft, setMyNft] = useState(0);
  const [tokenPrice, setTokenPrice] = useState([]);
  const [mintedNft, setMintedNft] = useState(0);
  const [totalNft, setTotalNft] = useState(0);

  // 민팅량
  const getMintedNft = async () => {
    try {
      if (!contract) return;
      const response = await contract.methods.supplys().call();
      setMintedNft(response);
    } catch (error) {
      console.error(error);
    }
  };

  // 총 민팅량
  const getTotalNft = async () => {
    try {
      if (!contract) return;
      const response = await contract.methods.maxsupplys().call();
      setTotalNft(response);
    } catch (error) {
      console.error(error);
    }
  };

  // NFT id 불러오기
  const getTokens = async () => {
    try {
      const response = await contract.methods.getNftId(account).call();
      setTokenIds(response);
    } catch (error) {
      console.error(error);
    }
  };

  // 가격 입력
  const onChangePrice = (e) => {
    setPrice(parseInt(e.target.value));
  };

  // 컨트랙트를 통한 NFT 판매등록 (web3.js 로 만든 hooks)
  const onClickSaleRegist1 = async (e, id) => {
    try {
      e.preventDefault();
      // JavaScript의 숫자를 uint256로 변환
      const uint256Price = Web3.utils.toBN(price);
      const response = await contract.methods
        .saleRegist(id, uint256Price)
        .send({ from: account });
      console.log(id, uint256Price.toString());
    } catch (error) {
      console.error(error);
    }
  };

  // 컨트랙트를 통한 NFT 판매등록
  const onClickSaleRegist = async (e, id) => {
    if (window.ethereum) {
      try {
        e.preventDefault();
        const value = web3.utils.toBN(price * 10 ** 18);
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: CONTRACT_ADDRESS,
              data: contract.methods.saleRegist(id, value).encodeABI(),
            },
          ],
        });
        alert("Offer Transaction Submitted.");
      } catch (error) {
        console.error(error);
      }
    } else {
      return alert("Install Metamask.");
    }
  };

  // 본인 소유의 NFT Id 가져오기
  const getMyNft = async () => {
    try {
      if (!contract || !account) return;
      const response = await contract.methods.balanceOf(account).call();
      setMyNft(response);
    } catch (error) {
      console.error(error);
    }
  };

  // 현재 NFT 의 가격 정보를 가져옴(0 = 판매등록X / 1 이상 = 판매등록O)
  const getTokenPrice = async () => {
    try {
      var array = Array(tokenIds.length);
      for (var i = 1; i <= tokenIds.length; i++) {
        const response = await contract.methods.getNftprices_1(i).call();
        array[i - 1] = response;
      }
      await setTokenPrice([...array]);
    } catch (error) {
      console.error(error);
    }
  };

  // 판매 취소
  const onClickCancel = async (e) => {
    if (window.ethereum) {
      try {
        const id = web3.utils.toNumber(e);
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: CONTRACT_ADDRESS,
              data: contract.methods.cancelSaleRegist(id).encodeABI(),
            },
          ],
        });
        alert("Cancel Transaction Submitted.");
      } catch (error) {
        console.error(error);
      }
    } else {
      return alert("Install Metamask.");
    }
  };

  useEffect(() => {
    getMyNft();
  }, [account, tokenIds]);

  useEffect(() => {
    getTokens();
  }, [account]);

  useEffect(() => {
    console.log(tokenPrice);
  }, [tokenPrice]);

  useEffect(() => {
    getTokenPrice();
  }, [tokenIds]);

  return (
    <>
      <div>
        <Intro totalNft={totalNft} myNft={myNft} mintedNft={mintedNft} />
      </div>
      <div className="bg-black from-purple-600 to-red-400 pt-10">
        <div className="flex ml-24 font-bold text-2xl gap-2 text-gray-400">
          <RiNftLine size={30} />
          My NFT ({myNft})
        </div>
        <div className="flex ml-24 mt-4 text-xl gap-2 text-gray-400 border-b-4">
          List Your NFT For Sale.
        </div>
        <div className="flex  flex-wrap gap-16 ml-24 mt-10 ">
          {tokenIds.map((v, i) => {
            if (tokenPrice[v] > 0) {
              return (
                <div>
                  <div>
                    <div className="relative rounded-2xl bg-gray-800 pb-4 text-xl font-bold text-gray-400 ">
                      <div>
                        <img
                          className="rounded-t-2xl"
                          src={`https://gateway.pinata.cloud/ipfs/QmRnUNeYc9RvA5AEiSkXmN6M7p3SPRBhwJ2ej7Gijd4YNb/${v}.png`}
                          alt="NFT"
                        />
                        <div className="ml-6 mt-2">
                          <div>Token Id : {v}</div>
                          <div className="text-xl font-bold text-white pb-4">
                            Offered Price : {tokenPrice[v] / 10 ** 18} USDT
                          </div>
                        </div>
                        <div className="flex mt-2 text-xl justify-between px-4">
                          <div>
                            <form onSubmit={(e) => onClickSaleRegist(e, v)}>
                              <input
                                className="text-black border border-gray-400 px-3 py-2 rounded-xl mr-2"
                                type="text"
                                name="price"
                                onChange={onChangePrice}
                                placeholder="Set a price in 'USDT'"
                              />
                              <button
                                className="bg-gray-300 text-gray-600 px-3 py-2 mt-1 rounded-xl  hover:bg-white flex justify-center items-center gap-1"
                                type="submit"
                              >
                                <MdSell size={18} />
                                Update Offer Price
                              </button>
                            </form>
                            <button
                              type="button" // 이 부분은 필요에 따라 변경 가능
                              onClick={() => onClickCancel(i + 1)}
                              className="bg-gray-300 text-gray-600 px-3 py-2 rounded-xl mt-1 hover:bg-white flex justify-center items-center gap-1"
                            >
                              <MdOutlineCancel size={22} />
                              Offer Cancel
                            </button>
                          </div>
                          <div></div>
                          <Link to={`/${v}`}>
                            <button className="bg-gray-300 text-gray-600 px-3 py-2 rounded-xl mt-12 hover:bg-white flex justify-center items-center gap-1">
                              <GrInfo size={18} />
                              Detail
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  <div>
                    <div className="relative rounded-2xl bg-gray-800 pb-4 text-xl font-bold text-gray-400 ">
                      <div>
                        <img
                          className="rounded-t-2xl"
                          src={`https://gateway.pinata.cloud/ipfs/QmRnUNeYc9RvA5AEiSkXmN6M7p3SPRBhwJ2ej7Gijd4YNb/${v}.png`}
                          alt="NFT"
                        />
                        <div className="ml-6 mt-2">
                          <div className="text">Token Id : {v}</div>
                          <div className="text font-bold text-white pb-16">
                            Not Listed
                          </div>
                        </div>
                        <div className="flex mt-2 text-xl justify-between px-4">
                          <form onSubmit={(e) => onClickSaleRegist(e, v)}>
                            <input
                              className="text-black border border-gray-400 px-3 py-2 rounded-xl mr-2"
                              type="text"
                              name="price"
                              onChange={onChangePrice}
                              placeholder="Set a price in 'USDT'"
                            />
                            <button
                              className="bg-gray-300 text-gray-600 px-3 py-2 mt-1 rounded-xl  hover:bg-white flex justify-center items-center gap-1"
                              type="submit"
                            >
                              <MdSell size={18} />
                              Offering NFT
                            </button>
                          </form>
                          <div></div>
                          <Link to={`/${v}`}>
                            <button className="bg-gray-300 text-gray-600 px-3 py-2 rounded-xl mt-12 hover:bg-white flex justify-center items-center gap-1">
                              <GrInfo size={18} />
                              Detail
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default MyNft;
