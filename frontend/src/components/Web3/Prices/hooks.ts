import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { elementAddressesAtom } from "@/recoil/element/atom";
import { useRecoilValue } from "recoil";
import { getTokenPrice } from "@/api/prices";
import { getYTCSpotPrice } from "@/api/element/ytcSpot";

export const useBaseTokenPrice = (baseTokenName: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const { library } = useWeb3React();
  const provider = library as Web3Provider;
  const elementAddresses = useRecoilValue(elementAddressesAtom);

  useEffect(() => {
    const signer = provider?.getSigner();
    if (baseTokenName && signer) {
      setIsLoading(true);
      getTokenPrice(baseTokenName, elementAddresses, signer)
        .then((value) => {
          setPrice(value);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [baseTokenName, elementAddresses, provider]);

  return { price, isLoading };
};

export const useYieldTokenPrice = (
  baseTokenName: string | undefined,
  trancheAddress: string | undefined
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const { library } = useWeb3React();
  const provider = library as Web3Provider;
  const elementAddresses = useRecoilValue(elementAddressesAtom);

  useEffect(() => {
    if (baseTokenName && trancheAddress && provider) {
      setIsLoading(true);
      getYTCSpotPrice(baseTokenName, trancheAddress, elementAddresses, provider)
        .then((price) => {
          setPrice(price);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [provider, baseTokenName, trancheAddress, elementAddresses]);

  return { price, isLoading };
};
