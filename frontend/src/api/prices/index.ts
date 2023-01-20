import { ethers, Signer } from "ethers"
import { ElementAddresses } from "@/types/manual/types"
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceValueFromContract, isElementSpecificToken } from "./element"
import { getPriceOfCurveLP, isCurveToken } from "./curve"
import { ELEMENT_SPECIFIC_PRICE_ORACLES } from "@/constants/apy-mainnet-constants";

export const getTokenPrice = async (
  baseTokenName: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider | undefined
): Promise<number> => {
  const baseTokenNameLowercase = baseTokenName.toLowerCase()

  if (isCoingeckoToken(baseTokenNameLowercase)) {
    return getRelativePriceFromCoingecko(baseTokenNameLowercase, "usd")
  } else if (isCurveToken(baseTokenNameLowercase) && signerOrProvider) {
      return getPriceOfCurveLP(
        baseTokenNameLowercase,
        elementAddresses,
        signerOrProvider
      );
  } else if (isElementSpecificToken(baseTokenNameLowercase)) {
      return getPriceValueFromContract(ELEMENT_SPECIFIC_PRICE_ORACLES[baseTokenNameLowercase])
  }
  throw new Error(`Could not get token price for ${baseTokenNameLowercase}`)
};
