import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getFixedRate } from "api/element/fixedRate";
import { elementAddressesAtom } from "recoil/element/atom";
import {
  TrancheRatesInterface,
  trancheSelector,
} from "recoil/trancheRates/atom";
import {
  useTokenName,
  useVariableAPY,
} from "components/Pages/YTC/Calculator/hooks";
import { yieldTokenAccruedValue } from "api/ytc/helpers";
import { Tranche } from "types/manual/types";
import { getRemainingTrancheYears, getTrancheByAddress } from "api/element";

export const useFetchTrancheRates = (
  trancheAddress: string,
  tokenAddress: string
) => {
  const [trancheRates, setTrancheRates] = useRecoilState(
    trancheSelector(trancheAddress)
  );
  const getVariableRate = useVariableAPY(tokenAddress);
  const elementAddresses = useRecoilValue(elementAddressesAtom);

  const tokenName = useTokenName(tokenAddress);

  const { library } = useWeb3React();
  const provider = library as Web3Provider;

  const handleChangeTrancheRate = useCallback(
    (rateChange: Partial<TrancheRatesInterface>) => {
      setTrancheRates((currentValue) => {
        return {
          ...currentValue,
          ...rateChange,
        };
      });
    },
    [setTrancheRates]
  );

  useEffect(() => {
    getVariableRate().then((variable) => {
      if (variable) {
        handleChangeTrancheRate({
          variable,
        });
      }
    });
  }, [getVariableRate, handleChangeTrancheRate]);

  useEffect(() => {
    if (tokenName) {
      getFixedRate(tokenName, trancheAddress, elementAddresses, provider)
        .then((fixedRate) => {
          handleChangeTrancheRate({
            fixed: fixedRate,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [
    tokenName,
    trancheAddress,
    elementAddresses,
    provider,
    handleChangeTrancheRate,
  ]);

  useEffect(() => {
    if (provider) {
      yieldTokenAccruedValue(elementAddresses, trancheAddress, provider)
        .then((accruedValue) => {
          handleChangeTrancheRate({
            accruedValue: accruedValue,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [provider, elementAddresses, trancheAddress, handleChangeTrancheRate]);

  useEffect(() => {
    if (tokenName) {
      const trancheDict: { [key: string]: Tranche[] } =
        elementAddresses.tranches;
      const tranches: Tranche[] = trancheDict[tokenName];
      const tranche: Tranche | undefined = getTrancheByAddress(
        trancheAddress,
        tranches
      );
      if (tranche) {
        handleChangeTrancheRate({
          daysRemaining: getRemainingTrancheYears(tranche.expiration) * 365,
        });
      }
    }
  }, [tokenName, elementAddresses, handleChangeTrancheRate, trancheAddress]);

  return trancheRates;
};
