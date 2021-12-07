import React, { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { elementAddressesAtom } from './recoil/element/atom';
import { fetchElementState } from './recoil/element/fetch';
import { chainNameAtom } from './recoil/chain/atom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

function App() {

  const [, setElementState] = useRecoilState(elementAddressesAtom);
  const chainName = useRecoilValue(chainNameAtom);

  function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
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
