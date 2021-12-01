// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./IYieldTokenCompounding.sol";
import "./balancer-core-v2/lib/openzeppelin/IERC20.sol";
import "./balancer-core-v2/lib/openzeppelin/SafeMath.sol";
import "./balancer-core-v2/lib/openzeppelin/SafeERC20.sol";

/// @notice yield token compounding without having to swap to basetokens from ETH manually
contract YTCZap {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IYieldTokenCompounding public immutable ytcContract;

    constructor(address _ytcAddress){
        ytcContract = IYieldTokenCompounding(_ytcAddress);
    }

    // no-one other than the blackhole address should be able to call this contract
    // It will eat your tokens!!!
    modifier onlyBlackHole {
        require(msg.sender == address(0));
        _;
    }

    struct YTCInputs {
        uint8 n;
        address trancheAddress;
        bytes32 balancerPoolId;
        uint256 amount;
        uint256 expectedYtOutput;
        uint256 expectedBaseTokensSpent;
        address baseToken;
        address yieldToken;
    }
    
    // Requires all the same inputs as YieldTokenCompoundingSwap + the address of the base token, the yield token, and the zapper information
    function compound(
        uint8 _n,
        address _trancheAddress,
        bytes32 _balancerPoolId,
        uint256 _amount,
        uint256 _expectedYtOutput,
        uint256 _expectedBaseTokensSpent,
        address _baseToken,
        address _yieldToken,
        bytes calldata _zapCallData,
        address payable _zapperContract
    ) external payable onlyBlackHole returns (uint256, uint256) {

        YTCInputs memory ytcInputs;

        {
            ytcInputs.n = _n;
            ytcInputs.trancheAddress = _trancheAddress;
            ytcInputs.balancerPoolId = _balancerPoolId;
            ytcInputs.expectedYtOutput = _expectedYtOutput;
        }
        {
            ytcInputs.amount = _amount;
            ytcInputs.expectedBaseTokensSpent = _expectedBaseTokensSpent;
            ytcInputs.baseToken = _baseToken;
            ytcInputs.yieldToken = _yieldToken;
        }

        uint256 amount;
        {
            amount = _executeSwap(msg.value, ytcInputs.baseToken, _zapperContract, _zapCallData);
            require(amount >= ytcInputs.amount, "Not enough tokens received in swap");
        }

        // then approve ytcPool on _underlyingAddress token
        IERC20(_baseToken).approve(address(ytcContract), _amount);

        // then run ytc.compound passing through the amount
        uint256 yieldTokensReceived;
        uint256 baseTokensSpent;
        {
            (yieldTokensReceived, baseTokensSpent ) = ytcContract.compound(ytcInputs.n, ytcInputs.trancheAddress, ytcInputs.balancerPoolId, ytcInputs.amount, ytcInputs.expectedYtOutput, ytcInputs.expectedBaseTokensSpent);
        }

        return (yieldTokensReceived, baseTokensSpent);
    }
    
    function _executeSwap(uint256 _value, address _baseToken, address payable _zapperContract, bytes memory _zapCallData) private returns (uint256 balance){

        uint256 initialBalance = _getBalance(_baseToken);

        (bool success, ) = _zapperContract.call{value: _value}(_zapCallData);

        require(success, "Zap Failed");

        balance = _getBalance(_baseToken).sub(initialBalance);

        require (balance > 0, "Swapped to Invalid Token"); 
    }

    function _getBalance(address token)
        internal
        view
        returns (uint256 balance)
    {
        if (token == address(0)) {
            balance = address(this).balance;
        } else {
            balance = IERC20(token).balanceOf(address(this));
        }
    }
}
