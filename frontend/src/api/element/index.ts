import _ from "lodash";
import { ethers } from "ethers";
import { ElementAddresses, Token, Tranche } from "@/types/manual/types";
import { ERC20 } from "@/hardhat/typechain/ERC20";
import { isTrancheActive } from "@/api/ytc/helpers";
import { ONE_YEAR_IN_MILLISECONDS } from "@/constants/time";

// This is for element api calls to get information on tokens, tranches, pools, etc..
export const getTranches = async (
  tokenAddress: string,
  elementState: ElementAddresses
): Promise<Tranche[]> => {
  // get the name of the token
  const tokenName = _.findKey(
    elementState.tokens,
    (value) => value === tokenAddress
  );

  if (tokenName) {
    const tranches = elementState.tranches[tokenName];
    if (tranches) {
      return tranches;
    }
  }

  return [];
};

export const getActiveTranches = (
  tokenAddress: string,
  elementState: ElementAddresses
): Tranche[] => {
  const tokenName = _.findKey(
    elementState.tokens,
    (value) => value === tokenAddress
  );

  if (tokenName) {
    const tranches = elementState.tranches[tokenName];
    if (tranches) {
      return tranches
        .filter((tranche: Tranche) => {
          return isTrancheActive(tranche);
        })
        .sort((a, b) => a.expiration - b.expiration);
    }
  }

  return [];
};

export const getBaseTokens = (elementState: ElementAddresses): Token[] => {
  const tokens = elementState.tokens;

  return Object.entries(tokens).map(([key, value]: [string, string]) => {
    return {
      name: key,
      address: value,
    };
  });
};

export const getBaseTokensWithActiveTranches = (
  elementState: ElementAddresses
): Token[] => {
  const tokens = elementState.tokens;

  const results = Object.entries(tokens).map(
    ([key, value]: [string, string]) => {
      const tranches = getActiveTranches(value, elementState);

      return {
        name: key,
        address: value,
        tranches,
      };
    }
  );

  return results
    .filter(({ tranches }) => {
      return tranches.length > 0;
    })
    .map(({ name, address }) => {
      return {
        name,
        address,
      };
    });
};

// TODO This might be better organized in a different file as it's not element related
export const getBalance = async (
  currentAddress: string,
  contract: ERC20 | undefined
): Promise<number> => {
  if (contract) {
    const decimals = await contract.decimals();

    const balanceAbsolute = await contract.balanceOf(currentAddress);
    const balanceNormalized = ethers.utils.formatUnits(
      balanceAbsolute,
      decimals
    );

    return parseFloat(balanceNormalized);
  }
  return 0;
};

export const getTrancheByAddress = (
  address: string,
  tranches: Tranche[]
): Tranche | undefined => {
  return _.find(tranches, (tranche) => {
    return tranche.address === address;
  });
};

export const getRemainingTrancheYears = (trancheExpiration: number): number => {
  const ms = getRemainingTrancheTimeMs(trancheExpiration);

  return ms / ONE_YEAR_IN_MILLISECONDS;
};

export const getRemainingTrancheTimeMs = (
  trancheExpiration: number
): number => {
  const currentMs = new Date().getTime();
  const trancheMs = trancheExpiration * 1000;

  return trancheMs - currentMs;
};

