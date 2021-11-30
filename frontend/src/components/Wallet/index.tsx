import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Text, Flex } from '@chakra-ui/react'
import { ProviderContext, CurrentAddressContext } from "../../hardhat/SymfoniContext";
import { chainNameAtom } from '../../recoil/chain/atom';
import { useRecoilState } from 'recoil';
import { Modal } from './Modal';
import { SignerContext } from '../../hardhat/SymfoniContext';
import { ethers } from 'ethers';

interface Props {
}

export const Wallet = (props: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [provider] = useContext(ProviderContext);
    const [signer, setSigner] = useContext(SignerContext)
    const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext)

    const [chainName, setChainName] = useRecoilState(chainNameAtom);

    // Set the network name when connected
    const updateNetwork = useCallback(
        () => {
            provider?.getNetwork().then(
                ({name}) => {
                    if (name === "homestead"){
                        setChainName('mainnet')
                    } else {
                        setChainName(name);
                    }
                }
            )
        },
        [provider, setChainName],
    )

    const updateSigner = useCallback(
        async () => {
            if (provider){
                const web3Provider = provider as ethers.providers.Web3Provider;
                const signer = await web3Provider.getSigner(0)
                setSigner(signer);
                setCurrentAddress(await signer?.getAddress() || "")
            }
        },
        [provider, setSigner, setCurrentAddress],
    )

    useEffect(() => {
        updateNetwork();
    }, [updateNetwork])

    useEffect(() => {
        window.ethereum.on('accountsChanged', updateSigner);
            
    }, [updateSigner])


    const shortenAddress = (address: string): string => {
        return address.slice(0, 6) + '....' + address.slice(-4)
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            {
                !!signer ? 
                <Flex
                    justifyContent = "space-between"
                    alignItems = "center"
                >
                    <Flex
                        justifyContent = "space-between"
                        alignItems = "center"
                    >
                        <Text
                            pr={2}
                            color="text.primary"
                        >
                            {chainName}
                        </Text>
                    </Flex>
                    <Button
                        onClick={() => setIsOpen(true)}
                        fontSize={'sm'}
                        fontWeight={600}
                        color=""
                        bg={'card'}
                        href={'#'}
                        _hover={{
                            bg: 'primary.hover',
                        }}>
                            {shortenAddress(currentAddress)}
                    </Button> 
                </Flex> :
                <Button
                    onClick={() => setIsOpen(true)}
                    display={{  md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color="text.secondary"
                    bg='main.primary'
                    href={'#'}
                    _hover={{
                        bg: 'main.primary_hover',
                    }}>
                        CONNECT WALLET
                </Button>
            }
        </div>
    )
}

export default Wallet;