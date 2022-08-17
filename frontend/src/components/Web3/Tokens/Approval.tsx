import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { ButtonProps, Spinner } from "@chakra-ui/react";
import { Button } from "@/components/Reusable/Button";
import { checkApproval, sendApproval } from "@/api/approvalAPI";
import { BigNumber, ContractReceipt, utils, providers } from "ethers";
import { notificationAtom } from "@/recoil/notifications/atom";
import { useRecoilState } from "recoil";
import { deployments } from "@/constants/apy-mainnet-constants";
import { Web3Provider } from "@ethersproject/providers";
import { ERC20__factory } from "@/hardhat/typechain/factories/ERC20__factory";
import { YieldTokenCompounding__factory } from "@/hardhat/typechain/factories/YieldTokenCompounding__factory";
import { MAX_UINT_HEX } from "@/constants/static";
import { walletModalAtom } from "@/recoil/walletModal/atom";
import { useAccount, useProvider, useSigner } from "wagmi";
import { YieldTokenCompounding } from "@/hardhat/typechain";

type AbstractApprovalProps = {
  approveText: string;
  approvalMessage: string;
  children: ReactElement;
  isLoading: boolean;
  setIsLoading: (bool: boolean) => void;
  isApproved: boolean;
  provider: providers.Provider | undefined;
  handleCheckApproval: () => Promise<void>;
  handleApprove: () => Promise<ContractReceipt>;
} & ButtonProps;

