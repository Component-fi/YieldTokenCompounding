// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./YieldTokenCompounding.sol";
import "./zapper-fi/Curve_ZapIn_General_V5.sol";

/// @notice yield token compounding without having to swap to basetokens from ETH manually
contract YTCEthCurve {
    YieldTokenCompounding public immutable ytcContract;

    constructor(address _ytcAddress, address _zapperAddress){
        ytcContract = YieldTokenCompounding(_ytcAddress);
    }
    
    struct YTCInputs {
        uint8 n,
        address trancheAddress,
        bytes32 balancerPoolId,
        uint256 amount,
        uint256 expectedYtOutput,
        uint256 expectedBaseTokensSpent,
        address baseToken,
        address yieldToken
    }

    struct ZapInputs {
        bytes calldata zapCallData,
        address zapperContract,
    }
    

    // Requires all the same inputs as YieldTokenCompoundingSwap + the address of the underlying token
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
        address _zapperContract
    ) external payable returns (uint256, uint256, uint256) {

        YTCInputs memory ytcInputs = YTCInputs(
            _n,
            _trancheAddress,
            _balancerPoolId,
            _amount,
            _expectedYtOutput,
            _expectedBaseTokensSpent,
            _baseToken,
            _yieldToken,
        );

        ZapInputs memory zapInputs = ZapInputs(
            _zapCallData,
            _zapperContract,
        );
        
        return _executeCompound(ytcInputs, zapInputs);
    }
    
    function _executeCompound(YTCInputs memory _ytcInputs, ZapInputs memory _zapInputs) private returns (uint256, uint256, uint256) {
        // first swap ethe to _underlyingAddress Token
        uint256 amount = _executeSwap(msg.value, _inputs.baseToken, _zapInputs.zapperContract, _zapInputs.zapCallData);

        // then approve ytcPool on _underlyingAddress token
        IERC20 baseToken = IERC20(_inputs._baseToken);
        baseToken.approve(address(ytcContract), amount);

        // then run ytc.compound passing through the amount
        (uint256 yieldTokensReceived, uint256 baseTokensSpent ) = ytcContract.compound(_inputs._n, _inputs._trancheAddress, _inputs._balancerPoolId, amount, _inputs._expectedYtOutput, _inputs._expectedBaseTokensSpent);

        // transfer yieldTokens back to msg.sender
        IERC20 yieldToken = IERC20(_inputs._yieldToken);
        yieldToken.transfer(msg.sender, yieldTokensReceived);

        // transfer underlyingTokens to msg.sender
        baseToken.transfer(msg.sender, amount - baseTokensSpent);

        return (amount, yieldTokensReceived, baseTokensSpent);
    }
    
    
    function _executeSwap(uint256 _value, address _baseToken, address _zapperContract, bytes calldata _swapData) private returns (uint256 balance){

        uint256 initialBalance = _getBalance(baseToken);

        (bool success, uint256 amount) = _zapperContract.call.{value: _value}(_swapData);

        require(success, "Zap Failed");

        balance = _getBalance(baseToken).sub(initialBalance);

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
