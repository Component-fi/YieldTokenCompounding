import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Button, ButtonProps, Spinner } from '@chakra-ui/react'
import { checkApproval, sendApproval } from './approvalAPI';
import { BigNumber, ContractReceipt, utils, providers } from 'ethers';
import { notificationAtom } from '../../recoil/notifications/atom';
import { useRecoilState } from 'recoil';
import { deployments } from '../../constants/apy-mainnet-constants';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { Web3Provider } from '@ethersproject/providers';
import { ERC20__factory } from '../../hardhat/typechain/factories/ERC20__factory';
import { YieldTokenCompounding__factory } from '../../hardhat/typechain/factories/YieldTokenCompounding__factory';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

type AbstractApprovalProps = {
    approveText: string,
    approvalMessage: string,
    children: ReactElement,
    isLoading: boolean,
    setIsLoading: (bool: boolean) => void,
    isApproved: boolean,
    provider: providers.Provider | undefined,
    handleCheckApproval: () => Promise<void>,
    handleApprove: () => Promise<ContractReceipt>
} & ButtonProps;

// An approval button that checks whether or not a wallet is connected, then checks whether a specific token has been approved
// If the token has not been approved, the button will trigger an approval transaction
// At the moment it is hardcoded for maxint approval
const AbstractApproval: React.FC<AbstractApprovalProps> = (props) => {
    const {approveText, approvalMessage, children, handleCheckApproval, handleApprove, provider, isLoading, isApproved, setIsLoading, ...rest} = props;

    const { activate } = useWeb3React();


    useEffect(() => {
        if (provider) {
            handleCheckApproval();
        }
    }, [provider, handleCheckApproval])

    const setNotification = useRecoilState(notificationAtom)[1];

    const abstractHandleApprove = () => {
        handleApprove().then((receipt) => {
            setNotification((currentNotifications) => {
                return [
                    ...currentNotifications,
                    {
                        text: approvalMessage,
                        type: "SUCCESS",
                        linkText: "View on Explorer",
                        link: `https://etherscan.io/tx/${receipt.transactionHash}`
                    }
                ]
            })
        }).catch((error) => {
            setNotification((currentNotifications) => {
                return [
                    ...currentNotifications,
                    {
                        type: "ERROR",
                        text: "Token Approval Failed",
                        details: error
                    }
                ]
            })
        }).finally(() => {
            setIsLoading(false);
        })
    }

    if (!provider){
        return <Button
            {...rest}
            onClick={() => activate(injected)}
        >
            CONNECT YOUR WALLET
        </Button>
    }
    if (isLoading){
        return <Button
            {...rest}
            disabled
        >
            <Spinner/>
        </Button>
    }
    if (isApproved){
        return children;
    }
    return <Button
        {...rest}
        onClick = {abstractHandleApprove}
    >
        {approveText}
    </Button>
}

type ERC20ApprovalProps = {
    amount?: number | string,
    approvalAddress?: string,
    tokenAddress?: string,
    tokenName?: string,
    insufficientBalance?: boolean,
    children: ReactElement,
} & ButtonProps;


