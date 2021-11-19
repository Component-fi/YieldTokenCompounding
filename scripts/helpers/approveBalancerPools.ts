import YieldTokenCompounding from '../../frontend/src/artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json';
import {deployments, overrides} from '../../frontend/src/constants/apy-mainnet-constants';
import hre from 'hardhat';
import mainnetConstants from '../../constants/mainnet-constants.json';
import { ElementAddresses } from '../../frontend/src/types/manual/types';
import { YieldTokenCompounding as YieldTokenCompoundingType } from '../../frontend/src/hardhat/typechain/YieldTokenCompounding';
import { ContractReceipt } from 'ethers';

const YTC_ADDRESS = deployments.YieldTokenCompounding;
const constants: ElementAddresses = mainnetConstants;

export const approveBalancerPool = async (trancheAddress: string) => {
    const signer = (await hre.ethers.getSigners())[0];
    // impersonate a large holder of lusdcurve3
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [overrides.from],
      });

    const ytc = (new hre.ethers.Contract(YTC_ADDRESS, YieldTokenCompounding.abi, signer)) as YieldTokenCompoundingType;

    const tx = await ytc.approveTranchePTOnBalancer(trancheAddress);

    return tx.wait()
}

export const approveAllBalancerPools = async (): Promise<(ContractReceipt | undefined)[]> => {
  const promises = Object.values(
            constants.tranches
        ).flat().map((trancheAddress) => {
    return approveBalancerPool(trancheAddress.address);
  })

  return Promise.all(promises);
}
