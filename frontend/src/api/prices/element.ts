import { ELEMENT_SPECIFIC_TOKENS } from '@/constants/apy-mainnet-constants'
import { BigNumber, ethers, getDefaultProvider } from "ethers";
import { WAD } from "@/constants/static";

export const isElementSpecificToken = (baseTokenNameLowercase: string) => (
  ELEMENT_SPECIFIC_TOKENS.includes(baseTokenNameLowercase)
)

// written to use this contract: https://etherscan.io/address/0x557f483e13c94a02cbfefe1d27a781c4221f37f5#readContract
export const getPriceValueFromContract = async (
  contractAddress: string,
): Promise<number> =>  {
  console.log("getPriceValueFromContract")
  if (contractAddress) {
    const valueOracleContract = new ethers.Contract(contractAddress, ['function value() public view returns (uint256 _value, bytes data)'], getDefaultProvider())
    const value: {_value: BigNumber, data: string} = await valueOracleContract.value()
    const price = value._value.div(String(10 ** WAD)).toNumber()
    return price
  }

  return 0
}
