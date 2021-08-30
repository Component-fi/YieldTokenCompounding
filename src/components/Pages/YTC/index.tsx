import { Button, Select } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [simulatedResults, setSimulatedResults] = useState<ApeProps | undefined>(undefined)

    const handleSimulation = () => {
        setSimulatedResults({
            principleToken: {
                name: 'ePT-CRV3USDC',
                expiry: 1640057082,
            },
            yieldToken: {
                name: 'eYT-CRV3USDC',
                expiry: 1671593082,
            },
            principleTokenAmount: 34.0,
            yieldTokenAmount: 0.9,
        })
    }

    return <div>
        <div id="title" className="">
            <h2 className="text-2xl font-bold">
                Yield Token Compounding
            </h2>
        </div>
        <Calculator
            tokens={[
                {
                    name: 'USDC',
                    address: '0x000000000000000',
                },
                {
                    name: 'DAI',
                    address: '0x111111111111111111',
                },
                {
                    name: 'WETH',
                    address: '0x22222222222222222',
                }
            ]}
            onSimulate={handleSimulation}
        />
        {
            simulatedResults && <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                </svg>

                <Ape
                    {
                        ...simulatedResults
                    }
                />
            </>
        }
    </div>
}

interface CalculateProps {
    tokens: {
        name: string,
        address: string
    }[];
    onSimulate: () => void;
}

// TODO replace this method with one that provides the balance
const getBalance = (tokenAddress: string) => {
    return 1000
}

// TODO replace this method with one that actually provides the tranches
const getTranches = (tokenAddress: string): Tranche[] => {
    return [
        {
            address: '0x444444444444444444',
            expiry: 1639991814,
        },
        {
            address: '0x555555555555555555',
            expiry: 1671527814,
        }
    ]
}

interface Tranche {
    address: string,
    expiry: number,
}

export const Calculator: React.FC<CalculateProps> = (props: CalculateProps) => {
    const {tokens, onSimulate} = props;

    const [tokenAddress, setTokenAddress] = useState<string | undefined>(undefined);
    const [trancheAddress, setTrancheAddress] = useState<string | undefined>();
    const [tranches, setTranches] = useState<Tranche[] | undefined>(undefined);
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [compounds, setCompounds] = useState<number | undefined>(undefined);

    useEffect(() => {
        setTokenAddress(tokens[0].address);
    }, [tokens])

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setTokenAddress(value)
    }

    const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setAmount(parseInt(value));
    }

    const handleTrancheChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setTrancheAddress(value);
    }

    const handleCompoundsChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setCompounds(parseInt(value));
    }

    const handleMax: React.MouseEventHandler<HTMLButtonElement> = () => {
        setAmount(balance);
    }

    useEffect(() => {
        if (tokenAddress){
            setTranches(getTranches(tokenAddress))
            setBalance(getBalance(tokenAddress))
        }
    }, [tokenAddress])

    return (
        <div id="calculate" className="py-5 flex flex-col gap-3">
            <div id="selects" className="flex flex-row items-center justify-center gap-6 mb-4">
                {/* <div id="asset-select-proxy" className="rounded-full bg-indigo-100 flex flex-row py-2 px-3 gap-2 items-center hover:bg-indigo-200 cursor-pointer"> */}
                    <Select
                        width="36"
                        rounded="full"
                        variant="filled"
                        bgColor="#E0E7FF"
                        onChange={handleChange}
                        shadow="inner"
                    >
                        {tokens.map((token) => {
                            return <option value={token.address} key={token.address}>
                                {token.name}
                            </option>
                        })}
                    </Select>
                    <Select
                        width="36"
                        rounded="full"
                        variant="filled"
                        bgColor="#E0E7FF"
                        value={trancheAddress}
                        onChange={handleTrancheChange}
                        shadow="inner"
                    >
                        {
                            tranches && tranches.map((tranche: Tranche) => {
                                return <option value={tranche.address} key={tranche.address}>
                                    {(new Date(tranche.expiry * 1000)).toLocaleDateString()}
                                </option>
                            })
                        }
                    </Select>
            </div>
            <div id="form" className="flex flex-col items-stretch p-6 gap-3 w-full bg-indigo-100 rounded-2xl shadow-inner">
                <div id="table-headers" className="flex flex-row justify-between">
                    <div id="percentage-header" className="text-sm">
                        Compounds
                    </div>
                    <div id="amount-header" className="flex flex-row gap-2 items-center text-sm">
                        <button id="max" onClick={handleMax} className="bg-gray-300 rounded-full text-sm p-1 px-2 hover:bg-gray-400">
                            MAX
                        </button>
                        <div id="balance">
                            Balance: {balance}                        
                        </div>
                    </div>
                </div>
                <div id="table-inputs" className="flex flex-row justify-between items-center">
                    <div id="percentage exposure" className="flex p-2 hover:shadow-inner w-1/2">
                        <input
                            type="number"
                            value={compounds}
                            placeholder={"0"}
                            onChange={handleCompoundsChange}
                            id="number-compounds"
                            className="text-lg bg-indigo-100 min-w-0"
                        />
                    </div>
                    <div id="amount-input" className="flex flex-row gap-2 p-2 hover:shadow-inner w-1/2">
                        <input
                            type="number"
                            value={amount}
                            placeholder={"0.0"}
                            onChange={handleAmountChange}
                            id="amount-input"
                            className="text-lg text-right bg-indigo-100 min-w-0"/>
                        <div id="amount-input" className="text-lg">USDC</div>
                    </div>
                </div>
            </div>
            <Button
                id="approve-calculate-button"
                className="rounded-full w-full bg-indigo-500 mt-4 p-2 text-gray-50 hover:bg-indigo-400"
                rounded="full"
                bgColor="#6366F1"
                mt="4"
                p="2"
                textColor="gray.50"
                onClick={onSimulate}
            >
                SIMULATE
            </Button>
        </div>
    )

}

interface ApeProps {
    principleToken: {
        name: string,
        expiry: number,
    };
    yieldToken: {
        name: string,
        expiry: number,
    };
    principleTokenAmount: number;
    yieldTokenAmount: number;
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {principleToken, yieldToken, principleTokenAmount, yieldTokenAmount} = props;

    return (
        <div id="ape" className="py-5 flex flex-col gap-3">
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left">
                        <div id="asset-name">
                            {principleToken.name}
                        </div>
                        <div id="asset-date">
                            {(new Date(principleToken.expiry * 1000)).toLocaleDateString()}
                        </div>
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        {principleTokenAmount}
                    </div>
                </div>
            </div>
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left">
                        <div id="asset-name">
                            {yieldToken.name}
                        </div>
                        <div id="asset-date">
                            {(new Date(yieldToken.expiry * 1000)).toLocaleDateString()}
                        </div>
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        {yieldTokenAmount}
                    </div>
                </div>
            </div>
            <Button
                id="approve-calculate-button"
                className="rounded-full w-full bg-indigo-500 mt-4 p-2 text-gray-50 hover:bg-indigo-400"
                rounded="full"
                bgColor="#6366F1"
                mt="4"
                p="2"
                textColor="gray.50"
            >
                APE
            </Button>
        </div>
    )
}