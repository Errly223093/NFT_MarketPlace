import React, { useEffect, useState } from "react";
import { FaUikit } from "react-icons/fa";
import { MdAllInbox } from "react-icons/md";
import { Link } from "react-router-dom";
import { BiWallet, BiHomeAlt2 } from "react-icons/bi";
import { TbCoinBitcoin } from "react-icons/tb";
import { MdAccountBox, MdOutlineSell } from "react-icons/md";
import axios from "axios";

const Header = ({ account, setAccount }) => {
  const [coinPrice, setCoinPrice] = useState();

  const getCoinPrice = async () => {
    try {
      const response = await axios.get(
        "https://api.upbit.com/v1/ticker?markets=KRW-BTC,%20KRW-ETH,%20KRW-MATIC"
      );

      setCoinPrice([
        { symbol: "BTC", price: response.data[0].trade_price },
        { symbol: "ETH", price: response.data[1].trade_price },
        { symbol: "MATIC", price: response.data[2].trade_price },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickAccount = async () => {
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(account[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onClickAccount();
    getCoinPrice();
  }, []);

  return (
    //max-w-screen-xl 빼놓음
    <header className="min-w-screen mx-auto bg-main p-4 flex justify-between items-center font-bold">
      <Link to="/">
        <div className="flex items-center">
          <FaUikit size={32} />
          <div className="ml-2">TEST NFT</div>
        </div>
      </Link>

      <div className="flex justify-between gap-10">
        <Link to="/Trade">
          <div className="flex items-center">
            <MdOutlineSell size={20} />
            <div className="ml-2">Trade</div>
          </div>
        </Link>
        <Link to="/myNft">
          <div className="flex items-center">
            <BiHomeAlt2 size={20} />
            <div className="ml-2">My NFT</div>
          </div>
        </Link>
        {coinPrice && (
          <ul className="flex text-gray-100 text-sm mr-4">
            <TbCoinBitcoin size={20} />
            {coinPrice.map((v, i) => {
              return (
                <li key={i} className="ml-2">
                  {v.symbol}: {v.price.toLocaleString()} KRW
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {account ? (
        <div className="flex justify-center items-center">
          <Link to="/myNft">
            <button>
              <BiWallet size={32} className="mr-2" />
            </button>
          </Link>
          {account.substr(0, 4)}....
          {account.substr(account.length - 4, account.length)}
        </div>
      ) : (
        <button
          className="flex items-center justify-center p-2 bg-gray-800 rounded-xl border-black px-3"
          onClick={onClickAccount}
        >
          <div className=" w-7 h-7 rounded-full ml-1 mr-1">
            <BiWallet size={28} />
          </div>
          <div>Connect</div>
        </button>
      )}
    </header>
  );
};

export default Header;
