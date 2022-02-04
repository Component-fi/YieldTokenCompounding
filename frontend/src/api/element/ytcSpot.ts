import { ethers, Signer } from "ethers";
import _ from "lodash";
import { ElementAddresses, Tranche } from "types/manual/types";
import { calcSpotPriceYt } from "utils/element/calcSpotPrice";
import { getReserves } from "utils/element/getReserves";

export const getYTCSpotPrice = async (
  trancheAddress: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  // remove the use of tokenName

  const flat = _.flatten(Object.values(elementAddresses.tranches))

  const tranche = _.find(
    flat,
    (tranche: Tranche) => tranche.address.toLowerCase() === trancheAddress.toLowerCase()
  );

  const balancerAddress = elementAddresses.balancerVault;

  if (!tranche) {
    throw new Error("Cannot find tranche pool");
  }

  const ytPool = tranche.ytPool;

  const reserves = await getReserves(
    ytPool.address,
    balancerAddress,
    signerOrProvider
  );

  // The getReserves function does not return the base/yt reserves in a particular order
  // It does return the token address in tokens in the same index as it's balance in "balance"
  let baseTokenReserve;
  let yTReserve;
  if (Object.values(elementAddresses.tokens).includes(reserves.tokens[0])) {
    [baseTokenReserve, yTReserve] = reserves.balances;
  } else {
    [yTReserve, baseTokenReserve] = reserves.balances;
  }

  const ytcSpot = calcSpotPriceYt(
    baseTokenReserve.toString(),
    yTReserve.toString()
  );

  return ytcSpot;
};
