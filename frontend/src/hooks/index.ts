import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getBalance } from "@/api/element";
import { ERC20__factory } from "@/hardhat/typechain";
import { useAccount, useProvider } from "wagmi";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const useBalance = (tokenAddress: string | undefined) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const {isConnected, address} = useAccount()
  const provider = useProvider()

  useEffect(() => {
    if (isConnected && tokenAddress) {
      const tokenContract = ERC20__factory.connect(tokenAddress, provider);
      setBalance(undefined);
      getBalance(address as string, tokenContract).then((res) => {
        setBalance(res);
      });
    }
  }, [tokenAddress, address, setBalance, provider]);

  return balance;
};
