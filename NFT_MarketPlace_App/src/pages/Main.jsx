import Intro from "../components/Intro";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../web3.config";
import { useState, useEffect } from "react";
import Nfts from "../components/Nfts";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const Main = ({ account }) => {
  const [totalNft, setTotalNft] = useState(0);
  const [mintedNft, setMintedNft] = useState(0);
  const [myNft, setMyNft] = useState(0);
  const [page, setPage] = useState(0);

  // 총 nft 발행량
  const getTotalNft = async () => {
    try {
      if (!contract) return;

      const response = await contract.methods.maxsupplys().call();
      setPage(parseInt((parseInt(response) - 1) / 10) + 1);

      // 페이지 구하는 공식 ( -1 => /10 => +1 )
      // 10 - 1 = 9 / 10 = 0 + 1 = 1page
      // 31 - 1 = 30 / 10 = 3 + 1 = 4page
      // 975 - 1 = 974 / 10 = 97 + 1 = 98page

      setTotalNft(response);
    } catch (error) {
      console.error(error);
    }
  };

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

  // 내 nft
  const getMyNft = async () => {
    try {
      if (!contract || !account) return;

      const response = await contract.methods.balanceOf(account).call();

      setMyNft(response);
    } catch (error) {
      console.error(error);
    }
  };

  // account 값이 있다면 실행
  useEffect(() => {
    getTotalNft();
    getMintedNft();
    getMyNft();
    console.log(myNft);
  }, [account]);

  return (
    <div>
      <Intro totalNft={totalNft} mintedNft={mintedNft} myNft={myNft} />
      <Nfts page={page} mintedNft={mintedNft} />
    </div>
  );
};

export default Main;
