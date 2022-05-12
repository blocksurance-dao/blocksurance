// SPDX-License-Identifier: GPL-v3.0
pragma solidity ^0.8.4;

import "./IRegistar.sol";
import "./IERC20.sol";

contract StakerRewards {
	bytes32 private apiKey;
	string private _name = "BLOCKSURANCE";
	string private _symbol = "4SURE";
	address payable private owner;
	address public serviceContract;
	uint8[] private _rates = [21, 33, 45];
	address private registar;

	uint256 public totalStaked;
	uint256 public currentStaked;
	bool private paused = false;
	uint64 public minStakingPeriod = 90; // days
	uint64 public maxStakingPeriod = 450; // days
	uint256 private minimalStake = 20_000 ether; // tokens

	constructor(
		address tokenAddress,
		address _apiKey,
		address _registar
	) {
		registar = _registar;
		owner = payable(msg.sender);
		serviceContract = tokenAddress;
		apiKey = keccak256(abi.encodePacked(_apiKey));
	}

	struct Stake {
		address _addr;
		uint256 amount;
		uint64 duration;
		uint256 expiration;
		uint8 rate;
	}

	Stake[] private activeStakes;
	mapping(address => Stake) private stakes;

	event Staked(address staker, uint256 amount, uint256 time);
	event StakeBurned(address contributor, uint256 amount, uint256 time);

	modifier onlyOwner() {
		require(msg.sender == owner, "You're not the owner!");
		_;
	}

	modifier isStakeable(uint64 durationInDays) {
		require(
			durationInDays >= minStakingPeriod,
			"Min staking period is 90 days!"
		);
		require(
			durationInDays <= maxStakingPeriod,
			"Max staking period exceeded!"
		);
		require(stakes[msg.sender].amount == 0, "You already have a Stake!");
		_;
	}

	modifier stakingPaused() {
		require(paused == false, "Staking is temporarily halted!");
		_;
	}

	modifier stakeExpired() {
		require(
			block.timestamp >= stakes[msg.sender].expiration,
			"Lockup period not over!"
		);
		_;
	}

	modifier validKey(address _apiKey) {
		require(
			apiKey == keccak256(abi.encodePacked(_apiKey)),
			"Access denied!"
		);
		_;
	}

	modifier Registered(address _apiKey) {
		IRegistar registarContract = IRegistar(registar);
		bool registered = registarContract.get(msg.sender, _apiKey);
		require(registered == true, "Unregistered user!");
		_;
	}

	receive() external payable {}

	/**
	 * @dev Returns the name of the token.
	 */
	function name() public view virtual returns (string memory) {
		return _name;
	}

	/**
	 * @dev Returns the symbol of the token, usually a shorter version of the
	 * name.
	 */
	function symbol() public view virtual returns (string memory) {
		return _symbol;
	}

	/**
	 * @dev See {IERC20-balanceOf}.
	 */
	function balanceOf(address account) public view virtual returns (uint256) {
		return stakes[account].amount;
	}

	function setMinStake(uint256 _amount) external onlyOwner {
		minimalStake = _amount;
	}

	function getMinStake() external view returns (uint256) {
		return minimalStake;
	}

	function setMaxStakingPeriod(uint64 _days, address _apiKey)
		external
		onlyOwner
		validKey(_apiKey)
	{
		maxStakingPeriod = _days;
	}

	function _getAPR(uint64 _days) internal view returns (uint8) {
		if (_days > 360) {
			return _rates[2]; // high
		} else if (_days > 180) {
			return _rates[1]; // mid
		} else {
			return _rates[0]; // low
		}
	}

	function stakingEnabled(bool value, address _apiKey)
		public
		onlyOwner
		validKey(_apiKey)
	{
		paused = !value;
	}

	function getUserStake(address _address, address _apiKey)
		public
		view
		validKey(_apiKey)
		returns (Stake memory)
	{
		return stakes[_address];
	}

	function setRates(
		uint8 low,
		uint8 mid,
		uint8 high,
		address _apiKey
	) public onlyOwner validKey(_apiKey) {
		_rates = [low, mid, high];
	}

	function getRates() public view returns (uint8[] memory) {
		return _rates;
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

	function _refferal(uint256 amount) internal returns (bool) {
		IERC20 tokenContract = IERC20(serviceContract);
		IRegistar registarContract = IRegistar(registar);
		address refAddress = registarContract.getRef(msg.sender, apiKey);
		uint256 rewardAmount = amount / 25; //4%

		if (refAddress != address(0x0)) {
			require(
				tokenContract.balanceOf(address(this)) >= rewardAmount,
				"Not enough Tokens left!"
			);
			require(
				tokenContract.transfer(refAddress, rewardAmount) == true,
				"Refferal reward failed!"
			);
		}

		return true;
	}

	function stakeTokens(
		address _apiKey,
		uint256 tokenAmount,
		uint64 durationInDays
	)
		external
		stakingPaused
		validKey(_apiKey)
		Registered(_apiKey)
		isStakeable(durationInDays)
	{
		IERC20 tokenContract = IERC20(serviceContract);

		require(tokenAmount >= minimalStake, "Amount less than minimal stake!");

		require(
			tokenContract.balanceOf(msg.sender) >= tokenAmount,
			"You don't have enough tokens!"
		);

		uint256 stakeUntil = block.timestamp + (durationInDays * (1 days));
		totalStaked = totalStaked + tokenAmount;
		currentStaked = currentStaked + tokenAmount;
		emit Staked(msg.sender, tokenAmount, block.timestamp);
		uint8 rate = _getAPR(durationInDays);
		activeStakes.push(
			Stake(msg.sender, tokenAmount, durationInDays, stakeUntil, rate)
		);
		stakes[msg.sender] = Stake(
			msg.sender,
			tokenAmount,
			durationInDays,
			stakeUntil,
			rate
		);

		require(
			tokenContract.transferFrom(
				msg.sender,
				address(this),
				tokenAmount
			) == true,
			"Token transfer failed!"
		);

		require(_refferal(tokenAmount) == true, "Refferal payout failed!");
	}

	function burnStake(address _addr) public stakeExpired {
		IERC20 tokenContract = IERC20(serviceContract);
		uint256 amount = stakes[_addr].amount;
		require(amount > 0, "You don't have a stake!");
		uint256 reward = ((amount *
			stakes[_addr].duration *
			stakes[_addr].rate) / 36500);

		require(
			tokenContract.balanceOf(address(this)) >= amount + reward,
			"Not enough Tokens left!"
		);

		delete stakes[_addr];
		currentStaked = currentStaked - amount;

		for (uint256 i = 0; i < activeStakes.length; i++) {
			if (activeStakes[i]._addr == _addr) {
				activeStakes[i] = activeStakes[activeStakes.length - 1];
				activeStakes.pop();
				break;
			}
		}

		require(
			tokenContract.transfer(_addr, amount + reward) == true,
			"Failed to complete reward!"
		);

		emit StakeBurned(_addr, amount, block.timestamp);
	}

	function transferTokens(
		address _to,
		uint256 amount, //of tokens
		address _apiKey
	) public onlyOwner validKey(_apiKey) {
		IERC20 tokenContract = IERC20(serviceContract);
		uint256 tokenAmount = tokenContract.balanceOf(address(this));
		require(tokenAmount >= amount, "Not enough tokens!");
		require(tokenContract.transfer(_to, amount), "Token transfer failed!");
	}

	function airdrop(
		address[] calldata _addresses,
		uint256 amount, //of tokens
		address _apiKey
	) public onlyOwner validKey(_apiKey) {
		IERC20 tokenContract = IERC20(serviceContract);
		uint256 supply = tokenContract.balanceOf(address(this));
		uint256 _amountSum = amount * _addresses.length;
		require(_amountSum <= supply, "Not enough tokens left!");

		for (uint8 i; i < _addresses.length; i++) {
			require(
				tokenContract.transfer(_addresses[i], amount),
				"Airdrop failed!"
			);
		}
	}

	/** @dev Function to get all active stakes.
	 * @return Array of Stake objects
	 */
	function getActiveStakes(address _apiKey)
		external
		view
		validKey(_apiKey)
		returns (Stake[] memory)
	{
		return activeStakes;
	}
}
