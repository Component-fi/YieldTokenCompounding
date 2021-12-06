import { Flex } from "@chakra-ui/react";
import { Formik } from "formik";
import React, { useState } from "react";
import { Token } from "../../../../types/manual/types";
import * as Yup from 'yup';
import { Form } from "./Form";
import { useVariableAPY } from "./hooks";

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
    const [balance, setBalance] = useState<number | undefined>(undefined);

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
                    balance={balance}
                    setBalance={setBalance}
                />
            </Formik>
        </Flex>
    )

}