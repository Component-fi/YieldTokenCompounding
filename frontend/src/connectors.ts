import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const injected = new InjectedConnector({ supportedChainIds: [1, 31337] })
// TODO only use wallet connect if valid
export const walletconnect = new WalletConnectConnector({ rpc: { 1: process.env.WALLET_CONNECT_KEY || "" } });