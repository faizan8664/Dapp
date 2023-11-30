## faiz 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    // Array Matching Function
    function matchArray(uint8 _element) public pure returns (bool) {
        uint8[5] memory targetArray = [1, 3, 5, 7, 9];
        for (uint8 i = 0; i < targetArray.length; i++) {
            if (_element == targetArray[i]) {
                return true;
            }
        }
        return false;
    }

    // Number Range Matching Function
    function matchNumberRange(uint256 _number) public pure returns (bool) {
        uint256 lowerBound = 10;
        uint256 upperBound = 100;
        return (_number >= lowerBound && _number <= upperBound);
    }

    // String Matching Function
    function matchString(string memory _input) public pure returns (bool) {
        string memory targetString = "Hello";
        return (keccak256(abi.encodePacked(_input)) == keccak256(abi.encodePacked(targetString)));
    }
}
