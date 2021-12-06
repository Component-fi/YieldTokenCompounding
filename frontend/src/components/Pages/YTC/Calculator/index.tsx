import { Spinner } from "../../../Reusable/Spinner";
import { Box, Button, Flex, FormLabel, Input, InputGroup, InputRightAddon, Select as ChakraSelect, Text} from "@chakra-ui/react";
import { Formik, useFormikContext } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from 'recoil';
import { getActiveTranches } from "../../../../features/element";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { Token, Tranche } from "../../../../types/manual/types";
import * as Yup from 'yup';
import { BaseTokenPriceTag } from "../../../Prices";
import Card from "../../../Reusable/Card";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { ApproveAndSimulateButton } from "./ApproveAndSimulateButton";
import { TrancheDetails } from "./Tranche";
import { TokenIcon } from "../../../Tokens/TokenIcon";
import { InfoTooltip } from "../../../Reusable/Tooltip";
import { AdvancedCollapsable } from "./Advanced";
import copy from '../../../../constants/copy.json';
import { useWeb3React } from "@web3-react/core";
import { useBalance } from "../../../../hooks";
import { useClearSimOnFormikChange, useClearSimOnLocationChange, useSetFormikValueToQueryParam, useSetQueryParamToFormikValue, useSimulate } from './hooks';

interface CalculateProps {
    tokens: Token[];
}

export interface FormFields {
    tokenAddress: string | undefined,
    trancheAddress: string | undefined,
    amount: number | undefined,
    compounds: number | undefined,
    percentExposure: number,
}

export const Calculator: React.FC<CalculateProps> = (props: CalculateProps) => {
    const {tokens} = props;
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [variableApy, setVariableApy] = useState<number | undefined>(undefined);

    const initialValues: FormFields = {
        tokenAddress: undefined,
        trancheAddress: undefined,
        amount: 0,
        compounds: undefined,
        percentExposure: 0,
    }

    return (
        <Flex
            py={5}
            flexDir="column"
            gridGap={3}
        >

            <Formik
                initialValues={initialValues}
                // we will override this lower in the chain
                onSubmit={() => {}}
                validationSchema={
                    Yup.object({
                        amount: Yup.number().nullable()
                            .min(0.0000000000000000001, 'Amount must be greater than 0')
                            .required('An amount of tokens is required'),
                        compounds: Yup.number()
                            .min(1, 'Number of compounds must be 1 or greater')
                            .max(30, 'Number of compounds must be 30 or fewer'),
                        trancheAddress: Yup.string()
                            .required(),
                        tokenAddress: Yup.string()
                            .required(),
                    })
                }
            >
                <Form
                    tokens={tokens}
                    balance={balance}
                    setBalance={setBalance}
                    variableApy={variableApy}
                    setVariableApy={setVariableApy}
                />
            </Formik>
        </Flex>
    )

}

interface FormProps {
    tokens: Token[];
    balance: number | undefined,
    setBalance: React.Dispatch<React.SetStateAction<number | undefined>>
    variableApy: number | undefined,
    setVariableApy: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Form: React.FC<FormProps> = (props) => {

    const handleSimulate = useSimulate();

    const {tokens, balance, setBalance, setVariableApy} = props;

    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const simulationResults = useRecoilValue(simulationResultsAtom);
    const elementAddresses = useRecoilValue(elementAddressesAtom)
    const formik = useFormikContext<FormFields>();


    const { account } = useWeb3React();

    const tokenAddress = formik.values.tokenAddress;
    const updateBalance = useBalance(tokenAddress, setBalance);

    const setFieldValue = formik.setFieldValue;

    const getTokenNameByAddress = useCallback(
        (tokenAddress: string | undefined): string | undefined => {
            if (!tokenAddress){
                return undefined;
            }
            const token: Token | undefined = tokens.find((token) => {
                return token.address === tokenAddress;
            })
            return token?.name || undefined;
    }, [tokens])

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

    // update variable apy
    useEffect(() => {
        const tokenName = getTokenNameByAddress(tokenAddress);
        if (tokenName){
            getVariableAPY(tokenName, elementAddresses).then((apy) => {
                setVariableApy(apy);
            }).catch((error) => {
                console.error(error)
            })
        }
    }, [elementAddresses, tokenAddress, getTokenNameByAddress, setVariableApy])

    // Sets the amount to the user's balance of the base token
    const handleMax: React.MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent) => {
        event.preventDefault()
        formik.setFieldValue('amount', balance);
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        formik.handleChange(e);
    }

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
                            tranches && tranches.map((tranche: Tranche) => {
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
                        <Button
                            id="max"
                            onClick={handleMax}
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
                        {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                    </Text>
                        </InputRightAddon>
                    </InputGroup>
                    <TokenIcon
                        tokenName={getTokenNameByAddress(tokenAddress)}
                    />
                </Flex>
                <Flex
                    alignSelf="start"
                    px={2}
                    fontSize="sm"
                    textColor="gray.500"
                >
                    <BaseTokenPriceTag
                        baseTokenName = {getTokenNameByAddress(formik.values.tokenAddress)?.toUpperCase()}
                        amount = {formik.values.amount}
                    />
                </Flex>
            </Flex>
            <AdvancedCollapsable/>
        </Card>
        <ApproveAndSimulateButton
            formErrors={formik.errors}
            tokenAddress={formik.values.tokenAddress}
            tokenName={getTokenNameByAddress(formik.values.tokenAddress)}
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