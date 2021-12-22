import React, { useCallback, useState } from 'react'
import { Title } from 'components/Layout/Title'
import { Button, Input } from '@chakra-ui/react';
import { simulateAllTranches } from 'api/ytc/simulateTranches';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { elementAddressesAtom } from 'recoil/element/atom';
import { useRecoilValue } from 'recoil';
import { DataTable } from './Table';

interface Props {
}

const TopOpportunities = (props: Props) => {
    const [amount, setAmount] = useState<number>(0);
    const [results, setResults] = useState<any[]>([]);

    const { library } = useWeb3React();
    const provider = library as Web3Provider;
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    const handleClick = useCallback(() => {
        simulateAllTranches(amount, provider, elementAddresses).then((response) => {
            setResults(response)
            console.log(response)
        })
    }, [amount, provider, elementAddresses])

    return (
        <div>
            <Title
                title="Yield Token Compounding"
                infoLinkText="How do I use this tool?"
                infoLink="https://medium.com/@component_general/how-to-yield-token-compound-using-the-ytc-tool-742d140a7c9c"
            />
            <Input
                value={amount}
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <Button
                onClick={handleClick}
            >
                Simulate
            </Button>
            {
                results.length > 0 && <DataTable data={results}/>
            }
        </div>
    )
}

export default TopOpportunities
