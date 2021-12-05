import { TrancheRatesInterface } from "../../../../recoil/trancheRates/atom";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from "../../../Reusable/DetailItem";
import { Spinner } from "../../../Reusable/Spinner";
import { DetailPane } from "../../../Reusable/DetailPane";
import { useFetchTrancheRates } from "./hooks";

interface TrancheDetailsProps {
    trancheAddress: string,
    tokenAddress: string,
}

// Fixed rate, variable rate, and number of days remaining, should be displayed
export const TrancheDetails: React.FC<TrancheDetailsProps> = (props) => {
    const {trancheAddress, tokenAddress} = props;

    const trancheRate = useFetchTrancheRates(trancheAddress, tokenAddress);

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