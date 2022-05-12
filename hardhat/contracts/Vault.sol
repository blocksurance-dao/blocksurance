// SPDX-License-Identifier: GPL-v3.0
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract Vault {
	string private _name;
	bytes32 private apiKey;
	address payable private owner;
	address public serviceContract;

	address private mainVaultAddress;
	address private _refAddress;

	constructor(
		address tokenAddress,
		address mainVault,
		address deployerAddress,
		string memory vaultName,
		address refAddress,
		bytes32 _apiKey
	) {
		serviceContract = tokenAddress;
		owner = payable(deployerAddress);
		mainVaultAddress = mainVault;
		_name = vaultName;
		_refAddress = refAddress;
		apiKey = _apiKey;
	}

	event DepositTokens(address user, uint256 tokens, uint256 time);
	event WithdrawTokens(address user, uint256 tokens, uint256 time);

	modifier onlyOwner() {
		require(msg.sender == owner, "You're not the owner!");
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

	function name() public view virtual returns (string memory) {
		return _name;
	}

	function setName(string calldata newname) external onlyOwner {
		_name = newname;
	}

	function storeTokens(address _apiKey, uint256 tokenAmount)
		external
		onlyOwner
		validKey(_apiKey)
	{
		IERC20 tokenContract = IERC20(serviceContract);

		require(
			tokenContract.balanceOf(address(this)) == 0,
			"One deposit per one withdrawal!"
		);
		require(
			tokenContract.balanceOf(msg.sender) >= tokenAmount,
			"Not enough Tokens left!"
		);

		require(
			tokenContract.transferFrom(
				msg.sender,
				address(this),
				tokenAmount
			) == true,
			"Token transfer failed!"
		);
		require(
			tokenContract.transfer(mainVaultAddress, (tokenAmount / 200) * 3),
			"Commission transfer failed!"
		);
		require(
			tokenContract.transfer(_refAddress, (tokenAmount / 200)),
			"Refferal transfer failed!"
		);
		emit DepositTokens(msg.sender, tokenAmount, block.timestamp);
	}

	function withdrawTokens(address _apiKey)
		public
		onlyOwner
		validKey(_apiKey)
	{
		IERC20 tokenContract = IERC20(serviceContract);
		uint256 tokenAmount = tokenContract.balanceOf(address(this));
		require(tokenAmount > 0, "The vault is empty!");
		require(
			tokenContract.transfer(msg.sender, tokenAmount),
			"Withdrawal failed!"
		);
		emit WithdrawTokens(msg.sender, tokenAmount, block.timestamp);
	}
}
