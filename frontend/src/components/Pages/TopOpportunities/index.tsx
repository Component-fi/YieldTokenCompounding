import React, { useState } from 'react'
import { Title } from 'components/Layout/Title'
import { Button, Input } from '@chakra-ui/react';

interface Props {
}

const TopOpportunities = (props: Props) => {
    const [amount, setAmount] = useState<number>(0);
    const [results, setResults] = useState<any[]>([]);

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
            >
                Simulate
            </Button>
        </div>
    )
}

export default TopOpportunities
