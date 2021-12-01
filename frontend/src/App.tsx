import React, { useEffect } from 'react';
import Layout from './components/Layout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { elementAddressesAtom } from './recoil/element/atom';
import { fetchElementState } from './recoil/element/fetch';
import { chainNameAtom } from './recoil/chain/atom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from './connectors';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import WalletConnectProvider from '@walletconnect/web3-provider';

function App() {

  const [, setElementState] = useRecoilState(elementAddressesAtom);
  const chainName = useRecoilValue(chainNameAtom);

  function getLibrary(provider: any, connector: any): Web3Provider | WalletConnectConnector{
    let library;
    if (connector === injected){
      library = new Web3Provider(provider)
      library.pollingInterval = 12000
    } else {
      library = new Web3Provider(new WalletConnectProvider({
        infuraId: "35a9f6a7cbbbce67a7979734ef80baa9",
        rpc: "https://mainnet.infura.io/v3/35a9f6a7cbbbce67a7979734ef80baa9"
      }))
    }
    return library
  }

  // Get the element state file from their github repo
  // TODO this is reliant on the github repository
  useEffect(() => {
    fetchElementState(chainName).then((json) => {
      setElementState(json);
    })
  }, [chainName, setElementState])

  return (
    <div className="App">
        <Web3ReactProvider getLibrary={getLibrary}>
            <Layout/>
        </Web3ReactProvider>
    </div>
  );
}

export default App;
