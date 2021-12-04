import { Flex, FormLabel } from "@chakra-ui/react";
import { executeYieldTokenCompounding } from "../../../../features/ytc/executeYieldTokenCompounding";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useEffect, useRef, useState } from "react";
import { slippageToleranceAtom } from "../../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';
import { selectedCalculatorGainSelector, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import Card from "../../../Reusable/Card";
import { TokenResult } from "./TokenResult";
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import { ApproveAndConfirmButton } from "../Calculator/ApproveAndSimulateButton";
import { ERC20__factory } from "../../../../hardhat/typechain";
import { getBalance } from "../../../../features/element";
import { ExecutionDetails } from "./ExecutionDetails";
import { ExposureBar } from "./ExposureBar";

export interface ExecutionProps {
}

export const Execution: React.FC<ExecutionProps> = () => {

    const selectedResult = useRecoilValue(selectedCalculatorGainSelector);
    console.log(selectedResult);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const { library, account } = useWeb3React();
    const provider = library as Web3Provider;
    const setNotification = useRecoilState(notificationAtom)[1];


    const slippageTolerance = useRecoilValue(slippageToleranceAtom);
    const executorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(executorRef.current){
            executorRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [executorRef])

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

    return (
        selectedResult && <Flex
            ref={executorRef}
            id="execution"
            py={5}
            flexDir="column"
            gridGap={3}
        >
            <ExecutionCard />
            <ApproveAndConfirmButton
                handleExecuteTransaction={handleExecuteTransaction}
                isLoading={isLoading}
                id="approve-calculate-button"
                rounded="full"
                bgColor="main.primary"
                _hover={{
                    bgColor:"main.primary_hover"
                }}
                mt="4"
                p="2"
                textColor="text.secondary"
            />
        </Flex>
    )
}

interface ExecutionCardProps { }


const ExecutionCard: React.FC<ExecutionCardProps> = () => {

    const slippageTolerance = useRecoilValue(slippageToleranceAtom);

    const selectedResult = useRecoilValue(selectedCalculatorGainSelector);

    if(!selectedResult){
        return <></>
    }
    const minimumReceived = selectedResult.receivedTokens.yt.amount * (1-(slippageTolerance/100))

    return selectedResult ? <Card>
        <Flex
            id="outputs"
            flexDir='column'
            alignItems='stretch'
            gridGap={3}
            p={2}
        >
            <FormLabel
                flexDir="row"
                justify="center"
                alignItems="center"
                alignSelf="center"
            >
                <Flex
                    flexDir="row"
                    alignItems="center"
                    gridGap={2}
                >
                    Review Your Transaction
                </Flex>
            </FormLabel>
            <Flex
                flexDir="column"
                w="full"
            >
                <FormLabel>
                    Input
                </FormLabel>
                <TokenResult
                    tokenType="BaseToken"
                    trancheAddress={selectedResult.inputs.trancheAddress}
                    token={{
                        name: selectedResult.spentTokens.baseTokens.name,
                        amount: selectedResult.spentTokens.baseTokens.amount
                    }}
                />
            </Flex>
            <Flex
                flexDir="column"
                w="full"
            >
                <FormLabel>
                    Output
                </FormLabel>
                <Flex
                    flexDir="column"
                    gridGap={1}
                >
                    <TokenResult
                        tokenType="BaseToken"
                        trancheAddress={selectedResult.inputs.trancheAddress}
                        token={{
                            name: selectedResult.receivedTokens.baseTokens.name,
                            amount: selectedResult.receivedTokens.baseTokens.amount
                        }}
                    />
                    <TokenResult
                        tokenType="YToken"
                        trancheAddress={selectedResult.inputs.trancheAddress}
                        token={{
                            name: selectedResult.receivedTokens.yt.name,
                            amount: selectedResult.receivedTokens.yt.amount,
                        }}
                        baseTokenName={selectedResult.receivedTokens.baseTokens.name}
                    />
                </Flex>
            </Flex>
            <Flex mx={{base:2, sm: 16}}>
                <ExposureBar
                    // equivalent to baseTokensSpent
                    tokensSpent={selectedResult.spentTokens.baseTokens.amount - selectedResult.receivedTokens.baseTokens.amount}
                    trancheAddress={selectedResult.inputs.trancheAddress}
                    minimumYTokensReceived={minimumReceived}
                    baseTokenName={selectedResult.receivedTokens.baseTokens.name}
                />
            </Flex>
            <ExecutionDetails 
                slippageTolerance={slippageTolerance}
                estimatedGas={selectedResult.gas.eth}
                netGain= {selectedResult.gain?.netGain}
                roi={selectedResult.gain?.roi}
                apr={selectedResult.gain?.apr}
                minimumReceived={minimumReceived}
                expectedReturn={selectedResult.gain?.estimatedRedemption}
                baseTokenName={selectedResult.spentTokens.baseTokens.name}
                trancheAddress={selectedResult.inputs.trancheAddress}
            />
        </Flex>
    </Card> : <></>
}