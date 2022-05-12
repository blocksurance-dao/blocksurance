// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./IRegistar.sol";
import "./IERC20.sol";

contract Vendor {
	constructor(
		address _tokenAddr,
		address _apiKey,
		address _registar
	) {
		registar = _registar;
		owner = payable(msg.sender);
		serviceContract = _tokenAddr;
		apiKey = keccak256(abi.encodePacked(_apiKey));
	}

	bytes32 private apiKey;
	address private registar;
	address payable private owner;
	address private serviceContract;
	bool private paused = false;

	uint256 public supply;
	uint256 public totalSold;
	uint256 public tokensPerEth = 70000; // ~$0.05 per token
	uint256 public minimalBuy = 5_000_000 ether; //~$250,000 worth

	event BuyTokens(address buyer, uint256 amountOfETH, uint256 tokens);

	modifier onlyOwner() {
		require(msg.sender == owner, "You're not the owner!");
		_;
	}

	modifier Registered(address _apiKey) {
		IRegistar registarContract = IRegistar(registar);
		bool registered = registarContract.get(msg.sender, _apiKey);
		require(registered == true, "Unregistered user!");
		_;
	}

	modifier notPaused() {
		require(paused == false, "Sales temporarily halted!");
		_;
	}

	modifier validKey(address _apiKey) {
		require(
			apiKey == keccak256(abi.encodePacked(_apiKey)),
			"Access denied!"
		);
		_;
	}

	receive() external payable {}

	function getMinBuy() external view returns (uint256) {
		return minimalBuy;
	}

	function setMinBuy(uint256 _amount, address _apiKey)
		external
		onlyOwner
		validKey(_apiKey)
	{
		minimalBuy = _amount;
	}

	function getPrice() external view returns (uint256) {
		return tokensPerEth;
	}

	function setPrice(uint256 _amount, address _apiKey)
		external
		onlyOwner
		validKey(_apiKey)
	{
		tokensPerEth = _amount;
	}

	function setPaused(bool value, address _apiKey)
		public
		onlyOwner
		validKey(_apiKey)
	{
		paused = value;
	}

	function checkSupply(address _apiKey)
		public
		view
		validKey(_apiKey)
		returns (uint256)
	{
		IERC20 tokenContract = IERC20(serviceContract);
		return tokenContract.balanceOf(address(this));
	}

	function balance(address _apiKey)
		public
		view
		validKey(_apiKey)
		returns (uint256)
	{
		return address(this).balance;
	}

	function buyTokens(address _apiKey)
		external
		payable
		notPaused
		validKey(_apiKey)
		Registered(_apiKey)
	{
		uint256 tokenAmount = msg.value * tokensPerEth;
		totalSold = totalSold + tokenAmount;
		IERC20 tokenContract = IERC20(serviceContract);
		supply = tokenContract.balanceOf(address(this));

		require(totalSold <= supply, "Not enough tokens left!");
		require(tokenAmount >= minimalBuy, "Less than minimal buy amount!");
		require(supply >= tokenAmount, "Not enough Tokens left!");
		supply = supply - tokenAmount;

		require(
			tokenContract.transfer(msg.sender, tokenAmount) == true,
			"Failed to complete buy!"
		);
		emit BuyTokens(msg.sender, msg.value, tokenAmount);
	}

	function withdraw(uint256 amount, address _apiKey)
		public
		onlyOwner
		validKey(_apiKey)
	{
		require(address(this).balance >= amount, "Not enough ETH!");
		(bool success, ) = owner.call{ value: amount }("");
		require(success, "could not withdraw");
	}
}
