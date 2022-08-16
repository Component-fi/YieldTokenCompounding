import React, { useEffect } from "react";
import '@/utils/polyfill'
import { useRecoilState, useRecoilValue } from "recoil";
import '@rainbow-me/rainbowkit/styles.css'
import Layout from "@/components/Layout/Layout";
import { elementAddressesAtom } from "@/recoil/element/atom";
import { fetchElementState } from "@/recoil/element/fetch";
import { chainNameAtom } from "@/recoil/chain/atom";
import {
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import {
  publicProvider
} from 'wagmi/providers/public';
import {
  WalletConnectConnector
} from 'wagmi/connectors/walletConnect'

function App() {
  const [, setElementState] = useRecoilState(elementAddressesAtom);
  const chainName = useRecoilValue(chainNameAtom);

  const { chains, provider } = configureChains(
    [chain.mainnet],
    [publicProvider()]
  )

  const { connectors } = getDefaultWallets(({
    appName: "Yield Token Compounding",
    chains
  }))

  const client = createClient({
    autoConnect: true,
    connectors: [...connectors(), new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    })],
    provider,
  })

  // Get the element state file from their github repo
  // TODO this is reliant on the github repository
  useEffect(() => {
    fetchElementState(chainName).then((json) => {
      setElementState(json);
    });
  }, [chainName, setElementState]);

  return (
    <div className="App">
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={ chains }>
          <Layout />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
