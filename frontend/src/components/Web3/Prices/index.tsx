import React from 'react'
import { shortenNumber } from '../../../utils/shortenNumber';
import { Text } from '@chakra-ui/react';
import { useBaseTokenPrice, useYieldTokenPrice } from './hooks';

interface PriceFeedProps {
    price: number | undefined;
    amount: number | undefined;
}

const PriceTag: React.FC<PriceFeedProps> = (props) => {

    const { price, amount } = props;

    let absValue: number;
    let value: string;

    if (price && amount){
        absValue = price * amount;
        if (absValue >= 0){
            value = `$${shortenNumber(price * amount)}`;
        } else {
            value = `-$${shortenNumber(Math.abs(price * amount))}`;
        }

    } else {
        value = "$0"
    }

    return (
        <>
            {value}
        </>
    )
}

interface YTPriceTagProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
    trancheAddress: string | undefined;
}

export const YTPriceTag: React.FC<YTPriceTagProps> = (props) => {

    const {amount, baseTokenName, trancheAddress} = props;

    const {price} = useYieldTokenPrice(baseTokenName, trancheAddress);

    return (
        <BaseTokenPriceTag
            amount={amount ? price * amount : undefined}
            baseTokenName={baseTokenName}
        />
    )
}

interface BaseTokenPriceTagProps {
    amount: number | undefined;
    baseTokenName: string | undefined;
}

export const BaseTokenPriceTag: React.FC<BaseTokenPriceTagProps> = (props) => {
    const {amount, baseTokenName} = props
    const {price, isLoading} = useBaseTokenPrice(baseTokenName)


    return (
        isLoading ?
            <Text>
                $?
            </Text> :
            <PriceTag
                price={price}
                amount={amount}
            />
    )
}