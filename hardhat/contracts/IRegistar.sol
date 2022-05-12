// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Interface of the BLOCKSURANCE Registar.
 */
interface IRegistar {
	struct User {
		address user;
		address ref;
		uint256 time;
	}

	function get(address _addr, address _apiKey) external view returns (bool);

	function register(address _addr, address _apiKey) external;

	function getRef(address _addr, bytes32 _apiKey)
		external
		view
		returns (address);

	function setRef(address _addr, address _apiKey) external;

	function validatePin(uint24 pinCode, address _apiKey)
		external
		view
		returns (bool);

	function getUser(address _addr, address _apiKey)
		external
		view
		returns (User memory);

	function getUsers(address _apiKey) external view returns (User[] memory);

	function getRefferals(address _addr, address _apiKey)
		external
		view
		returns (address[] memory);
}
