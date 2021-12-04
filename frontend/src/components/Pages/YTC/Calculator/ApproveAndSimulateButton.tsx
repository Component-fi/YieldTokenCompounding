import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { BalancerApproval, ERC20Approval } from "../../../../features/approval/Approval";
import { useRecoilValue } from 'recoil';
import { isSimulatedSelector, isSimulatingAtom, selectedCalculatorGainSelector } from "../../../../recoil/simulationResults/atom";
import { deployments } from "../../../../constants/apy-mainnet-constants";

interface ApproveAndSimulateButtonProps {
    tokenAddress: string | undefined;
    tokenName: string | undefined;
    trancheAddress: string | undefined;
    formErrors: {[fieldName: string]: string | undefined};
    amount: number | undefined;
}


export const ApproveAndSimulateButton: React.FC<ApproveAndSimulateButtonProps & ButtonProps> = (props) => {

    const { tokenAddress, tokenName, trancheAddress, formErrors, amount, ...rest} = props;

    return <BalancerApproval
        trancheAddress={trancheAddress}
        {...rest}
    >
            <SimulateButton 
                formErrors={formErrors}
                {...rest}
            />
    </BalancerApproval>
}

interface ApproveAndConfirmButtonProps {
    // tokenAddress: string | undefined;
    // tokenName: string | undefined;
    isLoading: boolean;
    handleExecuteTransaction: () => void;
}

export const ApproveAndConfirmButton: React.FC<ApproveAndConfirmButtonProps & ButtonProps> = (props) => {

    const {isLoading, handleExecuteTransaction, ...rest } = props;

    const selectedResult = useRecoilValue(selectedCalculatorGainSelector);

    if (!selectedResult){
        return <></>
    }

        return <ERC20Approval
            tokenAddress={selectedResult.inputs.baseTokenAddress}
            tokenName={selectedResult.spentTokens.baseTokens.name}
            approvalAddress={deployments.YieldTokenCompounding}
            amount={undefined}
            {...rest}
        >
            <Button
                onClick={handleExecuteTransaction}
                {...rest}
            >
                {isLoading ? <Spinner/> : "CONFIRM TRANSACTION"}
            </Button>
        </ERC20Approval>
}

interface SimulateButtonProps {
    formErrors: {[fieldName: string]: string | undefined}
}

export const SimulateButton: React.FC<SimulateButtonProps & ButtonProps> = (props) => {
    const isSimulating = useRecoilValue(isSimulatingAtom)

    const isSimulated = useRecoilValue(isSimulatedSelector)

    const { formErrors, ...rest} = props;

    const areNoErrors =  Object.values(formErrors).every((error) => {
            return !error
        })

    return <Button
        id="approve-calculate-button"
        type="submit"
        {...rest}
        disabled={!areNoErrors}
    >
        {
            isSimulating ? 
                <Spinner/> : 
                isSimulated ? 
                    "RE-SIMULATE" :
                    "SIMULATE"
            
        }
    </Button>
}