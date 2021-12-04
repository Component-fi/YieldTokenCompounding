import { YTCInput } from '../frontend/src/features/ytc/ytcHelpers';
import { simulateYTCForCompoundRange } from '../frontend/src/features/ytc/simulateYTC';
import mainnetConstants from '../constants/mainnet-constants.json';
import goerliConstants from '../constants/goerli-constants.json';
import hre, { deployments, ethers } from 'hardhat';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../frontend/src/hardhat/typechain/ERC20';
import {YTCEth as YTCEthType} from '../frontend/src/hardhat/typechain/YTCEth';
import {YieldTokenCompounding as YieldTokenCompoundingType} from '../frontend/src/hardhat/typechain/YieldTokenCompounding'
import { BigNumber } from '@ethersproject/bignumber';
import { getAllTokens } from '../scripts/helpers/getTokens';
import { Deployment } from 'hardhat-deploy/dist/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect, should } from 'chai';
import { ElementAddresses } from '../frontend/src/types/manual/types';
import { approveAllTokens } from '../scripts/helpers/approveAlltokens';
import { approveAllBalancerPools } from '../scripts/helpers/approveBalancerPools';
import { deployments as dep } from '../frontend/src/constants/apy-mainnet-constants';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

let constants: ElementAddresses;

if (hre.network.name == "goerli"){
    constants = goerliConstants;
} else {
    constants = mainnetConstants;
}

let ytcDeployment: Deployment;
let ytcEthDeployment: Deployment;
let erc20Abi;
let signer: SignerWithAddress;

describe('ytcEth simulation', () => {
    before(async () => {
        // Check that the contract has been deployed
        await deployments.fixture(['YTCEth', 'YieldTokenCompound'])
        ytcEthDeployment = await hre.deployments.get('YTCEth');
        ytcDeployment = await hre.deployments.get('YieldTokenCompounding')
        signer = (await hre.ethers.getSigners())[0];
        console.log('beforeAll complete')
    })

    it('should work', async () => {
        const n = 1;
        const trancheAddress = "0x8a2228705ec979961F0e16df311dEbcf097A2766";
        const balancerPoolId = "0x10a2f8bd81ee2898d7ed18fb8f114034a549fa59000200000000000000000090";
        const expectedYTOutput = "0";
        const expectedBaseTokensSpent = "1000000000000000000000";
        const underlyingAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const yieldTokenAddress = "0xf1294e805b992320a3515682c6ab0fe6251067e5";
        const amountUnderlying = "4000000000";
        const deadline = 1669080020;

        const yieldTokenCompoundingcontract: YieldTokenCompoundingType = (new hre.ethers.Contract(ytcDeployment.address, ytcDeployment.abi, signer)) as YieldTokenCompoundingType;

        const tx2 = await yieldTokenCompoundingcontract.approveTranchePTOnBalancer(trancheAddress)

        await tx2.wait();

        const allowanceTx2 = await yieldTokenCompoundingcontract.checkTranchePTAllowanceOnBalancer(trancheAddress)
        
        expect(allowanceTx2).to.equal(BigNumber.from(MAX_UINT_HEX));

        const ytcEthContract: YTCEthType = (new hre.ethers.Contract(ytcEthDeployment.address, ytcEthDeployment.abi, signer)) as YTCEthType;

        const tx = await ytcEthContract.compound(n, trancheAddress, balancerPoolId, expectedYTOutput, expectedBaseTokensSpent, underlyingAddress, yieldTokenAddress, amountUnderlying, deadline, {value: "1000000000000000000"});
        const results = await tx.wait();

        const underlyingToken: ERC20Type  = (new hre.ethers.Contract(underlyingAddress, ERC20.abi, signer) as ERC20Type);
        const yieldToken: ERC20Type = (new hre.ethers.Contract(yieldTokenAddress, ERC20.abi, signer) as ERC20Type)

        console.log((await underlyingToken.balanceOf(signer.address)).toString());
        console.log((await yieldToken.balanceOf(signer.address)).toString());
    })

    // it('testing ytc contract with the other outputs', async () => {
    //     const amountUnderlying = "10000000000";
    //     const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    //     const trancheAddress = "0x8a2228705ec979961F0e16df311dEbcf097A2766";
    //     const balancerPoolId = "0x10a2f8bd81ee2898d7ed18fb8f114034a549fa59000200000000000000000090";
    //     const erc20Abi = ERC20.abi;

    //     // erc20 as our main user
    //     const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, signer) as ERC20Type);

    //     // Sending 1000 units of the token

    //     console.log('deployment address', ytcDeployment.address);

    //     // approve the amount required for the test
    //     const tx = await erc20Contract.approve(ytcDeployment.address, amountUnderlying)

    //     await tx.wait();

    //     const yieldTokenCompoundingcontract: YieldTokenCompoundingType = (new hre.ethers.Contract(ytcDeployment.address, ytcDeployment.abi, signer)) as YieldTokenCompoundingType;

    //     const tx2 = await yieldTokenCompoundingcontract.approveTranchePTOnBalancer(trancheAddress)

    //     await tx2.wait();

    //     const allowanceTx2 = await yieldTokenCompoundingcontract.checkTranchePTAllowanceOnBalancer(trancheAddress)
        
    //     expect(allowanceTx2).to.equal(BigNumber.from(MAX_UINT_HEX));

    //     // const userData: YTCInput = {
    //     //     baseTokenAddress: tokenAddress,
    //     //     trancheAddress: trancheAddress,
    //     //     amountCollateralDeposited: amountUnderlying,
    //     //     numberOfCompounds: 1,
    //     //     ytcContractAddress: ytcDeployment.address,
    //     // }


    //     const tx3 = await yieldTokenCompoundingcontract.compound(1, trancheAddress, balancerPoolId, "4360274317", 0, "10000000000000000");
    //     const result = await tx3.wait();
    //     console.log(result)
    // })
})