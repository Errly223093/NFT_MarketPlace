import axios from "axios";
import { useEffect, useState } from "react";
import NftCard from "./NftCard";

const Nfts = ({ page, mintedNft }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [nfts, setNfts] = useState();

  const onClickPage = (p) => () => {
    setSelectedPage(p);
    getNfts(p);
  };

  const getNfts = async (p) => {
    try {
      let nftArray = [];

      setNfts(); // 값이 있는 상태에서 실행하면X, 일부러 값을 비워줌

      // 불러올 tokenId 의 값 정의하기
      for (let i = 0; i < 10; i++) {
        const tokenId = i + 1 + (p - 1) * 10;
        // 3페이지라면, 3페이지 -1 = 2, 여기에 10 곱해서 20.
        // 20을 i + 1 문으로 1번씩 돌리면 21~30 까지의 토큰 id 를 적용할 수 있다.

        let response = await axios.get(
          `${process.env.REACT_APP_JSON_URL}/${tokenId}.json`
        );

        nftArray.push({ tokenId, metadata: response.data });
      }

      setNfts(nftArray);
    } catch (error) {
      console.log(error);
    }
  };

  // 여기서 "p" 값을 정의함. selectedPage 의 p 값을
  // 가져와서 쓸수있음. page 수를 p로 가져오는것?
  //

  const pageComp = () => {
    let pageArray = [];

    // 페이지 버튼을 생성
    for (let i = 0; i < page; i++) {
      pageArray.push(
        <button
          key={i}
          className={`ml-4 text-2xl font-bold hover:text-white  ${
            i + 1 === selectedPage ? "text-white" : "text-gray-400"
          }`}
          onClick={onClickPage(i + 1)}
        >
          {i + 1} <span className="text-base">페이지</span>
        </button>
      );
    }

    return pageArray;
  };

  useEffect(() => {
    console.log(nfts);
  }, [nfts]);

  // 렌더링 될때, 기본적으로 1페이지의 정보를 가져오기 위해 1이라는 값이 인풋
  useEffect(() => {
    getNfts(1);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto pt-4 ">
      <div>{pageComp()}</div>
      <ul className="mt-8 grid grid-cols-2 justify-items-center gap-10 ">
        {nfts ? (
          nfts.map((v, i) => {
            return (
              <NftCard
                key={i}
                tokenId={v.tokenId}
                metadata={v.metadata}
                mintedNft={mintedNft}
              />
            );
          })
        ) : (
          <div>로딩중입니다...</div>
        )}
      </ul>
    </div>
  );
};

export default Nfts;
