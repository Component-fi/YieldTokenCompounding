import { Spinner } from "../../../Reusable/Spinner";
import { Box, Button, Flex, FormLabel, Input, InputGroup, InputRightAddon, Select, Text} from "@chakra-ui/react";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { YTCInput } from "../../../../features/ytc/ytcHelpers";
import { getActiveTranches, getBalance } from "../../../../features/element";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { isSimulatingAtom, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { Token, Tranche } from "../../../../types/manual/types";
import * as Yup from 'yup';
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { BaseTokenPriceTag } from "../../../Prices";
import Card from "../../../Reusable/Card";
import { simulateYTCForCompoundRange } from "../../../../features/ytc/simulateYTC";
import { getVariableAPY } from '../../../../features/prices/yearn';
import { ApproveAndSimulateButton } from "./ApproveAndSimulateButton";
import { TrancheDetails } from "./Tranche";
import { TokenIcon } from "../../../Tokens/TokenIcon";
import { InfoTooltip } from "../../../Reusable/Tooltip";
import { AdvancedCollapsable } from "./Advanced";
import { deployments } from "../../../../constants/apy-mainnet-constants";
import copy from '../../../../constants/copy.json';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { ERC20__factory } from "../../../../hardhat/typechain/factories/ERC20__factory";

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
    const setNotification = useRecoilState(notificationAtom)[1];

    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const setIsSimulating = useRecoilState(isSimulatingAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const { library, account } = useWeb3React();
    const provider = library as Web3Provider;

    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [variableApy, setVariableApy] = useState<number | undefined>(undefined);

    const handleSubmit = (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
        const ytcContractAddress = deployments.YieldTokenCompounding;

        if (
                !!values.tokenAddress &&
                !!values.trancheAddress &&
                !!values.amount &&
                !!ytcContractAddress &&
                !!account
        ){
            const userData: YTCInput = {
                baseTokenAddress: values.tokenAddress,
                amountCollateralDeposited: values.amount,
                numberOfCompounds: values.compounds ? Math.floor(values.compounds) : 1,
                trancheAddress: values.trancheAddress,
                ytcContractAddress,
                variableApy,
            }

            setIsSimulating(true);

            let compoundRange: [number, number] = [1, 8];
            if (values.compounds){
                if (values.compounds > 0){
                    compoundRange = [values.compounds-1, values.compounds+1];
                }
                if (values.compounds === 1){
                    compoundRange = [1, 3];
                }
                if (values.compounds >= 30){
                    compoundRange = [28, 30];
                }
            }
            
            // const signer = provider.getSigner(account);
            simulateYTCForCompoundRange(userData, elementAddresses, compoundRange, provider).then(
                (results) => {
                    setSimulationResults(() => {
                        return results;
                    })
                }
            ).catch((error) => {
                setNotification((currentNotifications) => {
                    return [
                        ...currentNotifications,
                        {
                            text: "Simulation Failed",
                            details: error.message,
                            type: "ERROR"
                        }
                    ]
                })
            }).finally(() => {
                setIsSimulating(false);
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        setSimulationResults([]);
    }

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
                onSubmit={handleSubmit}
                validationSchema={
                    Yup.object({
                        amount: Yup.number().nullable()
                            .min(0.0000000000000000001, 'Amount must be greater than 0')
                            // .max((balance ? balance : 0), 'Insufficient balance')
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
                    onChange={handleChange}
                    balance={balance}
                    setBalance={setBalance}
                    variableApy={variableApy}
                    setVariableApy={setVariableApy}
                />
            </Formik>
        </Flex>
    )

}

// TOOD this can be moved to a utility
function useQuery() {
    return new URLSearchParams(useLocation().search);
}


interface FormProps {
    tokens: Token[];
    onChange: (e: React.ChangeEvent<any>) => void;
    balance: number | undefined,
    setBalance: React.Dispatch<React.SetStateAction<number | undefined>>
    variableApy: number | undefined,
    setVariableApy: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Form: React.FC<FormProps> = (props) => {

    const {tokens, onChange, balance, setBalance, setVariableApy} = props;

    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const [simulationResults, setSimulationResults] = useRecoilState(simulationResultsAtom);
    const elementAddresses = useRecoilValue(elementAddressesAtom)
    const history = useHistory();
    const location = useLocation();
    const query = useQuery();
    const formik = useFormikContext<FormFields>();

    const { library, account } = useWeb3React();
    const provider = (library as Web3Provider);

    const tokenAddress = formik.values.tokenAddress;
    const setFieldValue = formik.setFieldValue;


    const getTokenAddress = useCallback(
        () => {
            const token = query.get('base_token') || tokens[0].address;
            return token;
        },
        // TODO this should be resolved not ignored
        // eslint-disable-next-line
        [tokens, location],
    )

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

    const updateBalance = useCallback(
        () => {
            if (tokenAddress && account){
                const tokenContract = ERC20__factory.connect(tokenAddress, provider)
                setBalance(undefined);
                getBalance(account, tokenContract).then((res) => {
                    setBalance(res);
                })
            }
        }, [tokenAddress, account, setBalance, provider]
    )
    

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
    useEffect(() => {
        if (tokens.length >= 1){
            const tokenAddress = getTokenAddress();
            setFieldValue('tokenAddress', tokenAddress)
        }
    }, [getTokenAddress, tokens, setFieldValue, location])

    // on location change, reset the simulation results
    useEffect(() => {
        setSimulationResults([]);
    }, [location, setSimulationResults])

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
    // update fixed apy
    useEffect(() => {
    })


    // custom handler for token input change, as it needs to be added as a query param
    const handleTokenChange = (event: React.ChangeEvent<any>) => {
        const value = event.target.value;

        // add the token address as a query param
        if (value) {
            history.push(`/ytc?base_token=${value}`)
            // amount should be set to zero on token change
            formik.setFieldValue('amount', 0)
        }
        
        formik.handleChange(event);
    }

    // Sets the amount to the user's balance of the base token
    const handleMax: React.MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent) => {
        event.preventDefault()
        formik.setFieldValue('amount', balance);
    }

    const handleChange = (e: React.ChangeEvent<any>) => {
        formik.handleChange(e);
        onChange(e);
    }

    return <form onSubmit={formik.handleSubmit} onChange={handleChange}>
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
                        width="40"
                        name="tokenAddress"
                        rounded="full"
                        variant="filled"
                        bgColor="input_bg"
                        cursor="pointer"
                        value={formik.values.tokenAddress}
                        onChange={handleTokenChange}
                    >
                        {tokens.map((token) => {
                            return <option value={token.address} key={token.address}>
                                {token.name.toUpperCase()}
                            </option>
                        })}
                    </Select>
                    <Select
                        width="40"
                        name="trancheAddress"
                        rounded="full"
                        cursor="pointer"
                        variant="filled"
                        bgColor="input_bg"
                        value={formik.values.trancheAddress}
                        onChange={formik.handleChange}
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
                            // variant="filled"
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