pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

//  Add a name and a symbol for your starNotary tokens
    string public name = "AF Stars (for Udacity BlockDevNano)";
    string public symbol = "ASN";
//

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public {
        //Require new star doesn't already exist
        require(_exists(_tokenId) == false);
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }

// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo (uint256 _tokenId) public view returns (string _name){
        require(_exists(_tokenId));
        Star memory star = tokenIdToStarInfo[_tokenId];
        _name = star.name;
    }
//
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars(uint256 _starToGetId, uint256 _starToSendId) public {
        //Check both stars exist
        require(_exists(_starToGetId) && _exists(_starToSendId));
        //Check Star to Send is owned by sender
        address starToGetOwner = ownerOf(_starToGetId);
        address starToSendOwner = ownerOf(_starToSendId);
        require(starToSendOwner == msg.sender);
        //Check Star to get is Appoved to be managed by sender
        require(_isApprovedOrOwner(msg.sender, _starToGetId));
        //Check owners of both stars aren't the same address
        require(starToSendOwner != starToGetOwner);
        
        //Exchange
        transferFrom(starToGetOwner, starToSendOwner, _starToGetId);
        transferFrom(starToSendOwner, starToGetOwner, _starToSendId);

        //Remove both stars from sale
        starsForSale[_starToGetId] = 0;
        starsForSale[_starToSendId] = 0;

    }
//

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//
    function transferStar(address _to, uint256 _tokenId) public{
        //Star must exist
        require(_exists(_tokenId));
        //Owner must be caller (no approvals are valid for this function then)
        require(ownerOf(_tokenId) == msg.sender);
        //Transfer
        transferFrom(msg.sender, _to, _tokenId);
    }

}