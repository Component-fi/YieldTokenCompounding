// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./IYieldTokenCompounding.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";

/// @notice yield token compounding without having to swap to basetokens from ETH manually
contract YTCEth {
    IYieldTokenCompounding public immutable ytcContract;
    IUniswapV2Router02 public immutable uniswapRouter;

    constructor(address _ytcAddress, address _uniswapRouterAddress){
        ytcContract = IYieldTokenCompounding(_ytcAddress);
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }
    
    struct Inputs {
        uint8 _n;
        address _trancheAddress;
        bytes32 _balancerPoolId;
        uint256 _expectedYtOutput;
        uint256 _expectedBaseTokensSpent;
        address _underlyingAddress;
        address _yieldTokenAddress;
        uint256 _amountUnderlying;
        uint256 _deadline;
    }
    

    // Requires all the same inputs as YieldTokenCompoundingSwap + the address of the underlying token
    function compound(
        uint8 _n,
        address _trancheAddress,
        bytes32 _balancerPoolId,
        uint256 _expectedYtOutput,
        uint256 _expectedBaseTokensSpent,
        address _underlyingAddress,
        address _yieldTokenAddress,
        uint256 _amountUnderlying,
        uint256 _deadline
    ) external payable returns (uint256, uint256, uint256) {

        Inputs memory inputs = Inputs(
            _n,
            _trancheAddress,
            _balancerPoolId,
            _expectedYtOutput,
            _expectedBaseTokensSpent,
            _underlyingAddress,
            _yieldTokenAddress,
            _amountUnderlying,
            _deadline
        );
        
        return _executeCompound(inputs);
    }
    
    function _executeCompound(Inputs memory _inputs) private returns (uint256, uint256, uint256) {
        // first swap ethe to _underlyingAddress Token
        uint[] memory amounts = _executeSwap(msg.value, _inputs._underlyingAddress, _inputs._amountUnderlying, address(this), _inputs._deadline);

        // then approve ytcPool on _underlyingAddress token
        IERC20 underlyingTokens = IERC20(_inputs._underlyingAddress);
        underlyingTokens.approve(address(ytcContract), amounts[1]);

        // then run ytc.compound passing through the amount
        (uint256 yieldTokensReceived, uint256 baseTokensSpent ) = ytcContract.compound(_inputs._n, _inputs._trancheAddress, _inputs._balancerPoolId, amounts[1], _inputs._expectedYtOutput, _inputs._expectedBaseTokensSpent);

        // transfer yieldTokens back to msg.sender
        IERC20 yieldToken = IERC20(_inputs._yieldTokenAddress);
        yieldToken.transfer(msg.sender, yieldTokensReceived);

        // transfer underlyingTokens to msg.sender
        underlyingTokens.transfer(msg.sender, amounts[1] - baseTokensSpent);

        return (amounts[1], yieldTokensReceived, baseTokensSpent);
    }
    
    
    function _executeSwap(uint256 _value, address _underlyingAddress, uint256 _amountUnderlying, address _receiveAddress, uint256 _deadline) private returns (uint[] memory amounts){
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = _underlyingAddress;
        return uniswapRouter.swapExactETHForTokens{value: _value}(_amountUnderlying, path, _receiveAddress, _deadline);
    }
}
