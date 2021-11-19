import { Box, Button, Grid, Select, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { CurrentAddressContext, SymfoniContext, ProviderContext } from '../../hardhat/SymfoniContext';

interface Props { }

export const Account: React.FC<Props> = () => {
    const [provider] = useContext(ProviderContext)
    const [address] = useContext(CurrentAddressContext)
    const { init, currentHardhatProvider, loading, providers } = useContext(SymfoniContext)
    const [selectedProvider, setSelectedProvider] = useState<string>();

    console.log({providers, currentHardhatProvider})

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        console.log("Provider in comp", provider)
    }, [provider])
    return (
        <Box gap="small" >

            {/* <Grid gap="small" columns={["auto", "flex"]}> */}
                {/* <Select
                    options={providers}
                    size="small"
                    value={selectedProvider}
                    onChange={(option) => setSelectedProvider(option.target.value)}
                ></Select> */}
                <Button disabled={loading || currentHardhatProvider === selectedProvider} size="small" label={selectedProvider ? "Connect " + selectedProvider : "Connect"} onClick={() => init(selectedProvider)}></Button>
            {/* </Grid> */}
            <Box >
                {address &&
                    <Text >Connected to: {currentHardhatProvider} with: {address.substr(0, 4) + ".." + address.substring(address.length - 3, address.length)}</Text>
                }
            </Box>
        </Box>
    )
}