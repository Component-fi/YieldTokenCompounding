import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getBalance } from "api/element";
import { ERC20__factory } from "hardhat/typechain";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const useBalance = (tokenAddress: string | undefined) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const { account, library } = useWeb3React();
  const provider = library as Web3Provider;

  useEffect(() => {
    if (account && tokenAddress) {
      const tokenContract = ERC20__factory.connect(tokenAddress, provider);
      setBalance(undefined);
      getBalance(account, tokenContract).then((res) => {
        setBalance(res);
      });
    }
  }, [tokenAddress, account, setBalance, provider]);

  return balance;
};
