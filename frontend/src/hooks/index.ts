import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getBalance } from "../features/element";
import { ERC20__factory } from "../hardhat/typechain";

// TOOD this can be moved to a utility
export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const useBalance = (tokenAddress: string | undefined, setBalance: React.Dispatch<React.SetStateAction<number | undefined>>) => {
    const {account, library} = useWeb3React();
    const provider = library as Web3Provider;

    return useCallback(
        () => {
            if (account && tokenAddress){
                const tokenContract = ERC20__factory.connect(tokenAddress, provider)
                setBalance(undefined);
                getBalance(account, tokenContract).then((res) => {
                    setBalance(res);
                })
            }
        },
        [tokenAddress, account, setBalance, provider]
    )

}
