import React, { useMemo, useState } from 'react'
import Card from 'components/Reusable/Card';
import {Flex, Text} from '@chakra-ui/react';
import { DetailPane } from 'components/Reusable/DetailPane';
import { DetailItem } from 'components/Reusable/DetailItem';
import { gql, useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { ONE_DAY_IN_SECONDS, ONE_YEAR_IN_SECONDS } from 'constants/time';
import { shortenNumber } from 'utils/shortenNumber';
import { Select } from '@chakra-ui/react';
import { calcFixedAPR } from 'utils/element/calcFixedAPR';
import { useFetchTrancheRates } from "../YTC/Tranche/hooks";
import { TextAndTooltip } from '../YTC/Executor/ExecutionDetails';

const GET_USERS = gql`
    query GetUserIds{
        users{
            id
        }
    }
`

const USER_QUERY = gql`
    query GetUser($userId: String!) {
        user(id: $userId) {
            Transactions{
                amountCollateralDeposited,
                yieldTokensReceived,
                baseTokensSpent,
                gasLimit,
                gasPrice,
                timestamp{
                    id
                },
                accruedValue{
                    trancheSupply
                    wrappedSupply
                    ytSupply
                },
                term{
                    wrappedDecimals,
                    trancheDecimals,
                    baseToken{
                        id,
                        name,
                        symbol,
                        decimals
                    },
                    expiration,
                    address,
                    yToken{
                        symbol
                    }
                }
            }
        }
    }
`

interface Data {
    user: {
        Transactions: Transaction[];
    }
}
interface Vars {
    userId: string;
}

interface Transaction {
    amountCollateralDeposited: string;
    yieldTokensReceived: string;
    baseTokensSpent: string;
    gasLimit: string;
    gasPrice: string;
    timestamp: {
        id: string;
    };
    accruedValue: AccruedValue
    term: {
        address: string;
        trancheDecimals: number;
        wrappedDecimals: number;
        baseToken: {
            id: string;
            decimals: number;
            name: string;
            symbol: string;
        };
        yToken: {
            symbol: string;
        }
        expiration: string;
    };
}

interface AccruedValue {
    trancheSupply: string;
    wrappedSupply: string;
    ytSupply: string;
}


interface UsersData {
    users: {
        id: string
    }[]
}


export const Users: React.FC<{}> = () => {
    const { loading, error, data } = useQuery<UsersData>(GET_USERS);

    const [selection, setSelection] = useState<string>()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    if (data) {
        return <>
            <Select
                onChange={
                    (e: React.ChangeEvent<HTMLSelectElement>) => setSelection(e.target.value)
                }
                defaultValue={selection}
            >
                {data.users.map((user) => {
                    return <option value={user.id}>{user.id}</option>
                })}
            </Select>
            {selection && <Positions userId={selection}/>}
        </>
    }

    return <></>
}

const Positions: React.FC<{userId: string}> = (props) => {
    const { loading, error, data } = useQuery<Data, Vars>(
        USER_QUERY,
        { 
            variables: {
                userId: props.userId
            }
        }
    );

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    if (data) return <Flex flexDir="column" gridGap={5} p={10}>
        { 
            data.user.Transactions.map((transaction: Transaction) => {
                return <Position transaction={transaction}/>
            })
        }
    </Flex>

    return <></>
}

const Position: React.FC<{transaction: Transaction}> = (props) => {

    const {transaction} = props;

    const trancheRate = useFetchTrancheRates(transaction.term.address, transaction.term.baseToken.id);

    const positionSize = useMemo(() => parseFloat(ethers.utils.formatUnits(transaction.yieldTokensReceived, transaction.term.trancheDecimals)), [transaction.yieldTokensReceived, transaction.term.trancheDecimals]);;
    const daysRemaining = useMemo(() => (parseInt(transaction.term.expiration) - (new Date()).getTime()/1000)/ONE_DAY_IN_SECONDS, [transaction.term.expiration]);
    const secondsRemainingFromEntry = useMemo(() => (parseInt(transaction.term.expiration) - parseInt(transaction.timestamp.id)), [transaction.term.expiration, transaction.timestamp.id]);
    const entryDate = useMemo(() => (new Date(parseInt(transaction.timestamp.id)*1000)).toDateString(), [transaction.timestamp.id]);
    const costBasis = useMemo(() => (parseFloat(ethers.utils.formatUnits(transaction.baseTokensSpent, transaction.term.baseToken.decimals))), [transaction.baseTokensSpent, transaction.term.baseToken.decimals]);

    // TODO this is currently the "first accrued value" not the final Accrued value
    const baseTokenSymbol = transaction.term.baseToken.symbol;
    const entryAccruedValue = transaction.accruedValue;

    const currentAccruedValue = trancheRate.accruedValue;

    const currentBackingValue = useMemo(
        () => currentAccruedValue ? currentAccruedValue * positionSize : undefined,
        [
            currentAccruedValue,
            positionSize
        ]
    )

    const [entryPerTokenBacking, entryBacking] = useMemo(() => getBackingValue(
        entryAccruedValue,
        positionSize,
        transaction.term.wrappedDecimals,
        transaction.term.trancheDecimals),
        [entryAccruedValue,positionSize,
        transaction.term.wrappedDecimals,
        transaction.term.trancheDecimals
    ]);
    const spotPrice = useMemo(() => (1 - costBasis/positionSize + entryPerTokenBacking), [costBasis, positionSize, entryPerTokenBacking]);
    const impliedRate = useMemo(() => calcFixedAPR(spotPrice, secondsRemainingFromEntry), [spotPrice, secondsRemainingFromEntry]);

    const yearsSinceEntry =  useMemo(() => (
        (new Date()).getTime()/1000 - parseInt(transaction.timestamp.id)) / ONE_YEAR_IN_SECONDS,
        [transaction.timestamp.id]
    );

    const daysSinceEntry = useMemo(() => (
        yearsSinceEntry * ONE_YEAR_IN_SECONDS / ONE_DAY_IN_SECONDS
    ), [yearsSinceEntry])

    const averageRate = useMemo(
        () => currentAccruedValue ? ((currentAccruedValue - entryPerTokenBacking) / yearsSinceEntry) * 100 : undefined,
        [
            currentAccruedValue,
            entryPerTokenBacking,
            yearsSinceEntry
        ]
    );

    // const averageTermRate = useMemo(
    //     () => currentAccruedValue ? ((currentAccruedValue) / yearsSinceEntry) * 100 : undefined,
    //     [
    //         currentAccruedValue,
    //         entryPerTokenBacking,
    //         yearsSinceEntry
    //     ]
    // )

    const estimatedVariableReturn = trancheRate.variable && trancheRate.variable/100 * (parseInt(transaction.term.expiration) - (new Date()).getTime()/1000)/ONE_YEAR_IN_SECONDS;
    const estimatedTotalReturnPerToken = estimatedVariableReturn && currentAccruedValue && estimatedVariableReturn + currentAccruedValue;
    const estimatedTotalReturn = estimatedTotalReturnPerToken && estimatedTotalReturnPerToken * positionSize;
    const estimatedPNL = estimatedTotalReturn && estimatedTotalReturn - costBasis;

    const averageVariableReturn = averageRate && averageRate/100 * (parseInt(transaction.term.expiration) - (new Date()).getTime()/1000)/ONE_YEAR_IN_SECONDS;
    const averageTotalReturnPerToken = averageVariableReturn && currentAccruedValue && averageVariableReturn + currentAccruedValue;
    const averageTotalReturn = averageTotalReturnPerToken && averageTotalReturnPerToken * positionSize;
    const averagePNL = averageTotalReturn && averageTotalReturn - costBasis;

    return <Card>
        <Text>{transaction.term.baseToken.name} Position</Text>
        <DetailPane>
            <DetailItem name={
                <TextAndTooltip
                    text="Position size"
                    tooltip="Number of yield tokens received"
                />
            }
            value={`${shortenNumber(positionSize)} ${transaction.term.yToken.symbol}`}/>
            <DetailItem name="Days elapsed" value={shortenNumber(daysSinceEntry)}/>
            <DetailItem name="Days Remaining" value={shortenNumber(daysRemaining)}/>
            <DetailItem name="Current Fixed Rate" value={`${trancheRate.fixed && shortenNumber(trancheRate.fixed)}%`}/>
            <DetailItem name="Current Variable Rate" value={`${trancheRate.variable && shortenNumber(trancheRate.variable)}%`}/>
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Estimated PNL: Variable"
                        tooltip="Profit and loss if the current variable rate continues through the rest of the term"
                    />
                }
                value={
                    <Text color={estimatedPNL && estimatedPNL > 0 ? "green.600": "red.600"}>
                        {`${estimatedPNL && shortenNumber(estimatedPNL) } ${baseTokenSymbol}`}
                    </Text>
                }
            />
            <DetailItem 
                name={
                    <TextAndTooltip
                        text="Estimated PNL: Average"
                        tooltip="Profit and loss if the average variable rate since entry continues over the course of the term"
                    />
                }
                value={
                <Text color={averagePNL && averagePNL > 0 ? "green.600": "red.600"}>
                    {`${averagePNL && shortenNumber(averagePNL) } ${baseTokenSymbol}`}
                </Text>
            }/>
        </DetailPane>
        <Text>Entry</Text>
        <DetailPane>
            <DetailItem name="Date" value={entryDate}/>
            <DetailItem name="Cost basis" value={`${shortenNumber(costBasis)} ${baseTokenSymbol}`}/>
            <DetailItem name="Per Token Cost basis" value={`${shortenNumber(costBasis/positionSize)} ${baseTokenSymbol}`}/>
            <DetailItem
                name={
                    <TextAndTooltip 
                        text="Accrued value at entry" 
                        tooltip="The tokens already accrued through interest for the position before entry."
                    />
                }
                value={`${shortenNumber(entryBacking)} ${baseTokenSymbol}`}/>
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Implied Rate"
                        tooltip="The effective fixed rate at position entry. This may be different than the fixed rate that was stated, as YTCing can have significant price impact"
                    />
                }
                value={`${shortenNumber(impliedRate)}%`}
            />
        </DetailPane>
        <Text>Position Value</Text>
        <DetailPane>
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Total Accrued Value"
                        tooltip='The total tokens accrued through interest for this position'
                    />
                }
                value={`${currentBackingValue && shortenNumber(currentBackingValue)} ${baseTokenSymbol}`}/>
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Position Accrued Value"
                        tooltip='The tokens accrued through interest for this position after entry'
                    />
                }
                value={`${currentBackingValue && shortenNumber(currentBackingValue - entryBacking)} ${baseTokenSymbol}`}
            />
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Daily Position Accrued Value"
                        tooltip='The tokens per day accrued through interest for this position after entry'
                    />
                }
                value={`${currentBackingValue && shortenNumber((currentBackingValue - entryBacking)/daysSinceEntry)} ${baseTokenSymbol}`}
            />
            <DetailItem
                name={
                    <TextAndTooltip
                        text="Average Position Rate"
                        tooltip='The average variable rate since position entry'
                    />
                }
                value={`${averageRate && shortenNumber(averageRate)}%`}
            />
            {/* <DetailItem
                name={
                    <TextAndTooltip
                        text="Average Term Rate: "
                        tooltip='The average variable rate since the inception of the term'
                    />
                }
                value={`${averageRate && shortenNumber(averageRate)}%`}
            /> */}
        </DetailPane>
    </Card>
}

export default Positions

const getBackingValue = (accruedValue: AccruedValue, positionSize: number, wrappedDecimals: number, trancheDecimals: number): [number, number] => {
    const wrappedSupplyNormalized = ethers.utils.formatUnits(accruedValue.wrappedSupply, wrappedDecimals);
    const trancheSupplyNormalized = ethers.utils.formatUnits(accruedValue.trancheSupply, trancheDecimals);
    const ytSupplyNormalized = ethers.utils.formatUnits(accruedValue.ytSupply, trancheDecimals);

    const perYTokenBacking = (parseFloat(wrappedSupplyNormalized) - parseFloat(trancheSupplyNormalized)) / parseFloat(ytSupplyNormalized);
    const backingValue = perYTokenBacking * positionSize;
    return [perYTokenBacking, backingValue];
}