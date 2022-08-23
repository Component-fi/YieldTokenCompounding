// calculate the fixed rate of the pToken

import { ethers, Signer } from "ethers";
import { ElementAddresses, Tranche } from "@/types/manual/types";
import { getReserves } from "@/utils/element/getReserves";
import { calcSpotPricePt } from "@/utils/element/calcSpotPrice";
import { calcFixedAPR } from "@/utils/element/calcFixedAPR";
import _ from "lodash";
import { ONE_YEAR_IN_SECONDS } from "@/constants/time";

// calculate the fixed rate of the pTokens for a tranche

export const getFixedRate = async (
  tokenName: string,
  trancheAddress: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  const tranche = _.find(
    elementAddresses.tranches[tokenName],
    (tranche: Tranche) => tranche.address === trancheAddress
  );
  const balancerAddress = elementAddresses.balancerVault;

  const tokenAddress = elementAddresses.tokens[tokenName];

  if (!tranche) {
    throw new Error("Cannot find tranche pool");
  }

  const ptPool = tranche.ptPool;

  const reserves = await getReserves(
    ptPool.address,
    balancerAddress,
    signerOrProvider
  );

  const tParamSeconds = getTParamSeconds(ptPool.timeStretch);

  const timeRemainingSeconds = getTimeRemainingSeconds(tranche.expiration);

  // The getReserves function does not return the base/pt reserves in a particular order
  let baseTokenReserve;
  let pTReserve;
  if (reserves.tokens[0] === tokenAddress) {
    [baseTokenReserve, pTReserve] = reserves.balances;
  } else {
    [pTReserve, baseTokenReserve] = reserves.balances;
  }

  const spot = calcSpotPricePt(
    baseTokenReserve.toString(),
    pTReserve.toString(),
    reserves.totalSupply.toString(),
    timeRemainingSeconds,
    tParamSeconds,
    reserves.decimals[0]
  );

  return calcFixedAPR(spot, timeRemainingSeconds);
};

export const getTParamSeconds = (timeStretch: number): number => {
  return timeStretch * ONE_YEAR_IN_SECONDS;
}

export const getTimeRemainingSeconds = (expiration: number): number => {
  return expiration - new Date().getTime() / 1000
}