// An approval button that checks whether a wallet is connected, then checks whether a specific token has been approved
// If the token has not been approved, the button will trigger an approval transaction
// At the moment it is hardcoded for maxint approval
const AbstractApproval: React.FC<AbstractApprovalProps> = (props) => {
  const {
    approveText,
    approvalMessage,
    children,
    handleCheckApproval,
    handleApprove,
    provider,
    isLoading,
    isApproved,
    setIsLoading,
    ...rest
  } = props;

  const openWalletModal = useRecoilState(walletModalAtom)[1];

  useEffect(() => {
    if (provider) {
      handleCheckApproval();
    }
  }, [provider, handleCheckApproval]);

  const setNotification = useRecoilState(notificationAtom)[1];

  const abstractHandleApprove = () => {
    handleApprove()
      .then((receipt) => {
        setNotification((currentNotifications) => {
          return [
            ...currentNotifications,
            {
              text: approvalMessage,
              type: "SUCCESS",
              linkText: "View on Explorer",
              link: `https://etherscan.io/tx/${receipt.transactionHash}`,
            },
          ];
        });
      })
      .catch((error) => {
        setNotification((currentNotifications) => {
          return [
            ...currentNotifications,
            {
              type: "ERROR",
              text: "Token Approval Failed",
              details: error,
            },
          ];
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!provider) {
    return (
      <Button {...rest} onClick={() => openWalletModal(true)}>
        CONNECT YOUR WALLET
      </Button>
    );
  }
  if (isLoading) {
    return (
      <Button {...rest} disabled>
        <Spinner />
      </Button>
    );
  }
  if (isApproved) {
    return children;
  }
  return (
    <Button {...rest} onClick={abstractHandleApprove}>
      {approveText}
    </Button>
  );
};

type ERC20ApprovalProps = {
  amount?: number | string;
  approvalAddress?: string;
  tokenAddress?: string;
  tokenName?: string;
  insufficientBalance?: boolean;
  children: ReactElement;
} & ButtonProps;

// An implementation of the approval button specifically for erc20 tokens
export const ERC20Approval: React.FC<ERC20ApprovalProps> = (props) => {
  const { address, isConnected } = useAccount()
  const {data: signer} = useSigner();
  const provider = useProvider()
  const {
    amount,
    approvalAddress,
    tokenAddress,
    tokenName,
    children,
    insufficientBalance,
    ...rest
  } = props;

  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckApproval = useCallback(async () => {
    if (tokenAddress && approvalAddress && signer && isConnected) {
      const tokenContract = ERC20__factory.connect(tokenAddress, signer);
      if (tokenContract) {
        let absoluteAmount;
        if (amount) {
          const decimals = await tokenContract.decimals();
          absoluteAmount = utils
            .parseUnits(amount.toString(), decimals)
            .toString();
        } else {
          absoluteAmount = MAX_UINT_HEX;
        }
        checkApproval(absoluteAmount, approvalAddress, address as string, tokenContract)
          .then((result) => {
            if (result) {
              setIsApproved(true);
            } else {
              setIsApproved(false);
            }
          })
          .catch((error: Error) => {
            console.error(error);
          });
      }
    }
  }, [address, isConnected, amount, approvalAddress, provider, tokenAddress]);

  const handleApprove: () => Promise<ContractReceipt> =
    useCallback(async () => {
      if (approvalAddress && tokenAddress && signer && isConnected) {
        setIsLoading(true);

        // send the approval request
        const tokenContract = ERC20__factory.connect(tokenAddress, signer);
        if (tokenContract) {
          let absoluteAmount;
          if (amount) {
            const decimals = await tokenContract.decimals();
            absoluteAmount = utils.parseUnits(amount.toString(), decimals);
          } else {
            absoluteAmount = MAX_UINT_HEX;
          }
          const receipt = await sendApproval(
            absoluteAmount.toString(),
            approvalAddress,
            tokenContract
          );
          handleCheckApproval();
          return receipt;
        }
      }
      throw new Error("Could not connect to token contract");
    }, [
      amount,
      tokenAddress,
      approvalAddress,
      handleCheckApproval,
      provider,
      isConnected,
      address
    ]);

  return (
    <AbstractApproval
      isLoading={isLoading}
      approvalMessage={`${tokenName?.toUpperCase()} approved`}
      isApproved={isApproved}
      setIsLoading={setIsLoading}
      handleApprove={handleApprove}
      handleCheckApproval={handleCheckApproval}
      disabled={insufficientBalance}
      approveText={
        !insufficientBalance
          ? amount
            ? `Approve ${amount} ${tokenName?.toUpperCase()}`
            : `Approve ${tokenName?.toUpperCase()}`
          : "Insufficient Balance"
      }
      provider={provider}
      {...rest}
    >
      {children}
    </AbstractApproval>
  );
};

interface BalancerApprovalProps {
  trancheAddress: string | undefined;
  children: ReactElement;
}

// An implementation of the approval button specifically for approving a balancer pool to use funds from the YTC contract
export const BalancerApproval: React.FC<BalancerApprovalProps> = (props) => {
  const { trancheAddress, children, ...rest } = props;

  const { data: signer } = useSigner()
  const provider = useProvider()
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let ytc: YieldTokenCompounding | undefined= undefined;
  if (signer){
    ytc = YieldTokenCompounding__factory.connect(
      deployments.YieldTokenCompounding,
      signer
    );
  } else {
    ytc = undefined;
  }

  const handleCheckApproval = useCallback(async () => {
    if (trancheAddress && ytc) {
      const allowance = await ytc.checkTranchePTAllowanceOnBalancer(
        trancheAddress
      );
      if (allowance?.eq(BigNumber.from(MAX_UINT_HEX))) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    }
  }, [trancheAddress, ytc]);

  const handleApprove: () => Promise<ContractReceipt> =
    useCallback(async () => {
      if (trancheAddress && ytc) {
        setIsLoading(true);
        const tx = await ytc.approveTranchePTOnBalancer(trancheAddress);
        if (tx) {
          const receipt = await tx.wait();
          await handleCheckApproval();
          return receipt;
        }
      }
      throw new Error("Could not approve balancer pool");
    }, [trancheAddress, handleCheckApproval, ytc]);

  if (!trancheAddress) {
    return (
      <Button {...rest} disabled>
        Select a Tranche
      </Button>
    );
  }

  return (
    <AbstractApproval
      isLoading={isLoading}
      isApproved={isApproved}
      setIsLoading={setIsLoading}
      handleApprove={handleApprove}
      handleCheckApproval={handleCheckApproval}
      approveText="Approve Balancer Pool"
      approvalMessage="Balancer Pool Approved"
      provider={provider}
      {...rest}
    >
      {children}
    </AbstractApproval>
  );
};
