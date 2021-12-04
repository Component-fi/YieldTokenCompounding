import React, { useEffect, useState } from "react"
import { getBaseTokensWithActiveTranches } from "../../../features/element";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { Token } from "../../../types/manual/types";
import { Calculator } from "./Calculator";
import { Execution } from "./Executor";
import { useRecoilState, useRecoilValue } from 'recoil';
import { calculatorGainSelector, selectedSimulationAtom } from '../../../recoil/simulationResults/atom';
import { YTCOutput } from "../../../features/ytc/ytcHelpers";
import { Title } from "../../Title";
import ResultsTable from "./Table";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react'
import { ApproveAndConfirmButton } from "./Calculator/ApproveAndSimulateButton";
import { tabIndexAtom } from "../../../recoil/tabIndex/atom";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [baseTokens, setBaseTokens] = useState<Token[]>([]);
    const resultIndex = useRecoilValue(selectedSimulationAtom);
    const [tabIndex, setTabIndex] = useRecoilState(tabIndexAtom);
    const simulationResults: YTCOutput[] = useRecoilValue(calculatorGainSelector);
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        getBaseTokensWithActiveTranches(elementAddresses).then((res) => {
            setBaseTokens(res);
        })
    }, [elementAddresses])

    return <div>
        <Title
            title="Yield Token Compounding"
            infoLinkText="How do I use this tool?"
            infoLink="https://medium.com/@component_general/how-to-yield-token-compound-using-the-ytc-tool-742d140a7c9c"
        />
        <Tabs variant='enclosed' isFitted mt={4} index={tabIndex} onChange={setTabIndex}>
            <TabList>
                <Tab>Simulate</Tab>
                <Tab>Execute</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Calculator
                        tokens={baseTokens}
                    />
                    {
                        (simulationResults.length > 0) && <>
                            <Flex width="full">
                                {/** Arrow Icon */}
                                <Icon stroke="text.primary" viewBox="0 0 24 24" h={7} w={10} mx="auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                </Icon>
                            </Flex>

                            <ResultsTable />
                            {
                                (resultIndex !== undefined) && (
                                    <Flex flexDirection="column" align="stretch">
                                        <Flex width="full">
                                            {/** Arrow Icon */}
                                            <Icon stroke="text.primary" viewBox="0 0 24 24" h={7} w={10} mx="auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                            </Icon>
                                        </Flex>
                                        <Execution/>
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
                                            onClick={() => setTabIndex(1)}
                                        >
                                            Go to Execute
                                        </Button>
                                    </Flex>
                                )
                            }
                        </>
                    }
                </TabPanel>
                <TabPanel>
                    <>
                        <Calculator 
                            tokens={baseTokens}
                        />
                        {
                            (resultIndex !== undefined) && (
                                <Flex flexDirection="column" align="stretch">
                                    <Flex width="full">
                                        {/** Arrow Icon */}
                                        <Icon stroke="text.primary" viewBox="0 0 24 24" h={7} w={10} mx="auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                        </Icon>
                                    </Flex>
                                    <Execution/>
                                    <ApproveAndConfirmButton
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
                    </>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
}
