import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Collapse, Flex, Icon, Text} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { trancheSelector } from "../../../../recoil/trancheRates/atom";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { BaseTokenPriceTag, YTPriceTag } from "../../../Prices";
import { DetailItem } from "../../../Reusable/DetailItem";
import { DetailPane } from "../../../Reusable/DetailPane";
import { InfoTooltip } from "../../../Reusable/Tooltip";
import WalletSettings from "../../../Wallet/Settings";
import copy from '../../../../constants/copy.json';

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

export const ExecutionDetails: React.FC<ExecutionDetailsProps> = (props) => {
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
                <TextAndTooltip
                    text="Estimated Gain"
                    tooltip={copy.tooltips.estimated_gain_detail}
                />
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
                <TextAndTooltip
                    text="Return on Investment"
                    tooltip={copy.tooltips.roi}
                />
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
                <TextAndTooltip
                    text="APR"
                    tooltip={copy.tooltips.apr}
                />
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
                    <TextAndTooltip
                        text="Minimum YT Received"
                        tooltip={copy.tooltips.minimum_yt_received}
                    />
                }
                value={
                    <Flex flexDir="row" gridGap={1}>
                        <Text>
                            {shortenNumber(minimumReceived)}
                        </Text>
                        (<YTPriceTag
                            amount={minimumReceived}
                            baseTokenName={baseTokenName}
                            trancheAddress={trancheAddress}
                        />)
                    </Flex>
                }
            />
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Estimated Redemption"
                        tooltip={copy.tooltips.estimated_redemption}
                    />
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
                    <TextAndTooltip
                        text="Minimum Redemption"
                        tooltip={copy.tooltips.minimum_redemption}
                    />
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
                name="Estimated Gas"
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

interface TextAndTooltipProps {
    text: string;
    tooltip: string;
}

const TextAndTooltip: React.FC<TextAndTooltipProps> = (props) => {
    const {text, tooltip} = props;

    return <Flex flexDir="row" alignItems="center" gridGap={1}>
        <Text>
            {text}
        </Text>
        { tooltip && <InfoTooltip
            w={2}
            h={2}
            label={tooltip}
        /> }
    </Flex>
}


const SmallGearIcon = () => {
    return <Flex justifyContent="center" alignItems="center" tabIndex={0} rounded="full" cursor="pointer">
        {/** This is a gear icon */}
        <Icon viewBox="0 0 20 20" color="text.primary" h={3} w={3} stroke="text.primary" fill="text.primary">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </Icon>
    </Flex>
}