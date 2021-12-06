import {Box, Button, Flex, FormLabel, Input, InputGroup, InputRightAddon, Select as ChakraSelect, Spinner, Text} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useFormikContext } from 'formik';
import { MouseEventHandler, useCallback, useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormFields } from '.';
import { getActiveTranches } from '../../../../features/element';
import { useBalance } from '../../../../hooks';
import { activeTokensSelector, elementAddressesAtom } from '../../../../recoil/element/atom';
import { simulationResultsAtom } from '../../../../recoil/simulationResults/atom';
import { Tranche } from '../../../../types/manual/types';
import { BaseTokenPriceTag } from '../../../Prices';
import Card from '../../../Reusable/Card';
import { InfoTooltip } from '../../../Reusable/Tooltip';
import { TokenIcon } from '../../../Tokens/TokenIcon';
import { AdvancedCollapsable } from './Advanced';
import { ApproveAndSimulateButton } from './ApproveAndSimulateButton';
import { useClearSimOnLocationChange, useSimulate, useSetFormikValueToQueryParam, useSetQueryParamToFormikValue, useClearSimOnFormikChange, useTokenName, useVariableAPY } from './hooks';
import { TrancheDetails } from './Tranche';
import copy from '../../../../constants/copy.json';

interface FormProps {
    balance: number | undefined,
    setBalance: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const Form: React.FC<FormProps> = (props) => {

    const handleSimulate = useSimulate();

    const {balance, setBalance } = props;

    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const simulationResults = useRecoilValue(simulationResultsAtom);
    const elementAddresses = useRecoilValue(elementAddressesAtom)
    const formik = useFormikContext<FormFields>();

    const { account } = useWeb3React();

    const tokenAddress = formik.values.tokenAddress;
    const getTokenName = useTokenName();
    const tokenName = useMemo(() => getTokenName(tokenAddress), [tokenAddress, getTokenName]);

    const updateBalance = useBalance(tokenAddress, setBalance);
    const setFieldValue = formik.setFieldValue;
    const tokens = useRecoilValue(activeTokensSelector);

    const updateTokens = useCallback (
        () => {
            if (tokenAddress){
                getActiveTranches(tokenAddress, elementAddresses).then((res) => {
                    setTranches(res);
                    setFieldValue('trancheAddress', res[0]?.address);
                })
            } 
        }, [tokenAddress, setTranches, setFieldValue, elementAddresses]
    )

    // if there is a token specified in the query params we want to set the value of the form to it
    useSetFormikValueToQueryParam('base_token', 'tokenAddress', tokens[0]?.address);
    useSetQueryParamToFormikValue('base_token', 'tokenAddress');
    useClearSimOnLocationChange();
    useClearSimOnFormikChange();

    useEffect(() => {
        updateTokens();
        updateBalance();
    }, [tokenAddress, elementAddresses, account, setFieldValue, setBalance, updateTokens, updateBalance])

    useEffect(() => {
        updateBalance();
    }, [simulationResults, updateBalance])

    // Sets the amount to the user's balance of the base token
    const handleMax: React.MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent) => {
        event.preventDefault()
        formik.setFieldValue('amount', balance);
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        formik.handleChange(e);
    }

    type NewType = Tranche;

