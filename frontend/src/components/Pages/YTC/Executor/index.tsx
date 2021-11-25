import { Button, Spinner, Flex, FormLabel, Icon, Text, Tooltip, Collapse } from "@chakra-ui/react";
import { YTCGain, YTCInput } from "../../../../features/ytc/ytcHelpers";
import { executeYieldTokenCompounding } from "../../../../features/ytc/executeYieldTokenCompounding";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useContext, useEffect, useRef, useState } from "react";
import { SignerContext } from "../../../../hardhat/SymfoniContext";
import { slippageToleranceAtom } from "../../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';
import { simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import Card from "../../../Reusable/Card";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from '../../../Reusable/DetailItem';
import { TokenResult } from "./TokenResult";
import { DetailPane } from "../../../Reusable/DetailPane";
import WalletSettings from "../../../Wallet/Settings";
import { BaseTokenPriceTag, YTPriceTag } from "../../../Prices";
import { InfoTooltip } from "../../../Reusable/Tooltip";
import copy from '../../../../constants/copy.json';
import { trancheSelector } from "../../../../recoil/trancheRates/atom";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { InfoOutlineIcon } from '@chakra-ui/icons';

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
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext);
    const slippageTolerance = useRecoilValue(slippageToleranceAtom);
    const setNotification = useRecoilState(notificationAtom)[1];

    const minimumReturn = yieldTokenAmount * (1-(slippageTolerance/100))

    const executorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(executorRef.current){
            executorRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [executorRef])

    // Execute the actual calculation transaction
    const handleExecuteTransaction = () => {
        if (signer){
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
                setNotification(
                    {
                        text: "YTC Execution Succesful",
                        type: "SUCCESS",
                        linkText: "View on Explorer",
                        link: `https://etherscan.io/tx/${receipt.transactionHash}`
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
            <Button
                id="approve-calculate-button"
                rounded="full"
                bgColor="main.primary"
                _hover={{
                    bgColor:"main.primary_hover"
                }}
                mt="4"
                p="2"
                textColor="text.secondary"
                onClick={handleExecuteTransaction}
            >
                {isLoading ? <Spinner/> : "CONFIRM TRANSACTION"}
            </Button>
        </Flex>
    )
}


interface ExecutionDetailsProps {
    slippageTolerance: number;
    minimumReceived: number;
    expectedReturn?: number;
    estimatedGas: number;
    netGain?: number;
    roi?: number;
    apr?: number;
    baseTokenName: string;
    trancheAddress: string;
}

const ExecutionDetails: React.FC<ExecutionDetailsProps> = (props) => {
    const {
        slippageTolerance,
        minimumReceived,
        estimatedGas,
        netGain,
        roi,
        apr,
        expectedReturn,
        baseTokenName,
        trancheAddress,
    } = props;

    const trancheRate = useRecoilValue(trancheSelector(trancheAddress));
    const [show, setShow] = useState<boolean>(false);

    const handleToggle = () => setShow(!show);

    return <DetailPane
        mx={{base: 0, sm: 8}}
    >
        <DetailItem
            name={
                <Flex flexDir="row" alignItems="center" gridGap={1}>
                    <Text>
                        Slippage Tolerance 
                    </Text>
                    <WalletSettings icon={<SmallGearIcon/>}/>
                </Flex>
                    }
            value={`${slippageTolerance}%`}
        />
        <DetailItem
            name={
                <Flex flexDir="row" alignItems="center" gridGap={1}>
                    <Text>
                        Estimated Gain
                    </Text>
                    <InfoTooltip
                        label={copy.tooltips.estimated_gain_detail}
                    />
                </Flex>
            }
            value={netGain ? 
                <Flex
                    flexDir="row"
                    gridGap={1}
                    color={(netGain > 0 ? "green.600" : "red.500")}
                >
                    <Text>
                        {shortenNumber(netGain)}
                    </Text>
                    (<BaseTokenPriceTag
                        amount={netGain}
                        baseTokenName={baseTokenName}
                    />)
                </Flex> : "?"
            }
        />
        <DetailItem
            name={
                <Flex flexDir="row" alignItems="center" gridGap={1}>
                    <Text>
                        Return on Investment
                    </Text>
                    <InfoTooltip
                        label={copy.tooltips.roi}
                    />
                </Flex>
            }
            value={roi ? 
                <Text
                    color={(roi > 0 ? "green.600" : "red.500")}
                >
                    {shortenNumber(roi)}%
                </Text> : "?"
            }
        />
        <DetailItem
            name={
                <Flex flexDir="row" alignItems="center" gridGap={1}>
                    <Text>
                        APR
                    </Text>
                    <InfoTooltip
                        label={copy.tooltips.apr}
                    />
                </Flex>
            }
            value={apr ? 
                <Text
                    color={(apr > 0 ? "green.600" : "red.500")}
                >
                    {shortenNumber(apr)}%
                </Text> : "?"
            }
        />
        <Button variant="link" onClick={handleToggle} gridGap={2}>
            {show ? <ChevronDownIcon/> : <ChevronRightIcon/>}
            {show ? "Hide" : "Show More"}
        </Button>
        <Collapse in={show}>
            <DetailItem
                name={
                    <Flex flexDir="row" alignItems="center" gridGap={1}>
                        <Text>
                            Minimum YT Received
                        </Text>
                        <InfoTooltip
                            label={copy.tooltips.minimum_yt_received}
                        />
                    </Flex>
                }
                value={
                    <Flex flexDir="row" gridGap={1}>
                        <Text>
                            {shortenNumber(minimumReceived)}
                        </Text>
                        (<YTPriceTag
                            amount={expectedReturn}
                            baseTokenName={baseTokenName}
                            trancheAddress={trancheAddress}
                        />)
                    </Flex>
                }
            />
            <DetailItem
                name={
                    <Flex flexDir="row" alignItems="center" gridGap={1}>
                        <Text>
                            Estimated Redemption
                        </Text>
                        <InfoTooltip
                            label={copy.tooltips.estimated_redemption}
                        />
                    </Flex>
                }
                value={expectedReturn ? 
                    <Flex flexDir="row" gridGap={1}>
                        <Text>
                            {shortenNumber(expectedReturn)}
                        </Text>
                        (<BaseTokenPriceTag
                            amount={expectedReturn}
                            baseTokenName={baseTokenName}
                        />)
                    </Flex> : <Text>?</Text>
                }
            />
            <DetailItem
                name={
                    <Flex flexDir="row" alignItems="center" gridGap={1}>
                        <Text>
                            Minimum Redemption
                        </Text>
                        <InfoTooltip
                            label={copy.tooltips.minimum_redemption}
                        />
                    </Flex>
                }
                value={trancheRate.accruedValue ? 
                    <Flex flexDir="row" gridGap={1}>
                        <Text>
                            {shortenNumber(minimumReceived * trancheRate.accruedValue)}
                        </Text>
                        (<BaseTokenPriceTag
                            amount={minimumReceived * trancheRate.accruedValue}
                            baseTokenName={baseTokenName}
                        />)
                    </Flex> : <Text>?</Text>
                }
            />
            <DetailItem
                name="Estimated Gas Cost:"
                value={
                    <Flex flexDir="row" gridGap={1}>
                        <Text>
                            {shortenNumber(estimatedGas)} ETH
                        </Text>
                        (<BaseTokenPriceTag
                            amount={estimatedGas}
                            baseTokenName={"eth"}
                        />)
                    </Flex>
                }
            />
        </Collapse>
    </DetailPane>
}

const SmallGearIcon = () => {
    return <Flex justifyContent="center" alignItems="center" tabIndex={0} rounded="full" cursor="pointer">
        {/** This is a gear icon */}
        <Icon viewBox="0 0 20 20" color="text.primary" h={3} w={3} stroke="text.primary" fill="text.primary">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </Icon>
    </Flex>
}

interface ExposureBarProps {
    tokensSpent: number;
    trancheAddress: string;
    baseTokenName: string;
    minimumYTokensReceived: number;
}

const ExposureBar: React.FC<ExposureBarProps> = (props) => {
    const {minimumYTokensReceived, trancheAddress, tokensSpent} = props;

    const trancheRate = useRecoilValue(trancheSelector(trancheAddress));

    let minimumRedemptionBaseTokens;
    let variableExposureTokens;
    let minimumRedemptionPercentage;
    let variableExposurePercentage;

    if (trancheRate.accruedValue){
        minimumRedemptionBaseTokens = minimumYTokensReceived * trancheRate.accruedValue;
        variableExposureTokens = tokensSpent - minimumRedemptionBaseTokens;
        minimumRedemptionPercentage = minimumRedemptionBaseTokens/tokensSpent * 100;
        variableExposurePercentage = variableExposureTokens/tokensSpent * 100;
    }
    
    if (minimumRedemptionBaseTokens && variableExposureTokens && minimumRedemptionPercentage && minimumRedemptionBaseTokens){
        return <Flex flexDir="column" w="full">
            <Flex flexDir="row" justify="space-between">
                <Text fontSize="xs">Minimum Redemption</Text>
                <Text fontSize="xs">Variable Rate Exposure</Text>
            </Flex>
            <Flex flexDir="row" w='full' h={8} align="center">
                <Text fontSize={"xs"} mr={0.5}>
                    {shortenNumber(minimumRedemptionBaseTokens)}
                </Text>
                <Tooltip label="The minimum that will be received when redeeming your yield tokens. The variable interest rate over the term will have no effect on this capital.">
                    <Flex bgColor="green.400" w={`${minimumRedemptionPercentage}%`} justify="center" align="center" h="70%"
                        _hover={{
                            borderColor: "green.200",
                            borderWidth: 2
                        }}
                        flexDir="row"
                        justifyContent="start"
                        alignItems="start"
                        p={1}
                    >
                        <InfoOutlineIcon
                            color="grey.400"
                            w={2.5}
                            h={2.5}
                        />
                    </Flex>
                </Tooltip>
                <Flex bgColor="black" h="full" w="0.5">
                </Flex>
                <Tooltip label="The amount of exposure you have to the variable interst rate. The higher the variable rate, the larger that this will be at redemption">
                    <Flex bgColor="component.orange" w={`${variableExposurePercentage}%`} justify="center" align="center" h="70%"
                        _hover={{
                            borderColor: "yellow.400",
                            borderWidth: 2
                        }}
                        flexDir="row"
                        justifyContent="start"
                        alignItems="start"
                        p={1}
                    >
                        <InfoOutlineIcon
                            color="grey.400"
                            w={2.5}
                            h={2.5}
                        />
                    </Flex>
                </Tooltip>
                <Text fontSize={"xs"} ml={0.5}>
                    {shortenNumber(variableExposureTokens)}
                    {/* <BaseTokenPriceTag
                        amount={variableExposureTokens}
                        baseTokenName={baseTokenName}
                    /> */}
                </Text>
            </Flex>
        </Flex>
    } else {
        return <></>
    }
}