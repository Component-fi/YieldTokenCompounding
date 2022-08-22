import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

// @ts-ignore
const RPC_URLS = {
  1: import.meta.env.REACT_APP_MAINNET_RPC as string,
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 31337],
});
// TODO only use wallet connect if valid
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1]},
  qrcode: true
});
