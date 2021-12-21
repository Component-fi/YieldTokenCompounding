import { ethers, Signer } from "ethers";
import {ITranche__factory} from "hardhat/typechain/factories/ITranche__factory";
import { ERC20__factory } from "hardhat/typechain";

export const getPrincipalTotal = async (
  trancheAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  const tranche = ITranche__factory.connect(trancheAddress, signerOrProvider);

  const trancheERC20 = ERC20__factory.connect(trancheAddress, signerOrProvider);

  const supply = await tranche.totalSupply();

  const decimals = await trancheERC20.decimals();

  // normalize the tranche balance and return
  return parseFloat(ethers.utils.formatUnits(supply, decimals));
};
