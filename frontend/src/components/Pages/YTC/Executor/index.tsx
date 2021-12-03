import { Flex, FormLabel, Icon, Text, Tooltip } from "@chakra-ui/react";
import { YTCGain, YTCInput } from "../../../../features/ytc/ytcHelpers";
import { executeYieldTokenCompounding } from "../../../../features/ytc/executeYieldTokenCompounding";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useEffect, useRef, useState } from "react";
import { slippageToleranceAtom } from "../../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';
import { simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import Card from "../../../Reusable/Card";
import { TokenResult } from "./TokenResult";
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import { ApproveAndConfirmButton } from "../Calculator/ApproveAndSimulateButton";
import { ERC20__factory } from "../../../../hardhat/typechain";
import { getBalance } from "../../../../features/element";
import { ExecutionDetails } from "./ExecutionDetails";
import { ExposureBar } from "./ExposureBar";

export interface ApeProps {
    baseToken: {
        name: string,
    };
    yieldToken: {
        name: string,
    };
    baseTokenAmount: number;
    yieldTokenAmount: number;
    userData: YTCInput;
    inputAmount: number;
    gas: {
        eth: number,
        baseToken: number,
    };
    gain?: YTCGain;
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {baseToken, yieldToken, baseTokenAmount, yieldTokenAmount, userData, gas, inputAmount, gain} = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const { library, account } = useWeb3React();
    const provider = library as Web3Provider;
    const slippageTolerance = useRecoilValue(slippageToleranceAtom);
    const setNotification = useRecoilState(notificationAtom)[1];

    const minimumReturn = yieldTokenAmount * (1-(slippageTolerance/100))

    const executorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(executorRef.current){
            executorRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [executorRef])

    // get the user balance of the token;
    useEffect(() => {
        if (account){
            const erc20 = ERC20__factory.connect(userData.baseTokenAddress, provider);

            setBalance(undefined);
            getBalance(account, erc20).then((res) => {
                setBalance(res);
            })
        }
    }, [userData, account, provider])

    // Execute the actual calculation transaction
    const handleExecuteTransaction = () => {
        const signer = provider.getSigner(account || undefined);
        if (!balance || balance < userData.amountCollateralDeposited){
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
                userData,
                yieldTokenAmount,
                // this is equivalent to base tokens spent
                (inputAmount-baseTokenAmount),
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
        <Flex
            ref={executorRef}
            id="ape"
            py={5}
            flexDir="column"
            gridGap={3}
        >
            <Card>
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
                            trancheAddress={userData.trancheAddress}
                            token={{
                                name: baseToken.name,
                                amount: inputAmount
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
                                trancheAddress={userData.trancheAddress}
                                token={{
                                    name: baseToken.name,
                                    amount: baseTokenAmount
                                }}
                            />
                            <TokenResult
                                tokenType="YToken"
                                trancheAddress={userData.trancheAddress}
                                token={{
                                    name: yieldToken.name,
                                    amount: yieldTokenAmount
                                }}
                                baseTokenName={baseToken.name}
                            />
                        </Flex>
                    </Flex>
                    <Flex mx={{base:2, sm: 16}}>
                        <ExposureBar
                            // equivalent to baseTokensSpent
                            tokensSpent={inputAmount - baseTokenAmount}
                            trancheAddress={userData.trancheAddress}
                            minimumYTokensReceived={minimumReturn}
                            baseTokenName={baseToken.name}
                        />
                    </Flex>
                    <ExecutionDetails 
                        slippageTolerance={slippageTolerance}
                        estimatedGas={gas.eth}
                        netGain= {gain?.netGain}
                        roi={gain?.roi}
                        apr={gain?.apr}
                        minimumReceived={minimumReturn}
                        expectedReturn={gain?.estimatedRedemption}
                        baseTokenName={baseToken.name}
                        trancheAddress={userData.trancheAddress}
                    />
                </Flex>
            </Card>
            <ApproveAndConfirmButton
                isLoading={isLoading}
                handleExecuteTransaction={handleExecuteTransaction}
                tokenAddress={userData.baseTokenAddress}
                tokenName={baseToken.name}
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
