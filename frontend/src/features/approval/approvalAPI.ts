import { ERC20 } from "../../hardhat/typechain/ERC20";
import { ContractReceipt, ethers } from "ethers";
import { overrides } from "../../constants/apy-mainnet-constants";

export const sendApproval = async (amount: number | string, approvalAddress: string, tokenContract: ERC20): Promise<ContractReceipt> => {

    const transaction = await tokenContract.approve(approvalAddress, amount);

    return transaction.wait();
}


export const checkApproval = async (amount: number | string, approvalAddress: string, currentAccount: string, tokenContract: ERC20): Promise<boolean> => {
    const allowance = await tokenContract.allowance(overrides.from, approvalAddress)
    const bigNumAmount = ethers.BigNumber.from(amount);

    return allowance.gte(bigNumAmount);
}