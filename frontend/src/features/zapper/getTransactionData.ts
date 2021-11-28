import axios from 'axios';
import {BigNumberish} from 'ethers';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface UserZapIn {
  toWhomToIssue: string;
  sellToken: string;
  sellAmount: BigNumberish;
  poolAddress: string;
  protocol: string;
}

interface GetZapInData {
  ownerAddress: string;
  sellToken: string;
  sellAmount: BigNumberish;
  poolAddress: string;
  protocol: string;
  affiliateAddress?: string,
}

const userZapIn = async ({
  toWhomToIssue,
  sellToken,
  sellAmount,
  poolAddress,
  protocol,
}: UserZapIn) => {
  return await getZapInData({
    ownerAddress: toWhomToIssue,
    sellToken,
    sellAmount,
    poolAddress,
    protocol,
  }).then((data) => {
    return {
      ...data,
      gas: "6000000",
    };
  });
};

const getZapInData = async ({
  ownerAddress,
  sellToken,
  sellAmount,
  poolAddress,
  protocol,
  affiliateAddress = ZERO_ADDRESS,
}: GetZapInData) => {
  const params = {
    api_key: process.env.REACT_APP_ZAPPER_API_KEY,
    ownerAddress,
    sellAmount: sellAmount.toString(),
    sellTokenAddress: sellToken,
    poolAddress: poolAddress.toLowerCase(),
    affiliateAddress,
    gasPrice: "250000000000",
    slippagePercentage: "0.05",
    skipGasEstimate: true,
  };

  const data = await axios
    .get(`http://api.zapper.fi/v1/zap-in/${protocol}/transaction`, { params })
    .then((r) => {
      return r.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  return data;
};

interface ZapSwapDataInput {
  ownerAddress: string;
  sellToken: string;
  sellAmount: BigNumberish;
  buyToken: string;
}

export const getZapSwapData = async ({
    ownerAddress,
    sellToken,
    sellAmount,
    buyToken,
}: ZapSwapDataInput) => {

    const params = {
        api_key: process.env.REACT_APP_ZAPPER_API_KEY,
        ownerAddress,
        buyTokenAddress: buyToken,
        sellTokenAddress: sellToken,
        sellAmount: sellAmount.toString(),
        gasPrice: "250000000000",
        slippagePercentage: "0.05",
        network: "ethereum",
        skipGasEstimate: true,
    }
  const data = await axios
    .get("https://api.zapper.fi/v1/exchange/quote", { params })
    .then((r) => {
      return r.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

    return data;
}

export {
  getZapInData,
  userZapIn,
};