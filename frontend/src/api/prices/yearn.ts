import _ from "lodash";
import axios from "axios";
import { ITranche__factory, IWrappedPosition__factory } from "@/hardhat/typechain";
import { ethers, Signer } from "ethers";

const YEARN_API_ENDPOINT = "https://api.yearn.finance/v1/chains/1/vaults/all";

export const getVariableAPY = async (
  trancheAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
) => {
  const yearnVaultAddress = await getYearnVaultAddress(trancheAddress, signerOrProvider);

  if (!yearnVaultAddress) {
    throw new Error("Could not find yearn vault address");
  }

  const yearnVaultData = await (await axios.get(YEARN_API_ENDPOINT)).data;

  const yearnVaultDetails = _.find(
    yearnVaultData,
    (vault) => vault.address === yearnVaultAddress
  );

  // The curve pools for some reason don't have a weekly average available, so instead we rely on their computed net_apr
  try {
    const netApy = yearnVaultDetails.apy.net_apy;
    return netApy * 100;
  } catch {
    const variableApy = yearnVaultDetails.apy.points.week_ago;
    return variableApy * 100;
  }
};

const getYearnVaultAddress = async (trancheAddress: string, signerOrProvider: Signer | ethers.providers.Provider): Promise<string> => {
  const tranche = ITranche__factory.connect(trancheAddress, signerOrProvider);

  const wrappedPosition = await tranche.position();
  
  const wrappedPositionContract = IWrappedPosition__factory.connect(wrappedPosition, signerOrProvider);

  return wrappedPositionContract.vault();
}
