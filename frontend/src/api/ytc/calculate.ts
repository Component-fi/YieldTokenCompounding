import { BigNumber, ethers, Signer } from "ethers";
import { calcSwapOutGivenInCCPoolUnsafe } from "@/api/element/calcPoolSwap";
import { ElementAddresses } from "@/types/manual/types";
import { getReserves, ReservesResult } from "@/utils/element/getReserves";
import { getTimeRemainingSeconds, getTParamSeconds } from "@/api/element/fixedRate";
import { WAD } from "@/constants/static";
import { yieldTokenAccruedValue } from "@/api/ytc/helpers";
import _ from "lodash";

// in order to recurse the new value of n must reduce by 1, and the amount must be the number of base tokens received
// TODO add element fees on yield
export const calculateYtcReturn = async (
  n: number,
  amount: BigNumber,
  baseTokenAddress: string,
  trancheAddress: string,
  timeStretch: number,
  expiration: number,
  balancerPoolAddress: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<[BigNumber, BigNumber]> => {
  const discount = await yieldTokenAccruedValue(trancheAddress, signerOrProvider)
  const reserves = await getReserves(balancerPoolAddress, elementAddresses.balancerVault, signerOrProvider)

  const normalizeDecimals = (reserves: ReservesResult, index: number): string => {
    const decimal = reserves.decimals[index] as number;
    const decDiff = WAD - decimal;
    const reserve = reserves.balances[index].mul(BigNumber.from(10**decDiff))
    return reserve.toString();
  }

  const recursiveFunction = memoizedRecursive(reserves, discount, expiration, timeStretch);

  let xReserves: string = "0";
  let yReserves: string = "0";
  let xDecimals: number = WAD;
  let yDecimals: number = WAD;
  reserves.tokens.forEach((token, index) => {
    if(token.toLowerCase() === baseTokenAddress.toLowerCase()){
      yReserves = normalizeDecimals(reserves, index)
      yDecimals = reserves.decimals[index];
    } else {
      xReserves = normalizeDecimals(reserves, index)
      xDecimals = reserves.decimals[index]
    }
  })
  const amountAbs = +amount.toString() * 10 ** (WAD - yDecimals)

  console.log({res: +yReserves / 10**WAD});

  const [resultAmount, resultBaseTokensSpent] = await recursiveFunction(
    n,
    amountAbs,
    xReserves,
    yReserves
  );

  const resultAmountDec = resultAmount / 10**(WAD-yDecimals);
  const resultBaseTokensSpentDec = resultBaseTokensSpent / 10**(WAD-yDecimals)

  return [BigNumber.from(resultAmountDec.toFixed()), BigNumber.from(resultBaseTokensSpentDec.toFixed())]
}

const memoizedRecursive = _.memoize(
  (reserves: ReservesResult, discount: number, expiration: number, timeStretch: number): ((_n: number, _amount: number, _xReserves: string, _yReserves: string) => Promise<[number, number]>) & _.MemoizedFunction => {
    const recursiveFunction = _.memoize(async (
      _n: number,
      _amount: number,
      _xReserves: string,
      _yReserves: string,
    ): Promise<[number, number]> => {

      const pTokenAmountAbsolute = _amount * (1 - discount)

      const totalSupply = reserves.totalSupply

      const timeRemainingSeconds = getTimeRemainingSeconds(expiration)
      const tParamSeconds = getTParamSeconds(timeStretch)
      const baseTokensExpectedRaw = calcSwapOutGivenInCCPoolUnsafe(
        pTokenAmountAbsolute.toString(),
        _xReserves,
        _yReserves,
        totalSupply.toString(),
        timeRemainingSeconds,
        tParamSeconds,
        false
      )
      if (!baseTokensExpectedRaw){
        throw new Error('Not enough liquidity')
      }
      const baseTokensSpent =+_amount - +baseTokensExpectedRaw;


      if (_n===1){
        return [_amount, baseTokensSpent];
      } else {
        const newXReserves = (+_xReserves + _amount).toString();
        const newYReserves = (+_yReserves - +baseTokensExpectedRaw).toString();
        const newAmount = baseTokensExpectedRaw;
        const [resultAmount, resultBaseTokensSpent] = await recursiveFunction(
          _n-1,
          newAmount,
          newXReserves,
          newYReserves,
        );
        return [_amount + resultAmount, baseTokensSpent + +resultBaseTokensSpent];
      }
    })
    return recursiveFunction;
  }
)