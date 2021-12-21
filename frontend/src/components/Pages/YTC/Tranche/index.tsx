import { TrancheRatesInterface } from "recoil/trancheRates/atom";
import { shortenNumber } from "utils/shortenNumber";
import { DetailItem } from "components/Reusable/DetailItem";
import { Spinner } from "components/Reusable/Spinner";
import { DetailPane } from "components/Reusable/DetailPane";
import { useFetchTrancheRates } from "./hooks";

interface TrancheDetailsProps {
  trancheAddress: string;
  tokenAddress: string;
}

// Fixed rate, variable rate, and number of days remaining, should be displayed
export const TrancheDetails: React.FC<TrancheDetailsProps> = (props) => {
  const { trancheAddress, tokenAddress } = props;

  const trancheRate = useFetchTrancheRates(trancheAddress, tokenAddress);

  return <TrancheDisplay {...trancheRate} />;
};

const TrancheDisplay: React.FC<TrancheRatesInterface> = (props) => {
  const { variable, fixed, daysRemaining, accruedValue } = props;

  console.log(variable);

  return (
    <DetailPane>
      <DetailItem
        name="Fixed Rate:"
        value={
          fixed !== undefined ? (
            `${shortenNumber(fixed)}%`
          ) : (
            <>
              <Spinner />%
            </>
          )
        }
      />
      <DetailItem
        name="Variable Rate:"
        value={
          variable !== undefined ? (
            `${shortenNumber(variable)}%`
          ) : (
            <>
              <Spinner />%
            </>
          )
        }
      />
      <DetailItem
        name="Days Remaining:"
        value={
          daysRemaining !== undefined ? (
            shortenNumber(daysRemaining)
          ) : (
            <>
              <Spinner />
            </>
          )
        }
      />
      <DetailItem
        name="Yield Accrued to Date:"
        value={
          accruedValue !== undefined ? (
            `${shortenNumber(accruedValue * 100)}%`
          ) : (
            <>
              <Spinner />
            </>
          )
        }
      />
    </DetailPane>
  );
};
