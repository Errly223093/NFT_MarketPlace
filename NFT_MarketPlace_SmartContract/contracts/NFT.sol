// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract mintNFT is ERC721("TEST", "TEST") {

    mapping(uint => uint) nftPrices;
    uint maxSupply = 30;
    uint supply;
    string URI;
    IERC20 token = IERC20(0x99820251Fa20998b770EB08B845dbB4c73E6DD7D); // 결제에 사용할 ERC20 토큰

    constructor(string memory _uri){
        URI = _uri;
        // https://gateway.pinata.cloud/ipfs/QmeRXRmjjCGmP1d48M4VKax3YTxEnm5F5siCZmoExeNu5q
    }

    function batchMint(uint _number) public {
        uint count;
        for(uint i = 1; i <= _number; i++){
            _mint(msg.sender, i);
            count++;
        }
        supply = count;
    }

    function tokenURI(uint _tokenId) public override view returns(string memory){
        return string(abi.encodePacked(URI,"/",Strings.toString(_tokenId),".json"));
    }

    // 현재 발행량
    function supplys() public view returns(uint){
        return supply;
    }

    // 최대 발행량
    function maxsupplys() public view returns(uint){
        return maxSupply;
    }

    // 특정 주소가 소유한 NFT id 값 반환
    function getNftId(address _owner) public view returns(uint[] memory){
        uint[] memory ids = new uint[](balanceOf(_owner));
        uint count;
        for(uint i=1; i < supplys()+1; i++){
            if(ownerOf(i) == _owner){
                ids[count++] = i;
            }
        }
        return ids;
    }

    // 1_ 토큰id 의 가격을 확인 (판매 중인지 확인. 0 이라면 판매 중이 아님)
    function getNftprices_1(uint[] memory _tokenIds) public view returns(uint[] memory){
        uint[] memory ids = new uint[](_tokenIds.length);
        for(uint i = 1; i < _tokenIds.length; i++){
            ids[i] = nftPrices[i];
        }
        return ids;
    }

    // 2_ 특정 토큰id 의 가격을 확인 (판매 중인지 확인. 0 이라면 판매 중이 아님)
    function getNftprices_2(uint _tokenId) public view returns(uint){
        require(_tokenId > 0 && _tokenId <= maxSupply);
        return nftPrices[_tokenId];
    }

    // 판매 등록. 모든 NFT 에 대한 Approve 설정
    function saleRegist(uint _tokenId, uint _price) public {
        require(msg.sender == ownerOf(_tokenId) && _price > 0,"Failed to list");
        approve(address(this), _tokenId);
        nftPrices[_tokenId] = _price;

    }

    // 판매 취소
    function cancelSaleRegist(uint _tokenId) public {
        require(msg.sender == ownerOf(_tokenId) && nftPrices[_tokenId] > 0,"Failed to calcel");
        nftPrices[_tokenId] = 0;
    }

    // 구매
    function buyNft(uint _tokenId) public {
        address NftOwner = ownerOf(_tokenId);
        require(nftPrices[_tokenId] > 0 && NftOwner != msg.sender && token.balanceOf(msg.sender) > nftPrices[_tokenId],"Failed to buy");
        token.transferFrom(tx.origin, NftOwner, nftPrices[_tokenId]);
        _transfer(NftOwner, tx.origin, _tokenId);
        nftPrices[_tokenId] = 0;
    }
}