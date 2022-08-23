import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import Card from "@/components/Reusable/Card";
import { Spinner } from "@/components/Reusable/Spinner";
import { Select } from "@/components/Reusable/Select";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { FormFields } from ".";
import { activeTokensSelector } from "@/recoil/element/atom";
import { Tranche } from "@/types/manual/types";
import { BaseTokenPriceTag } from "@/components/Web3/Prices";
import { InfoTooltip } from "@/components/Reusable/Tooltip";
import { TokenIcon } from "@/components/Web3/Tokens/TokenIcon";
import { AdvancedCollapsable } from "./Advanced";
import { ApproveAndSimulateButton } from "./ApproveAndSimulateButton";
import { TrancheDetails } from "@/components/Pages/YTC/Tranche";
import { useBalance } from "@/hooks";
import {
  useClearSimOnLocationChange,
  useSimulate,
  useSetFormikValueToQueryParam,
  useSetQueryParamToFormikValue,
  useClearSimOnFormikChange,
  useTokenName,
  useTranches,
} from "./hooks";
import copy from "@/constants/copy.json";

interface FormProps {}

export const Form: React.FC<FormProps> = () => {
  // get the simulation function based on current context
  const handleSimulate = useSimulate();

  const { values, errors, handleChange, setFieldValue, handleBlur } =
    useFormikContext<FormFields>();

  // fetching the token address and token name
  const tokenAddress = values.tokenAddress;
  const tokenName = useTokenName(tokenAddress);

  const tokens = useRecoilValue(activeTokensSelector);

  // load the active tranches for the currently selected token
  const tranches: Tranche[] | undefined = useTranches(tokenAddress);

  // These two hooks sync up the tokenAddress formik field, with the base_token query parameter
  useSetFormikValueToQueryParam(
    "base_token",
    "tokenAddress",
    tokens[0]?.address
  );
  useSetQueryParamToFormikValue("base_token", "tokenAddress");

  // These two hooks clear the simulations on the change of router location, or changes to the form inputs
  useClearSimOnLocationChange();
  useClearSimOnFormikChange();

  // sets the tranche address to the first value
  useEffect(() => {
    if (tranches) {
      setFieldValue("trancheAddress", tranches[0]?.address);
    }
  }, [setFieldValue, tranches]);

  //
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSimulate();
      }}
      onChange={handleChange}
    >
      <Card>
        <Flex id="tranche-select" flexDir="column" alignItems="center">
          <FormLabel>
            <Flex flexDir="row" alignItems="center" gridGap={2}>
              Term
              <InfoTooltip label={copy.tooltips.term} w={3} h={3} />
            </Flex>
          </FormLabel>
          <Flex
            id="selects"
            flexDir={{ base: "column", sm: "row" }}
            justify="center"
            alignItems="center"
            mb={4}
            gridGap={{ base: 2, sm: 6 }}
          >
            <Select name="tokenAddress" value={values.tokenAddress}>
              {tokens.map((token) => {
                return (
                  <option value={token.address} key={token.address}>
                    {token.name.toUpperCase()}
                  </option>
                );
              })}
            </Select>
            <Select name="trancheAddress" value={values.trancheAddress}>
              {tranches &&
                tranches.map((tranche: Tranche) => {
                  return (
                    <option value={tranche.address} key={tranche.address}>
                      {new Date(tranche.expiration * 1000).toLocaleDateString()}
                    </option>
                  );
                })}
            </Select>
          </Flex>
          {values.trancheAddress && values.tokenAddress && (
            <TrancheDetails
              trancheAddress={values.trancheAddress}
              tokenAddress={values.tokenAddress}
            />
          )}
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
          <FormLabel flexDir="row" justify="center" alignItems="center">
            <Flex flexDir="row" alignItems="center" gridGap={2}>
              Input Amount
              <InfoTooltip label={copy.tooltips.input_amount} h={3} w={3} />
            </Flex>
          </FormLabel>
          <Balance tokenAddress={tokenAddress} />
          <Flex
            id="amount-row"
            flexDir="row"
            justifyContent="end"
            width="full"
            rounded="xl"
            gridGap={2}
            p={1}
            _hover={{
              shadow: "inner",
            }}
          >
            <InputGroup bgColor="input_bg" rounded="2xl">
              <Input
                type="number"
                name="amount"
                onBlur={handleBlur}
                value={values.amount}
                placeholder={"0.0"}
                onChange={handleChange}
                id="amount-input"
              />
              <InputRightAddon bgColor="input_bg" color="text.primary">
                <Text
                  id="amount-token-label"
                  fontSize="2xl"
                  whiteSpace="nowrap"
                >
                  {tokenName?.toUpperCase()}
                </Text>
              </InputRightAddon>
            </InputGroup>
            <TokenIcon tokenName={tokenName} />
          </Flex>
          <Flex alignSelf="start" px={2} fontSize="sm" textColor="gray.500">
            <BaseTokenPriceTag
              baseTokenName={tokenName?.toUpperCase()}
              amount={values.amount}
            />
          </Flex>
        </Flex>
        <AdvancedCollapsable />
      </Card>
      <ApproveAndSimulateButton
        formErrors={errors}
        tokenAddress={values.tokenAddress}
        tokenName={tokenName}
        trancheAddress={values.trancheAddress}
        amount={values.amount}
      />
    </form>
  );
};

const Balance: React.FC<{ tokenAddress: string | undefined }> = (props) => {
  // fetched the balance for the specific token
  const balance = useBalance(props.tokenAddress);

  const { setFieldValue } = useFormikContext<FormFields>();

  // Sets the amount to the user's balance of the base token
  const handleMax: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setFieldValue("amount", balance);
  };

  return (
    <Flex
      id="balance-header"
      flexDir="row"
      gridGap={2}
      justify="space-between"
      alignItems="center"
      fontSize="sm"
      width="full"
    >
      <Flex alignItems="center" gridGap={1}>
        <Button
          id="max"
          onClick={handleMax}
          bg="gray.300"
          rounded="xl"
          fontSize="sm"
          py={0}
          h="20px"
          px={2}
          _hover={{
            bg: "gray.400",
          }}
        >
          MAX
        </Button>
        <Box id="balance-field">
          Balance: {balance !== undefined ? balance : <Spinner />}
        </Box>
      </Flex>
    </Flex>
  );
};