    return <form onSubmit={(e) => {
        e.preventDefault()
        handleSimulate()
    }} onChange={handleChange}>
        <Card>
            <Flex
                id="tranche-select"
                flexDir="column"
                alignItems="center"
            >
                <FormLabel>
                    <Flex
                        flexDir="row"
                        alignItems="center"
                        gridGap={2}
                    >
                        Term
                        <InfoTooltip label={copy.tooltips.term} w={3} h={3}/>
                    </Flex>
                </FormLabel>
                <Flex
                    id="selects"
                    flexDir={{base: "column", sm: "row"}}
                    justify="center"
                    alignItems="center"
                    mb={4}
                    gridGap={{base: 2, sm: 6}}
                >
                    <Select
                        name="tokenAddress"
                        value={formik.values.tokenAddress}
                    >
                        {tokens.map((token) => {
                            return <option value={token.address} key={token.address}>
                                {token.name.toUpperCase()}
                            </option>
                        })}
                    </Select>
                    <Select
                        name="trancheAddress"
                        value={formik.values.trancheAddress}
                    >
                        {
                            tranches && tranches.map((tranche: NewType) => {
                                return <option value={tranche.address} key={tranche.address}>
                                    {(new Date(tranche.expiration * 1000)).toLocaleDateString()}
                                </option>
                            })
                        }
                    </Select>
                </Flex>
                { formik.values.trancheAddress && formik.values.tokenAddress && <TrancheDetails
                    trancheAddress={formik.values.trancheAddress}
                    tokenAddress={formik.values.tokenAddress}
                />} 
            </Flex>
        </Card>
        <Card mt={5}>
            <Flex
                id="amount-card"
                p={2}
                flexDir="column"
                alignItems="center"
                gridGap={1}
            >
                <FormLabel
                    flexDir="row"
                    justify="center"
                    alignItems="center"
                >
                    <Flex
                        flexDir="row"
                        alignItems="center"
                        gridGap={2}
                    >
                        Input Amount
                        <InfoTooltip label={copy.tooltips.input_amount} h={3} w={3}/>
                    </Flex>
                </FormLabel>
                <Flex
                    id="amount-header"
                    flexDir="row"
                    gridGap={2}
                    justify="space-between"
                    alignItems="center"
                    fontSize="sm"
                    width="full"
                >
                    <Flex
                        alignItems="center"
                        gridGap={1}
                    >
                        <MaxButton handleMax={handleMax}/>
                        <Box
                            id="balance"
                        >
                            Balance: {(balance !== undefined) ? balance : <Spinner/>}
                        </Box>
                    </Flex>
                </Flex>
                <Flex
                    id="amount-row"
                    flexDir="row"
                    justifyContent="end"
                    width="full"
                    rounded="xl"
                    gridGap={2}
                    p={1}
                    _hover={{
                        shadow: "inner"
                    }}
                >
                    <InputGroup
                        bgColor="input_bg"
                        rounded="2xl"
                    >
                        <Input
                            type="number"
                            name="amount"
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                            placeholder={"0.0"}
                            onChange={formik.handleChange}
                            id="amount-input"/>
                        <InputRightAddon
                            bgColor="input_bg"
                            color="text.primary"
                        >
                            <Text
                                id="amount-token-label"
                                fontSize="2xl"
                                whiteSpace="nowrap"
                            >
                        {tokenName?.toUpperCase()}
                    </Text>
                        </InputRightAddon>
                    </InputGroup>
                    <TokenIcon
                        tokenName={tokenName}
                    />
                </Flex>
                <Flex
                    alignSelf="start"
                    px={2}
                    fontSize="sm"
                    textColor="gray.500"
                >
                    <BaseTokenPriceTag
                        baseTokenName = {tokenName?.toUpperCase()}
                        amount = {formik.values.amount}
                    />
                </Flex>
            </Flex>
            <AdvancedCollapsable/>
        </Card>
        <ApproveAndSimulateButton
            formErrors={formik.errors}
            tokenAddress={formik.values.tokenAddress}
            tokenName={tokenName}
            trancheAddress={formik.values.trancheAddress}
            amount={formik.values.amount}
            rounded="full"
            bgColor="main.primary"
            color="text.secondary"
            mt="4"
            p="2"
            width="full"
            _hover={{
                bgColor:"main.primary_hover"
            }}
        />
    </form>
}

const Select: typeof ChakraSelect= (props) => {
    return <ChakraSelect
        width="40"
        rounded="full"
        variant="filled"
        bgColor="input_bg"
        cursor="pointer"
        {...props}
    >
    </ChakraSelect>
}

const MaxButton: React.FC<{handleMax: MouseEventHandler<HTMLButtonElement>}> = (props) => {
    return <Button
        id="max"
        onClick={props.handleMax}
        bg="gray.300"
        rounded="xl"
        fontSize="sm"
        py={0}
        h="20px"
        px={2}
        _hover={
            {
                bg: "gray.400"
            }
        }
    >
        MAX
    </Button>
}