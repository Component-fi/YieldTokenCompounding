import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { BalancerApproval, ERC20Approval } from "../../../../features/approval/Approval";
import { useRecoilState, useRecoilValue } from 'recoil';
import { isSimulatedSelector, isSimulatingAtom, selectedCalculatorGainSelector, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { deployments } from "../../../../constants/apy-mainnet-constants";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { slippageToleranceAtom } from "../../../../recoil/transactionSettings/atom";
import { ERC20__factory } from "../../../../hardhat/typechain";
import { getBalance } from "../../../../features/element";
import { executeYieldTokenCompounding } from "../../../../features/ytc/executeYieldTokenCompounding";

interface ApproveAndSimulateButtonProps {
    tokenAddress: string | undefined;
    tokenName: string | undefined;
    trancheAddress: string | undefined;
    formErrors: {[fieldName: string]: string | undefined};
    amount: number | undefined;
}


export const ApproveAndSimulateButton: React.FC<ApproveAndSimulateButtonProps & ButtonProps> = (props) => {

    const { tokenAddress, tokenName, trancheAddress, formErrors, amount, ...rest} = props;

    return <BalancerApproval
        trancheAddress={trancheAddress}
        {...rest}
    >
            <SimulateButton 
                formErrors={formErrors}
                {...rest}
            />
    </BalancerApproval>
}

interface ApproveAndConfirmButtonProps {
}

export const ApproveAndConfirmButton: React.FC<ApproveAndConfirmButtonProps & ButtonProps> = (props) => {
    const {...rest } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const { library, account } = useWeb3React();
    const provider = library as Web3Provider;
    const setNotification = useRecoilState(notificationAtom)[1];


    const slippageTolerance = useRecoilValue(slippageToleranceAtom);

    const selectedResult = useRecoilValue(selectedCalculatorGainSelector);

    const sufficientBalance = selectedResult && balance && (balance >= selectedResult.inputs.amountCollateralDeposited);

    // get the user balance of the token;
    useEffect(() => {
        if (account && selectedResult){
            const erc20 = ERC20__factory.connect(selectedResult.inputs.baseTokenAddress, provider);

            setBalance(undefined);
            getBalance(account, erc20).then((res) => {
                setBalance(res);
            })
        }
    }, [selectedResult, account, provider])

    if (!selectedResult){
        return <></>
    }

    // Execute the actual calculation transaction
    const handleExecuteTransaction = () => {
        const signer = provider.getSigner(account || undefined);
        if (!balance || balance < selectedResult?.inputs.amountCollateralDeposited){
            setNotification((currentNotifications) => {
                return [
                    ...currentNotifications,
                    {
                        text: "YTC Failed",
                        type: "ERROR",
                        details: "User does not have enough tokens"
                    }
                ]
            })
        } else if (signer) {
            setIsLoading(true);
            executeYieldTokenCompounding(
                selectedResult.inputs,
                selectedResult.receivedTokens.yt.amount,
                (selectedResult.spentTokens.baseTokens.amount),
                slippageTolerance,
                elementAddresses,
                signer
            ).then((receipt) => {
                setSimulationResults([]);
                setNotification((currentNotifications) => {
                    return [
                        ...currentNotifications,
                        {
                            text: "YTC Execution Succesful",
                            type: "SUCCESS",
                            linkText: "View on Explorer",
                            link: `https://etherscan.io/tx/${receipt.transactionHash}`
                        }
                    ]
                }
            );
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }


        return <ERC20Approval
            tokenAddress={selectedResult.inputs.baseTokenAddress}
            tokenName={selectedResult.spentTokens.baseTokens.name}
            approvalAddress={deployments.YieldTokenCompounding}
            amount={undefined}
            insufficientBalance={!sufficientBalance}
            {...rest}
        >
            <Button
                onClick={handleExecuteTransaction}
                disabled={!sufficientBalance}
                {...rest}
            >
                {isLoading ? 
                    <Spinner/> : 
                    (sufficientBalance ? 
                        "CONFIRM TRANSACTION" : "INSUFFICIENT BALANCE"
                    )}
            </Button>
        </ERC20Approval>
}

interface SimulateButtonProps {
    formErrors: {[fieldName: string]: string | undefined}
}

export const SimulateButton: React.FC<SimulateButtonProps & ButtonProps> = (props) => {
    const isSimulating = useRecoilValue(isSimulatingAtom)

    const isSimulated = useRecoilValue(isSimulatedSelector)

    const { formErrors, ...rest} = props;

    const areNoErrors =  Object.values(formErrors).every((error) => {
            return !error
        })

    return <Button
        id="approve-calculate-button"
        type="submit"
        {...rest}
        disabled={!areNoErrors}
    >
        {
            isSimulating ? 
                <Spinner/> : 
                isSimulated ? 
                    "RE-SIMULATE" :
                    "SIMULATE"
            
        }
    </Button>
}