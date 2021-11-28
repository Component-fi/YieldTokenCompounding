import React, { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { calculatorGainSelector } from '../../../../recoil/simulationResults/atom'
import { Table, Th, Thead, Flex, Tr, Tbody, FormLabel, Text, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';
import Card from '../../../Reusable/Card';
import { ResultsTableRow } from './ResultsTableRow';
import { InfoTooltip } from '../../../Reusable/Tooltip';
import { predictedRateAtom } from '../../../../recoil/predictedRate/atom';
import { trancheSelector } from '../../../../recoil/trancheRates/atom';
import copy from '../../../../constants/copy.json';

interface TableProps {
    onSelect: (index: number | undefined) => void;
    selected: number | undefined;
}

const ResultsTable: React.FC<TableProps> = (props) => {

    const {onSelect, selected} = props;

    const [predictedRate, setPredictedRate] = useRecoilState(predictedRateAtom);
    const simulationResults = useRecoilValue(calculatorGainSelector);

    const trancheAddress = simulationResults[0]?.inputs.trancheAddress;
    const trancheRate = useRecoilValue(trancheSelector(trancheAddress));

    const tableRef = useRef<HTMLTableElement>(null);

    const handlePredictedRateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPredictedRate(parseFloat(e.target.value));
    }

    // Set the predicted rate to equal the tranche variable rate on load
    useEffect(() => {
        if (trancheRate.variable){
            setPredictedRate(trancheRate.variable)
        }
    }, [setPredictedRate, trancheRate.variable])

    useEffect(() => {
        if (tableRef.current){
            tableRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [tableRef])

    useEffect(() => {
        return () => {
            onSelect(undefined)
        }
    }, [onSelect])

    return (
        <Flex
            id="results-table"
            py={5}
            flexDir="column"
            gridGap={5}
        >
            <Card>
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
                            Estimated Variable Rate
                            <InfoTooltip label={copy.tooltips.estimated_variable_rate} h={3} w={3}/>
                        </Flex>
                    </FormLabel>
                    <InputGroup
                        bgColor="input_bg"
                        rounded="2xl"
                    >
                        <Input
                            type="number"
                            value={predictedRate}
                            onChange={handlePredictedRateChange}
                        />
                        <InputRightAddon
                            bgColor="input_bg"
                        >
                            <Text
                                id="amount-token-label"
                                fontSize="2xl"
                                whiteSpace="nowrap"
                                color="text.primary"
                            >
                                %
                            </Text>
                        </InputRightAddon>
                    </InputGroup>
            </Card>
            <Card>
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
                        Number of Compounds
                        <InfoTooltip label={copy.tooltips.number_of_compounds} w={3} h={3}/>
                    </Flex>
                </FormLabel>
                <Table
                    ref={tableRef}
                    variant="simple"
                    size="sm"
                >
                    <Thead>
                        <Tr>
                            <Th isNumeric>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Yield Tokens
                                    </Text>
                                    <InfoTooltip label={copy.tooltips.yield_tokens}/>
                                </Flex>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Tokens Spent
                                    </Text>
                                    <InfoTooltip label={copy.tooltips.tokens_spent}/>
                                </Flex>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Estimated Gain
                                    </Text>
                                    <InfoTooltip label={copy.tooltips.estimated_gain}/>
                                </Flex>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {simulationResults.map((result: YTCOutput, index) => {
                            return <ResultsTableRow
                                        output={result}
                                        key={result.inputs.numberOfCompounds}
                                        isSelected={index === selected}
                                        onSelect={() => {onSelect(index)}}
                                        baseTokenName={simulationResults[0].receivedTokens.baseTokens.name}
                                    />
                        })}
                    </Tbody>
                </Table>
            </Card>
        </Flex>
    )
}


export default ResultsTable
