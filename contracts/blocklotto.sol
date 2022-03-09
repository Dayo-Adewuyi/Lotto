//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract blocklotto {
    constructor() {
        owner = msg.sender;
    }

    address public owner;
    address[] public players;

    modifier ticket() {
        require(msg.value == .05 ether, "amount must be 0.05 ether");
        _;
    }

    function enter() public payable ticket {
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        block.number,
                        players
                    )
                )
            );
    }

    modifier boss() {
        require(msg.sender == owner, "only bosses can call this function");
        _;
    }

    function cashout()  public boss payable {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);

    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }
}
