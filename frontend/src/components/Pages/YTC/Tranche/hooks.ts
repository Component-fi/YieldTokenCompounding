import { getVariableAPY } from "../../../../features/prices/yearn";
import { useTokenName, useVariableAPY } from "../Calculator/hooks";


const useUpdateVariableRate = (tokenAddress: string) => {

    const getVariableRate = useVariableAPY();
    const variable = getVariableRate(tokenAddress)

    handleChangeTrancheRate({
        variable: apy
    })


        getVariableAPY(baseTokenName, elementAddresses).then((apy) => {
        })
    }

        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);

        // get variable rate
        if (baseTokenName){
        }
}

const useUpdateFixedRate = () => {

        // get baseTokenName
        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);

        const signer = provider?.getSigner();
        if (baseTokenName && signer){
            getFixedRate(baseTokenName, trancheAddress, elementAddresses, signer).then((fixedRate) => {
                handleChangeTrancheRate({
                    fixed: fixedRate
                })
            }).catch((error) => {
                console.error(error);
            })
        }
}

const useUpdateAccruedValue = () => {

        const signer = provider?.getSigner();
        if (signer){
            yieldTokenAccruedValue(elementAddresses, trancheAddress, signer).then((accruedValue) => {
                handleChangeTrancheRate({
                    accruedValue: accruedValue,
                })
            }).catch((error) => {
                console.error(error);
            })
        }
}

const useUpdateDaysRemaining = () => {
        const baseTokenName = getTokenNameByAddress(tokenAddress, elementAddresses.tokens);
        if (baseTokenName){
            const trancheDict: {[key: string]: Tranche[]} = elementAddresses.tranches;
            const tranches: Tranche[] = trancheDict[baseTokenName];
            const tranche: Tranche | undefined = getTrancheByAddress(trancheAddress, tranches);
            if (tranche){
                handleChangeTrancheRate({
                    daysRemaining: getRemainingTrancheYears(tranche.expiration) * 365
                })
            }
        }
}

