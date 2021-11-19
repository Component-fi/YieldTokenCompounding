import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, Flex } from '@chakra-ui/react'
import { ProviderContext, CurrentAddressContext } from "../../hardhat/SymfoniContext";
import { chainNameAtom } from '../../recoil/chain/atom';
import { useRecoilState } from 'recoil';
import { Modal } from './Modal';

interface Props {
}

export const Wallet = (props: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [provider] = useContext(ProviderContext);
    const [currentAddress] = useContext(CurrentAddressContext)

    const [chainName, setChainName] = useRecoilState(chainNameAtom);

    // Set the network name when connected
    useEffect(() => {
        provider?.getNetwork().then(
            ({name}) => {
                if (name === "homestead"){
                    setChainName('mainnet')
                } else {
                    setChainName(name);
                }
            }
        )
    }, [provider, setChainName])


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
                !!provider ? 
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