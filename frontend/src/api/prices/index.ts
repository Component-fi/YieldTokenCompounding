import { ethers, Signer } from "ethers"
import { ElementAddresses } from "types/manual/types";
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceOfCurveLP, isCurveToken } from "./curve"

export const getTokenPrice = async (baseTokenName: string, elementAddresses: ElementAddresses, signerOrProvider: Signer | ethers.providers.Provider | undefined): Promise<number> => {
    const baseTokenNameLowercase = baseTokenName.toLowerCase();

    if (isCoingeckoToken(baseTokenNameLowercase)){
        return getRelativePriceFromCoingecko(baseTokenNameLowercase, "usd")
    } else {
        if (isCurveToken(baseTokenNameLowercase) && signerOrProvider){
            return getPriceOfCurveLP(baseTokenNameLowercase, elementAddresses, signerOrProvider)
        }
    }
    throw new Error(`Could not get token price for ${baseTokenNameLowercase}`);
}