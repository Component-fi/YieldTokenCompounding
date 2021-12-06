import { useCallback, useEffect } from "react";
import { getRemainingTrancheYears, getTrancheByAddress } from "../../../../features/element";
import { getFixedRate } from "../../../../features/element/fixedRate";
import { getTokenNameByAddress, yieldTokenAccruedValue } from "../../../../features/ytc/ytcHelpers";
import { TrancheRatesInterface, trancheSelector } from "../../../../recoil/trancheRates/atom";
import { Tranche } from "../../../../types/manual/types";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from "../../../Reusable/DetailItem";
import { useRecoilValue, useRecoilState } from 'recoil';
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { Spinner } from "../../../Reusable/Spinner";
import { DetailPane } from "../../../Reusable/DetailPane";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';



interface TrancheDetailsProps {
    trancheAddress: string,
    tokenAddress: string,
}

// Fixed rate, variable rate, and number of days remaining, should be displayed
export const TrancheDetails: React.FC<TrancheDetailsProps> = (props) => {
    const {trancheAddress, tokenAddress} = props;

    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const { library } = useWeb3React();
    const provider = (library as Web3Provider);
    const [trancheRate, setTrancheRates] = useRecoilState(trancheSelector(trancheAddress));

    const handleChangeTrancheRate = useCallback((rateChange: Partial<TrancheRatesInterface>) => {
        setTrancheRates((currentValue) => {
            return {
                ...currentValue,
                ...rateChange,
            }
        })
    }, [setTrancheRates])


    return <TrancheDisplay
        {...trancheRate}
    />

}

const TrancheDisplay: React.FC<TrancheRatesInterface> = (props) => {

    const {variable, fixed, daysRemaining, accruedValue} = props;

    return <DetailPane>
        <DetailItem
            name= "Fixed Rate:"
            value={ 
                fixed ? 
                    `${shortenNumber(fixed)}%`: 
                    <>
                        <Spinner/>%
                    </>
            }
        />
        <DetailItem
            name= "Variable Rate:"
            value={
                variable ? 
                    `${shortenNumber(variable)}%`: 
                    <>
                        <Spinner/>%
                    </>
            }
        />
        <DetailItem
            name= "Days Remaining:"
            value={
                daysRemaining ? 
                    shortenNumber(daysRemaining) : 
                    <>
                        <Spinner/>
                    </>
            }
        />
        <DetailItem
            name= "Yield Accrued to Date:"
            value={
                accruedValue ? 
                    `${shortenNumber(accruedValue * 100)}%` : 
                    <>
                        <Spinner/>
                    </>
            }
        />
    </DetailPane>
}