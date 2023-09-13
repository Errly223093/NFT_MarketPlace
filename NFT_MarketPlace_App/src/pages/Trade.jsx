import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Intro from "../components/Intro";
import { Link } from "react-router-dom";
import { GrInfo } from "react-icons/gr";
import { MdSell } from "react-icons/md";
import { RiNftLine } from "react-icons/ri";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  CONTRACT_ERC20,
  CONTRACT_ABI_ERC20,
} from "../web3.config";

const web3 = new Web3(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_APIKEY}`
);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const contract_ERC20 = new web3.eth.Contract(
  CONTRACT_ABI_ERC20,
  CONTRACT_ERC20
);

const Trade = ({ account }) => {
  const [tokenIds, setTokenIds] = useState([]);
  const [myNft, setMyNft] = useState(0);
  const [tokenPrice, setTokenPrice] = useState([]);
  const [mintedNft, setMintedNft] = useState(0);
  const [totalNft, setTotalNft] = useState(0);
  const [ownerOf, setOwnerOf] = useState([]);
  const [approved, setApproved] = useState();

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

  // 최대 민팅량
  const getTotalNft = async () => {
    try {
      if (!contract) return;
      const response = await contract.methods.maxsupplys().call();
      setTotalNft(response);
    } catch (error) {
      console.error(error);
    }
  };

  // NFT Id 불러오기
  const getTokens = () => {
    const numbers = [];
    for (let i = 1; i < mintedNft; i++) {
      numbers.push(i);
    }
    setTokenIds(numbers);
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
  const getTokenPrice = async (e) => {
    try {
      const response = await contract.methods.getNftprices_1(e).call();
      setTokenPrice(response);
    } catch (error) {
      console.error(error);
    }
  };

  // NFT 의 주인이 누구인지 주소 값 반환
  const getOwnerOf = async () => {
    try {
      for (var i = 1; i < tokenIds.length; i++) {
        const response = await contract.methods.ownerOf(i).call();
        setOwnerOf([...response]);
        console.log(ownerOf);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Apporove 설정 확인
  const checkApprove = async () => {
    try {
      const response = await contract_ERC20.methods
        .allowance(account, CONTRACT_ADDRESS)
        .call();
      setApproved(response);
    } catch (error) {
      console.error(error);
    }
    console.log(approved);
  };

  // NFT 구매 Apporove
  const getApprove = async () => {
    if (account && approved == 0) {
      const maxApporve = web3.utils.toBN(500 * 10 ** 18);
      const approve = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: CONTRACT_ERC20,
            data: contract_ERC20.methods
              .approve(CONTRACT_ADDRESS, maxApporve)
              .encodeABI(),
          },
        ],
      });
      alert("Success to Appove.");
    }
  };

  // 판매 등록된 NFT 구매
  const onClickBuy = async (e) => {
    const id = web3.utils.toNumber(e);
    console.log(id);
    const abc = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: CONTRACT_ADDRESS,
          data: contract.methods.buyNft(id).encodeABI(),
        },
      ],
    });
    alert("Success to Buy Nft.");
  };

  useEffect(() => {
    checkApprove();
    getTotalNft();
    getMintedNft();
    getMyNft();
  }, []);

  useEffect(() => {
    getTokens();
  }, [mintedNft]);

  useEffect(() => {
    getTokenPrice(tokenIds);
    getOwnerOf();
  }, [tokenIds, account]);

  useEffect(() => {
    if (approved == 0) getApprove();
  }, [approved]);

  return (
    <div>
      <div>
        <Intro totalNft={totalNft} myNft={myNft} mintedNft={mintedNft} />
      </div>
      <div className="flex ml-24 mt-10 text-2xl font-bold border-b-4 text-gray-400 gap-2">
        <RiNftLine size={30} />
        Listed NFTs
      </div>
      <div className="flex flex-wrap gap-16 ml-24 mt-10 ">
        {tokenIds.map((v, i) => {
          if (tokenPrice[v] > 0) {
            return (
              <div className="relative rounded-2xl bg-gray-800 pb-4" key={i}>
                <div>
                  <div className="text-2xl font-bold text-gray-400">
                    <div>
                      <img
                        className="rounded-t-2xl"
                        src={`https://gateway.pinata.cloud/ipfs/QmRnUNeYc9RvA5AEiSkXmN6M7p3SPRBhwJ2ej7Gijd4YNb/${v}.png`}
                        alt="NFT"
                      />
                      <div className="flex mt-4 text-xl justify-between px-4">
                        <div>
                          <div className="pl-6">
                            <div className="text-xl font-bold text-gray-400">
                              Price : {tokenPrice[v] / 10 ** 18} USDT
                            </div>
                            <div className="text-l">Token Id : {v}</div>

                            <div className="font-bold text-gray-400 text-sm">
                              Owner : {ownerOf}
                            </div>
                          </div>
                          <div className="flex justify-between pt-2 pl-8">
                            <button
                              className="bg-gray-300 text-gray-600 px-3 py-2 mt-1 rounded-xl  hover:bg-white flex justify-center items-center gap-1"
                              type="button"
                              onClick={() => onClickBuy(v)}
                            >
                              <MdSell size={18} />
                              Buy
                            </button>
                            <Link to={`/${v}`}>
                              <button className="bg-gray-300 text-gray-600 px-3 py-2 rounded-xl hover:bg-white flex justify-center items-center gap-1">
                                <GrInfo size={18} />
                                Detail
                              </button>
                            </Link>
                          </div>
                        </div>
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
  );
};

export default Trade;