// An implementation of the approval button specifically for erc20 tokens
export const ERC20Approval: React.FC<ERC20ApprovalProps> = (props) => {
    const { library, account } = useWeb3React();
    const provider = (library as Web3Provider);
    const {amount, approvalAddress, tokenAddress, tokenName, children, insufficientBalance, ...rest} = props;

    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleCheckApproval = useCallback(
        async () => {
            const signer = provider?.getSigner(account || undefined);
            if (tokenAddress && approvalAddress && signer && account){
                const tokenContract = ERC20__factory.connect(tokenAddress, signer);
                if (tokenContract){
                    let absoluteAmount;
                    if (amount){
                        const decimals = await tokenContract.decimals();
                        absoluteAmount = utils.parseUnits(amount.toString(), decimals).toString();
                    } else {
                        absoluteAmount = MAX_UINT_HEX;
                    }
                    checkApproval(absoluteAmount, approvalAddress, account, tokenContract).then((result) => {
                        if (result) {
                            setIsApproved(true)
                         } else {
                            setIsApproved(false);
                         }
                    }).catch((error: Error) => {
                        console.error(error);
                    })
                }
            }
        },
        [account, amount, approvalAddress, provider, tokenAddress],
    )

    const handleApprove: () => Promise<ContractReceipt> = useCallback(
        async () => {
            const signer = provider?.getSigner(account || undefined);
            if (approvalAddress && tokenAddress && signer && account) {
                setIsLoading(true);

                // send the approval request
                const tokenContract = ERC20__factory.connect(tokenAddress, signer);
                if (tokenContract){
                    let absoluteAmount;
                    if (amount){
                        const decimals = await tokenContract.decimals();
                        absoluteAmount = utils.parseUnits(amount.toString(), decimals)
                    } else {
                        absoluteAmount = MAX_UINT_HEX;
                    }
                    const receipt = await sendApproval(absoluteAmount.toString(), approvalAddress, tokenContract)
                    handleCheckApproval();
                    return receipt;
                } 
            }
            throw new Error('Could not connect to token contract')
        },
        [amount, tokenAddress, approvalAddress, handleCheckApproval, provider, account]
    )

    return <AbstractApproval
        isLoading={isLoading}
        approvalMessage={`${tokenName?.toUpperCase()} approved`}
        isApproved={isApproved}
        setIsLoading={setIsLoading}
        handleApprove={handleApprove}
        handleCheckApproval={handleCheckApproval}
        disabled={insufficientBalance}
        approveText={
            !insufficientBalance ?
                (amount) ? `Approve ${amount} ${tokenName?.toUpperCase()}` : `Approve ${tokenName?.toUpperCase()}` :
                "Insufficient Balance"
        }
        provider = {provider}
        {...rest}
    >
        {children}
    </AbstractApproval>


}


interface BalancerApprovalProps {
    trancheAddress: string | undefined;
    children: ReactElement;
}

// An implementation of the approval button specifically for approving a balancer pool to use funds from the YTC contract
export const BalancerApproval: React.FC<BalancerApprovalProps> = (props) => {
    const { library } = useWeb3React();
    const provider = (library as Web3Provider);
    const signer = provider?.getSigner();
    const ytc = YieldTokenCompounding__factory.connect(deployments.YieldTokenCompounding, signer);

    const { trancheAddress, children, ...rest} = props;


    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckApproval = useCallback(
        async () => {
            if(trancheAddress && ytc){
                const allowance = await ytc.checkTranchePTAllowanceOnBalancer(trancheAddress)
                if (allowance?.eq(BigNumber.from(MAX_UINT_HEX))){
                    setIsApproved(true);
                }
                else {
                    setIsApproved(false);
                }
            }
        },
        [trancheAddress, ytc],
    )

    const handleApprove: () => Promise<ContractReceipt> = useCallback(
        async () => {
            if (trancheAddress && ytc){
                setIsLoading(true);
                const tx = await ytc.approveTranchePTOnBalancer(trancheAddress);
                if (tx){
                    const receipt = await tx.wait();
                    handleCheckApproval()
                    return receipt;
                }
            }
            throw new Error('Could not approve balancer pool');
        },
        [trancheAddress, handleCheckApproval, ytc],
    )

    if (!trancheAddress){
        return <Button
            {...rest}
            disabled
        >
            Select a Tranche
        </Button>
    }

    return <AbstractApproval
        isLoading={isLoading}
        isApproved={isApproved}
        setIsLoading={setIsLoading}
        handleApprove={handleApprove}
        handleCheckApproval={handleCheckApproval}
        approveText="Approve Balancer Pool"
        approvalMessage="Balancer Pool Approved"
        provider={provider}
        {...rest}
    >
        {children}
    </AbstractApproval>
}