import { useFormikContext } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { FormFields } from "./index";
import { isSimulatingAtom, simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import { useQuery } from "../../../../hooks";
import { deployments } from "../../../../constants/apy-mainnet-constants";
import { simulateYTCForCompoundRange } from "../../../../features/ytc/simulateYTC";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { useWeb3React } from "@web3-react/core";
import { YTCInput } from "../../../../features/ytc/ytcHelpers";
import { Web3Provider } from '@ethersproject/providers';
import { trancheSelector } from "../../../../recoil/trancheRates/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";

// on location change, reset the simulation results
export const useClearSimOnLocationChange = () => {
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const location = useLocation();

    useEffect(() => {
        setSimulationResults([]);
    }, [location, setSimulationResults])
}
export const useClearSimOnFormikChange = () => {
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const {values} = useFormikContext();

    useEffect(() => {
        setSimulationResults([])
    }, [values, setSimulationResults])
}

export const useSetFormikValueToQueryParam = (queryName: string, fieldName: string, defaultValue: string | undefined) => {
    const query = useQuery();
    const formik = useFormikContext();

    const value = useMemo(() => query.get(queryName), [queryName, query])
    const setFieldValue = useMemo(() => formik.setFieldValue, [formik]);

    useEffect(() => {
            // set the value to either the received value, or the default value
            setFieldValue(fieldName, (value || defaultValue));
    }, [setFieldValue, fieldName, value, defaultValue])

}

export const useSetQueryParamToFormikValue = (queryName: string, fieldName: keyof FormFields) => {
    const history = useHistory();
    const {values} = useFormikContext<FormFields>();

    const value: any = useMemo(() => values[fieldName], [values, fieldName]);

    useEffect(() => {
        if (value){
            history.push(`/ytc?${queryName}=${value}`)
        }
    }, [value, history, queryName])
}

export const useSimulate = () => {
    const setIsSimulating = useRecoilState(isSimulatingAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const setNotification = useRecoilState(notificationAtom)[1];

    const { account, library } = useWeb3React();
    const provider = library as Web3Provider;

    const {values} = useFormikContext<FormFields>();
    const { variable } = useRecoilValue(trancheSelector(values.trancheAddress || ""))

    const handleSimulate = useCallback(
        () => {
            const ytcContractAddress = deployments.YieldTokenCompounding;

            setIsSimulating(true);
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
                    variableApy: variable,
                }

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
            } else {
                setNotification((currentNotifications) => {
                    return [
                        ...currentNotifications,
                        {
                            text: "Simulation Failed",
                            details: "Missing required values",
                            type: "ERROR"
                        }
                    ]
                })
            }
        },
        [values, account, elementAddresses, provider, setIsSimulating, setNotification, setSimulationResults, variable],
    )


    return handleSimulate;
}
