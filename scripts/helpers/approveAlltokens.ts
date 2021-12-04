import {deployments, overrides} from '../../frontend/src/constants/apy-mainnet-constants';
import hre from 'hardhat';
import mainnetConstants from '../../constants/mainnet-constants.json';
import ERC20 from '../../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../../frontend/src/hardhat/typechain/ERC20';
import { ElementAddresses } from '../../frontend/src/types/manual/types';
import { ContractReceipt } from 'ethers';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const YTC_ADDRESS = deployments.YieldTokenCompounding;
const constants: ElementAddresses = mainnetConstants;

export const approveToken = async (tokenName: string) => {
    // impersonate a large holder of lusdcurve3
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [overrides.from],
      });

    // get the signer that we require for the token holder
    const largeHolderSigner = await hre.ethers.getSigner(overrides.from)

    const erc20Abi = ERC20.abi;

    const tokenAddress = constants.tokens[tokenName];

    console.log(tokenName, tokenAddress);

    const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, largeHolderSigner) as ERC20Type);

    const tx = await erc20Contract.approve(YTC_ADDRESS, MAX_UINT_HEX);

    return tx.wait()
}

export const approveAllTokens = async (): Promise<(ContractReceipt | undefined)[]> => {
    await hre.network.provider.send(
        "hardhat_setBalance",
        [
            overrides.from,
            "0x10000000000000000000000"
        ]
    )

  const promises = Object.keys(constants.tokens).map((token) => {
    return approveToken(token);
  })

  return Promise.all(promises);
}

