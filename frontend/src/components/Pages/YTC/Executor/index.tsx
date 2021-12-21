import { Flex, FormLabel } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
import { slippageToleranceAtom } from "recoil/transactionSettings/atom";
import { selectedCalculatorGainSelector } from "recoil/simulationResults/atom";
import Card from "components/Reusable/Card";
import { TokenResult } from "./TokenResult";
import { ExecutionDetails } from "./ExecutionDetails";
import { ExposureBar } from "./ExposureBar";

export interface ExecutionProps {}

export const Execution: React.FC<ExecutionProps> = () => {
  const executorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (executorRef.current) {
      executorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [executorRef]);

  return (
    <Flex ref={executorRef} id="execution" py={5} flexDir="column" gridGap={3}>
      <ExecutionCard />
    </Flex>
  );
};

interface ExecutionCardProps {}

const ExecutionCard: React.FC<ExecutionCardProps> = () => {
  const slippageTolerance = useRecoilValue(slippageToleranceAtom);

  const selectedResult = useRecoilValue(selectedCalculatorGainSelector);

  if (!selectedResult) {
    return <></>;
  }
  const minimumReceived =
    selectedResult.receivedTokens.yt.amount * (1 - slippageTolerance / 100);

  return (
    <Card>
      <Flex
        id="outputs"
        flexDir="column"
        alignItems="stretch"
        gridGap={3}
        p={2}
      >
        <FormLabel
          flexDir="row"
          justify="center"
          alignItems="center"
          alignSelf="center"
        >
          <Flex flexDir="row" alignItems="center" gridGap={2}>
            Review Your Transaction
          </Flex>
        </FormLabel>
        <Flex flexDir="column" w="full">
          <FormLabel>Input</FormLabel>
          <TokenResult
            tokenType="BaseToken"
            trancheAddress={selectedResult.inputs.trancheAddress}
            token={{
              name: selectedResult.spentTokens.baseTokens.name,
              amount:
                selectedResult.spentTokens.baseTokens.amount +
                selectedResult.receivedTokens.baseTokens.amount,
            }}
          />
        </Flex>
        <Flex flexDir="column" w="full">
          <FormLabel>Output</FormLabel>
          <Flex flexDir="column" gridGap={1}>
            <TokenResult
              tokenType="BaseToken"
              trancheAddress={selectedResult.inputs.trancheAddress}
              token={{
                name: selectedResult.receivedTokens.baseTokens.name,
                amount: selectedResult.receivedTokens.baseTokens.amount,
              }}
            />
            <TokenResult
              tokenType="YToken"
              trancheAddress={selectedResult.inputs.trancheAddress}
              token={{
                name: selectedResult.receivedTokens.yt.name,
                amount: selectedResult.receivedTokens.yt.amount,
              }}
              baseTokenName={selectedResult.receivedTokens.baseTokens.name}
            />
          </Flex>
        </Flex>
        <Flex mx={{ base: 2, sm: 16 }}>
          <ExposureBar
            // equivalent to baseTokensSpent
            tokensSpent={selectedResult.spentTokens.baseTokens.amount}
            trancheAddress={selectedResult.inputs.trancheAddress}
            minimumYTokensReceived={minimumReceived}
            baseTokenName={selectedResult.receivedTokens.baseTokens.name}
          />
        </Flex>
        <ExecutionDetails
          slippageTolerance={slippageTolerance}
          estimatedGas={selectedResult.gas.eth}
          netGain={selectedResult.gain?.netGain}
          roi={selectedResult.gain?.roi}
          apr={selectedResult.gain?.apr}
          minimumReceived={minimumReceived}
          expectedReturn={selectedResult.gain?.estimatedRedemption}
          baseTokenName={selectedResult.spentTokens.baseTokens.name}
          trancheAddress={selectedResult.inputs.trancheAddress}
        />
      </Flex>
    </Card>
  );
};
