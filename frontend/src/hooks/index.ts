import { useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { FormFields } from "../components/Pages/YTC/Calculator";
import { simulationResultsAtom } from "../recoil/simulationResults/atom";

// on location change, reset the simulation results
export const useClearSimOnLocationChange = () => {
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const location = useLocation();

    useEffect(() => {
        setSimulationResults([]);
    }, [location, setSimulationResults])
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

// TOOD this can be moved to a utility
function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export const useSetQueryParamToFormikValue = (queryName: string, fieldName: keyof FormFields) => {
    const history = useHistory();
    const {values} = useFormikContext<FormFields>();

    const value: any = useMemo(() => values[fieldName] , [values, fieldName]);

    useEffect(() => {
        if (value){
            history.push(`/ytc?${queryName}=${value}`)
        }
    }, [value, history, queryName])
}

