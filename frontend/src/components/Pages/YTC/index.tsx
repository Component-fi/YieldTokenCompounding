import React from "react"
import { Calculator } from "./Calculator";
import { Execution } from "./Executor";
import { useRecoilValue } from 'recoil';
import { calculatorGainSelector, selectedSimulationAtom } from 'recoil/simulationResults/atom';
import { YTCOutput } from "api/ytc/helpers";
import { Title } from "components/Layout/Title";
import ResultsTable from "./Table";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";
import { ApproveAndConfirmButton } from "./Calculator/ApproveAndSimulateButton";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const resultIndex = useRecoilValue(selectedSimulationAtom);
    const simulationResults: YTCOutput[] = useRecoilValue(calculatorGainSelector);

    return <div>
        <Title
            title="Yield Token Compounding"
            infoLinkText="How do I use this tool?"
            infoLink="https://medium.com/@component_general/how-to-yield-token-compound-using-the-ytc-tool-742d140a7c9c"
        />
                    <Calculator
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
                                    <ApproveAndConfirmButton
                                        id="approve-confirm-button"
                                    />
                                    </Flex>
                                )
                            }
                        </>
                }
    </div>
}
