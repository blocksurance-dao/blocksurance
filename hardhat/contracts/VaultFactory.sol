// SPDX-License-Identifier: GPL-v3.0
pragma solidity ^0.8.4;

import "./Vault.sol";
import "./IRegistar.sol";
import "./IWhiteList.sol";

contract VaultFactory {
	bytes32 private apiKey;
	address private registar;
	address private whitelist;
	address payable private owner;

	constructor(
		address _apiKey,
		address _registar,
		address _whitelist
	) {
		registar = _registar;
		whitelist = _whitelist;
		owner = payable(msg.sender);
		apiKey = keccak256(abi.encodePacked(_apiKey));
	}

	struct NewVault {
		string vaultName;
		address vaultAddress;
		address vaultStarter;
		address tokenAddress;
	}

	mapping(address => NewVault[]) private vaults;

	event WithdrawTokens(
		address tokenAddress,
		uint256 amount,
		address _to,
		uint256 time
	);

	event VaultDeployed(
		string vaultName,
		address vaultAddress,
		address deployerAddress
	);

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

	/** @dev Function to start a new Vault.
	 * @param tokenAddress Address of token you want to insure
	 */
	function createVault(
		address tokenAddress,
		address _apiKey,
		string memory _name
	) external payable validKey(_apiKey) returns (NewVault memory) {
		require(msg.value == 1 ether / 200, "Insufficient payment!");
		IWhiteList wlContract = IWhiteList(whitelist);
		require(wlContract.get(tokenAddress) == true, "Unlisted token!");

		IRegistar registarContract = IRegistar(registar);
		bool registered = registarContract.get(msg.sender, _apiKey);
		require(registered == true, "Unregistered user!");
		address refAddress = registarContract.getRef(msg.sender, apiKey);

		_deployVault(tokenAddress, msg.sender, _name, refAddress);

		uint256 sIndex = (
			vaults[msg.sender].length < 1 ? 0 : vaults[msg.sender].length - 1
		);

		return vaults[msg.sender][sIndex];
	}

	/** @dev Function to deploy a new Vault.
	 * @param tokenAddress Address of token you want to insure
	 * @param deployerAddress Address of token you want to insure
	 */
	function _deployVault(
		address tokenAddress,
		address deployerAddress,
		string memory vaultName,
		address refAddress
	) internal returns (address) {
		address vaultContract = address(
			new Vault(
				tokenAddress,
				address(this), //account2
				deployerAddress,
				vaultName,
				refAddress,
				apiKey
			)
		);

		emit VaultDeployed(vaultName, vaultContract, deployerAddress);
		vaults[deployerAddress].push(
			NewVault(vaultName, vaultContract, deployerAddress, tokenAddress)
		);
		return vaultContract;
	}

	function balance() external view onlyOwner returns (uint256) {
		return address(this).balance;
	}

	function getUserVaults(address _address, address _apiKey)
		public
		view
		validKey(_apiKey)
		returns (NewVault[] memory)
	{
		return vaults[_address];
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

	function transferTokens(
		address tokenAddress,
		address _to,
		uint256 amount,
		address _apiKey
	) public onlyOwner validKey(_apiKey) {
		IERC20 tokenContract = IERC20(tokenAddress);
		uint256 tokenAmount = tokenContract.balanceOf(address(this));
		require(tokenAmount >= amount, "Not enough tokens!");
		require(
			tokenContract.transfer(_to, tokenAmount),
			"Token transfer failed!"
		);
		emit WithdrawTokens(tokenAddress, tokenAmount, _to, block.timestamp);
	}
}
