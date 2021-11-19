// Zapper address = 0x5Ce9b49B7A1bE9f2c3DC2B2A5BaCEA56fa21FBeE
pragma solidity ^0.7.0;

import "./YieldTokenCompounding.sol";
import "./zapper-fi/Curve_ZapIn_General_V4.sol";
import "./element-finance/ITranche.sol";


contract YTCZap {
    YieldTokenCompounding public immutable ytcContract;
    ZapContract public immutable zapContract;

    constructor(address _ytcAddress, address _zapAddress){
        ytcContract = YieldTokenCompounding(_ytcAddress);
        zapContract = ZapContract(_zapAddress);
    }


    function compound(
        uint8 _n,
        address _trancheAddress,
        address _swapAddress,
        bytes32 _balancerPoolId,
        uint256 _amount,
        uint256 _tokenIn,
        uint256 _expectedBaseTokensConverted
        uint256 _expectedYTOutput,
        uint256 _expectedBaseTokensSpent
    ) public return (uint256, uint256){
        // Get the required crv token address

        ITranche tranche = ITranche(_trancheAddress);
        address outAddress = tranche.underlying();

        // First grab the eth that's sent, and zap it into a curve pool, with a minimum of _expectedBaseTokensConverted;
        // if the ethaddress is 0
        uint256 crvTokensBought = zapContract.ZapIn(
            _tokenIn,
            outAddress,
            _swapAddress,
            _amount,
            _expectedBaseTokensConverted,
            // what is swap target
            swapTarget,
            // waht is swap dat
            swapData,

        )

        // Wait until the curve pool assets have been received
        // record the number of curve pool assets received curveAssetAmount

        // Approve the YTC contract to spend the curveAssetAmount curve assets

        // Wait until the ytc contract has been approved

        // Call ytc with the passed through values

        // Send the baseTokens back to the user
    }

}