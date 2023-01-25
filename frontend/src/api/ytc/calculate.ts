import { BigNumber, ethers, Signer } from "ethers"
import { calcSwapOutGivenInCCPoolUnsafe } from "@/api/element/calcPoolSwap"
import { ElementAddresses } from "@/types/manual/types"
import { getReserves, ReservesResult } from "@/utils/element/getReserves"
import { getTimeRemainingSeconds, getTParamSeconds } from "@/api/element/fixedRate"
import { WAD } from "@/constants/static"
import { yieldTokenAccruedValue } from "@/api/ytc/helpers"
import _ from "lodash"
import Decimal from 'decimal.js'
// in order to recurse the new value of n must reduce by 1, and the amount must be the number of base tokens received
// TODO add element fees on yield
export const calculateYtcReturn = async (
  n: number,
  amount: Decimal,
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

  const normalizeDecimals = (reserves: ReservesResult, index: number): Decimal => {
    const decimal = reserves.decimals[index]
    const decDiff = WAD - decimal
    // reserve
    return new Decimal(reserves.balances[index].toString()).mul(10 ** decDiff) 
    
  }

  const recursiveFunction = memoizedRecursive(reserves, discount, expiration, timeStretch)

  let xReserves = new Decimal(0)
  let yReserves = new Decimal(0)
  let xDecimals: number = WAD
  let yDecimals: number = WAD

  reserves.tokens.forEach((token, index) => {
    if(token.toLowerCase() === baseTokenAddress.toLowerCase()){
      yReserves = normalizeDecimals(reserves, index)
      yDecimals = reserves.decimals[index]
    } else {
      xReserves = normalizeDecimals(reserves, index)
      xDecimals = reserves.decimals[index]
    }
  })

  const amountAbs = amount.mul(10 ** (WAD - yDecimals))

  const [resultAmount, resultBaseTokensSpent] = await recursiveFunction(
    n,
    amountAbs,
    xReserves,
    yReserves
  )

  const resultAmountDec = resultAmount.div(10 ** (WAD-yDecimals))
  const resultBaseTokensSpentDec = resultBaseTokensSpent.div(10**(WAD-yDecimals))

  return [BigNumber.from(resultAmountDec.round().toHex()), BigNumber.from(resultBaseTokensSpentDec.round().toHex())]
}

const memoizedRecursive = _.memoize(
  (reserves: ReservesResult, discount: number, expiration: number, timeStretch: number): ((_n: number, _amount: Decimal, _xReserves: Decimal, _yReserves: Decimal) => Promise<[Decimal, Decimal]>) & _.MemoizedFunction => {
    const recursiveFunction = _.memoize(async (
      _n: number,
      _amount: Decimal,
      _xReserves: Decimal,
      _yReserves: Decimal,
    ): Promise<[Decimal, Decimal]> => {

      const pTokenAmountAbsolute = _amount.mul(1 - discount)

      const totalSupply = new Decimal(reserves.totalSupply.toString())

      const timeRemainingSeconds = getTimeRemainingSeconds(expiration)
      const tParamSeconds = getTParamSeconds(timeStretch)
      const baseTokensExpectedRaw = calcSwapOutGivenInCCPoolUnsafe(
        pTokenAmountAbsolute,
        _xReserves,
        _yReserves,
        totalSupply,
        timeRemainingSeconds,
        tParamSeconds,
        false
      )
      if (!baseTokensExpectedRaw){
        throw new Error('Not enough liquidity')
      }
      const baseTokensSpent =_amount.sub(baseTokensExpectedRaw)

      if (_n===1){
        return [_amount, baseTokensSpent]
      } else {
        const newXReserves = _xReserves.add(_amount)
        const newYReserves = _yReserves.sub(baseTokensExpectedRaw)
        const newAmount = baseTokensExpectedRaw
        const [resultAmount, resultBaseTokensSpent] = await recursiveFunction(
          _n-1,
          newAmount,
          newXReserves,
          newYReserves,
        )
        return [_amount.add(resultAmount), baseTokensSpent.add(resultBaseTokensSpent)]
      }
    })
    return recursiveFunction
  }
)