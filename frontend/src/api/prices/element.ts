import { ELEMENT_SPECIFIC_TOKENS } from '@/constants/apy-mainnet-constants'
import { BigNumber, ethers, getDefaultProvider } from "ethers";
import { WAD } from "@/constants/static";
import Decimal from 'decimal.js';

export const isElementSpecificToken = (baseTokenNameLowercase: string) => (
  ELEMENT_SPECIFIC_TOKENS.includes(baseTokenNameLowercase)
)

// written to use this contract: https://etherscan.io/address/0x557f483e13c94a02cbfefe1d27a781c4221f37f5#readContract
export const getPriceValueFromContract = async (
  contractAddress: string,
): Promise<number> =>  {
  const valueOracleContract = new ethers.Contract(contractAddress, ['function value() public view returns (uint256 _value, bytes data)'], getDefaultProvider())
  const value: {_value: BigNumber, data: string} = await valueOracleContract.value()
  const valueDecimals = new Decimal(value._value.toString())
  const price = valueDecimals.div(10 ** WAD)

  return price.toNumber()
}
