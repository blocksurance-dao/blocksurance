// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Registar {
	bytes32 private apiKey;
	address payable private owner;

	struct User {
		address user;
		address ref;
		uint256 time;
	}

	User[] private userList;
	mapping(address => User) private userMap;
	mapping(address => bool) private registar;
	mapping(address => bytes32) private pincodes;
	mapping(address => address) private refCode;
	mapping(address => address[]) private refferals;

	constructor(address _apiKey, uint24 pinCode) {
		apiKey = keccak256(abi.encodePacked(_apiKey));
		owner = payable(msg.sender);
		pincodes[msg.sender] = keccak256(abi.encodePacked(pinCode));
		registar[owner] = true;
		refCode[owner] = owner;
	}

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

	function register(
		address _addr,
		address _apiKey,
		uint24 pinCode
	) external virtual validKey(_apiKey) {
		require(_addr != msg.sender, "Duplicate value!");
		require(registar[_addr] == true, "Invalid ref code!");
		require(registar[msg.sender] != true, "Already registered!");

		refCode[msg.sender] = _addr;
		registar[msg.sender] = true;
		refferals[_addr].push(msg.sender);
		userList.push(User(msg.sender, _addr, block.timestamp));
		userMap[msg.sender] = User(msg.sender, _addr, block.timestamp);
		pincodes[msg.sender] = keccak256(abi.encodePacked(pinCode));
	}

	function get(address _addr, address _apiKey)
		public
		view
		validKey(_apiKey)
		returns (bool)
	{
		return registar[_addr];
	}

	function getRef(address _addr, bytes32 _apiKey)
		public
		view
		returns (address)
	{
		require(apiKey == _apiKey, "Access denied!");
		return refCode[_addr];
	}

	function validatePin(uint24 pinCode, address _apiKey)
		external
		view
		validKey(_apiKey)
		returns (bool)
	{
		bool ret = (pincodes[msg.sender] ==
			keccak256(abi.encodePacked(pinCode)));

		return ret;
	}

	/** @dev Function to get one user by address.
	 * @return  User object
	 */
	function getUser(address _addr, address _apiKey)
		external
		view
		onlyOwner
		validKey(_apiKey)
		returns (User memory)
	{
		return userMap[_addr];
	}

	/** @dev Function to get all registered users.
	 * @return Array of User objects
	 */
	function getUsers(address _apiKey)
		external
		view
		onlyOwner
		validKey(_apiKey)
		returns (User[] memory)
	{
		return userList;
	}

	/** @dev Function to get all refferals for a user.
	 * @return Array of addresses
	 */
	function getRefferals(address _addr, address _apiKey)
		external
		view
		validKey(_apiKey)
		returns (address[] memory)
	{
		return refferals[_addr];
	}
}
