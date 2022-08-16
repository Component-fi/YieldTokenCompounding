import { Signer, utils, ethers } from "ethers";
import { validCurveTokens } from "@/constants/apy-mainnet-constants";
import { getRelativePriceFromCoingecko } from "./coingecko";
import { ElementAddresses } from "@/types/manual/types";
import { ERC20__factory, ICurveFi__factory, IERC20Minter__factory } from "@/hardhat/typechain";

export type CurveTokenName = typeof validCurveTokens[number];
export const isCurveToken = (x: any): x is CurveTokenName => {
  return validCurveTokens.includes(x);
};

export const getPriceOfCurveLP = async (
  tokenName: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
) => {
  const tokenAddress = elementAddresses.tokens[tokenName];

  if (!tokenAddress) {
    throw new Error("Could not find token address of " + tokenName);
  }

  const swapAddress = await getCurveSwapAddress(tokenAddress, signerOrProvider);

  if (!swapAddress) {
    throw new Error("Could not find swap address for curve token " + tokenName);
  }

  const virtualPrice: number = await getCurveVirtualPrice(
    swapAddress,
    signerOrProvider
  );
  // get the price of the underlying assets
  const basePrice: number = await getBasePrice(
    tokenName,
    swapAddress,
    signerOrProvider
  );

  // get the price of
  return basePrice * virtualPrice;
};

const getBasePrice = async (
  tokenName: string,
  swapAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  let basePrice: number;
  let ethPrice;
  switch (tokenName) {
    case "crv3crypto":
      basePrice = await getTriCryptoPrice(swapAddress, signerOrProvider);
      break;
    case "crvtricrypto":
      basePrice = await getTriCryptoPrice(swapAddress, signerOrProvider);
      break;
    case "stecrv":
      ethPrice = await getRelativePriceFromCoingecko("eth", "usd");
      basePrice = ethPrice;
      break;
    case "lusd3crv-f":
      basePrice = 1;
      break;
    case "alusd3crv-f":
      basePrice = 1;
      break;
    case "mim-3lp3crv-f":
      basePrice = 1;
      break;
    case "eurscrv":
      basePrice = 1 / (await getRelativePriceFromCoingecko("usdc", "eur"));
      break;
    default:
      throw new Error("Could not find curve token price");
  }
  return basePrice;
};

const getCurveVirtualPrice = async (
  tokenAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  // get the curve pool contract
  const curveContract = ICurveFi__factory.connect(
    tokenAddress,
    signerOrProvider
  );

  const virtualPriceAbsolute = await curveContract.get_virtual_price();

  // virtual price precision for curve contracts is 18 decimal places
  const virtualPriceNormalized = parseFloat(
    utils.formatUnits(virtualPriceAbsolute, 18)
  );

  // get the virtual price
  return virtualPriceNormalized;
};

const getTriCryptoPrice = async (
  tokenAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {

  const curveContract = ICurveFi__factory.connect(
    tokenAddress,
    signerOrProvider
  );

  const lpTokenAddress = await curveContract.token();

  const usdtBalanceAbsolute = await curveContract.balances(0);

  const erc20Contract = ERC20__factory.connect(
    lpTokenAddress,
    signerOrProvider
  );

  const totalSupplyAbsolute = await erc20Contract.totalSupply();

  // USDT makes up a third of the pool thus we can multiply the number of tokens by 3
  // USDT decimals is 6
  const approximateTotalValue =
    parseFloat(ethers.utils.formatUnits(usdtBalanceAbsolute, 6)) * 3;

  // Total supply decimals is 18
  const totalSupplyNormalized = parseFloat(
    ethers.utils.formatUnits(totalSupplyAbsolute, 18)
  );

  const price = approximateTotalValue / totalSupplyNormalized;

  return price;
};

// Some curve lp contracts are both the erc20 and the swap pool contract, some have this functionality separated
// When there are two contracts the ERC20 token will have a minter variable that contains the address of the swap contract
export const getCurveSwapAddress = async (
  tokenAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<string> => {
  const erc20Contract = IERC20Minter__factory.connect(
    tokenAddress,
    signerOrProvider
  );

  try {
    const minter = await erc20Contract.minter();
    // if the minter function call is successful return the associated swap address
    return minter;
  } catch (error) {
    // otherwise the token and swap addresses are the same, thus the token address is returned
    return tokenAddress;
  }
};
