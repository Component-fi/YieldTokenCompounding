import React, { useEffect, useState } from 'react'
import { elementAddressesAtom } from '../../recoil/element/atom';
import {useRecoilValue} from 'recoil';
import { getTokenPrice } from '../../features/prices';
import { shortenNumber } from '../../utils/shortenNumber';
import { getYTCSpotPrice } from '../../features/element/ytcSpot';
import { Text } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

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
    const {baseTokenName, trancheAddress, amount} = props;

    const [price, setPrice] = useState<number>(0);
    const { library } = useWeb3React();
    const provider = library as Web3Provider;
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        const signer = provider?.getSigner();
        if (baseTokenName && trancheAddress && signer){
            getYTCSpotPrice(baseTokenName, trancheAddress, elementAddresses, signer).then((price) => {
                setPrice(price);
            })
        }
    }, [provider, baseTokenName, trancheAddress, elementAddresses])


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
    const {amount, baseTokenName} = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [price, setPrice] = useState<number>(0);
    const { library } = useWeb3React();
    const provider = library as Web3Provider;
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        const signer = provider?.getSigner();
        if(baseTokenName && signer){
            setIsLoading(true);
            getTokenPrice(baseTokenName, elementAddresses, signer).then((value) => {
                setPrice(value);
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [baseTokenName, elementAddresses, provider])


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