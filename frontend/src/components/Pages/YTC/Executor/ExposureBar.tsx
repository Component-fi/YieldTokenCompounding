import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Flex, Tooltip, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { trancheSelector } from "../../../../recoil/trancheRates/atom";
import { shortenNumber } from "../../../../utils/shortenNumber";
import copy from '../../../../constants/copy.json';


interface ExposureBarProps {
    tokensSpent: number;
    trancheAddress: string;
    baseTokenName: string;
    minimumYTokensReceived: number;
}

export const ExposureBar: React.FC<ExposureBarProps> = (props) => {
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
                <Tooltip label={copy.tooltips.minimum_redemption}>
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
                <Tooltip label={copy.tooltips.variable_exposure}>
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
                </Text>
            </Flex>
        </Flex>
    } else {
        return <></>
    }
}