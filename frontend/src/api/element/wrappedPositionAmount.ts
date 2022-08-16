// Find the total amount of tokens in the underlying wrapped position
import { ethers, Signer } from "ethers";
import { ERC20__factory, ITranche__factory, IWrappedPosition__factory } from "@/hardhat/typechain";

export const getUnderlyingTotal = async (
  trancheAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  // get the tranche
  const tranche = ITranche__factory.connect(trancheAddress,
    signerOrProvider
  );

  // get the wrapped position address
  const wrappedPositionAddress = await tranche.position();
  const wrappedPosition = IWrappedPosition__factory
  .connect(
    wrappedPositionAddress,
    signerOrProvider
  );
  const wrappedPositionERC20 = ERC20__factory.connect(
    wrappedPositionAddress,
    signerOrProvider
  );

  // get the balance of the tranche for the wrapped position
  const balance = await wrappedPosition.balanceOfUnderlying(trancheAddress);

  // get the decimals of the wrapped position
  const decimals = await wrappedPositionERC20.decimals();

  // normalize the tranche balance and return
  return parseFloat(ethers.utils.formatUnits(balance, decimals));
};
