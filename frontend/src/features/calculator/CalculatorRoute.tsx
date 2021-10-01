import React from 'react'
import { useParams } from 'react-router-dom';
import CalculatorForm from './component/CalculatorForm';
import {constants} from '../../../../constants/mainnet-constants';

interface Props {}

const getNameByAddress = (address: string): string | undefined => {
    const result = Object.entries(constants.tokens).find(([key, value]) => (
        value === address
    ))

    return result && result[0]
}

const CalculatorRoute: React.FC<Props> = (props) => {
    const params: {token: string} = useParams();

    const tokenName = getNameByAddress(params.token)


    return (
        tokenName ?
        <CalculatorForm 
            tranches={
                constants.tranches[tokenName]
            }
            onSubmit = {async (values, formikHelpers) => {
                alert(JSON.stringify(values));
                return
            }}
        /> :
        <div> Invalid Token </div>
    )
}

export default CalculatorRoute

