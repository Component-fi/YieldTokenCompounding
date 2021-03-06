import { useState } from "react";
import {
  Flex,
  Button,
  Collapse,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputGroup,
  Input,
  InputRightAddon,
  Text,
  FormLabel,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useRecoilValue } from "recoil";
import { trancheSelector } from "recoil/trancheRates/atom";
import { getCompoundsFromTargetExposure } from "api/ytc/simulate";
import { FormFields } from "..";
import { InfoTooltip } from "components/Reusable/Tooltip";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import copy from "constants/copy.json";

export const AdvancedCollapsable: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  const handleToggle = () => setShow(!show);

  return (
    <Flex flexDir="column" alignItems="center">
      <Button variant="link" onClick={handleToggle} gridGap={2}>
        {show ? <ChevronDownIcon /> : <ChevronRightIcon />}
        {show ? "Hide" : "Show"} Advanced Options
        <InfoTooltip label={copy.tooltips.advanced_options} h={3} w={3} />
      </Button>
      <Collapse in={show}>
        <FormLabel mt={3} flexDir="row" justify="center" alignItems="center">
          <Text textAlign="center">Number of Compounds</Text>
        </FormLabel>
        <NumberCompoundsField />
      </Collapse>
    </Flex>
  );
};

// eslint-disable-next-line
const AdvancedForm = () => {
  return (
    <Flex flexDir="column" alignItems="center">
      <Tabs>
        <TabList>
          <Tab>Number of Compounds</Tab>
          <Tab>Percentage Exposure</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <NumberCompoundsField />
          </TabPanel>
          <TabPanel>
            <PercentageExposureField />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

const PercentageExposureField = () => {
  const formik = useFormikContext<FormFields>();

  const trancheRate = useRecoilValue(
    trancheSelector(formik.values.trancheAddress || "null")
  );
  const fixedRate: number | undefined = trancheRate.fixed;
  const daysRemaining: number | undefined = trancheRate.daysRemaining;

  // Set the number of compounds based on the desired target exposure
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    formik.handleChange(e);
    if (fixedRate && daysRemaining) {
      const estimatedCompounds = getCompoundsFromTargetExposure(
        fixedRate,
        parseFloat(e.target.value),
        daysRemaining
      );
      formik.setFieldValue("compounds", estimatedCompounds);
    }
  };

  return (
    <InputGroup bgColor="input_bg" rounded="2xl">
      <Input
        type="number"
        name="percentExposure"
        onBlur={formik.handleBlur}
        value={formik.values.percentExposure}
        // variant="filled"
        placeholder={"0"}
        onChange={handleChange}
        id="amount-input"
      />
      <InputRightAddon bgColor="input_bg" color="text.primary">
        <Text id="amount-token-label" fontSize="2xl" whiteSpace="nowrap">
          %
        </Text>
      </InputRightAddon>
    </InputGroup>
  );
};

const NumberCompoundsField = () => {
  const formik = useFormikContext<FormFields>();

  return (
    <InputGroup bgColor="input_bg" rounded="2xl">
      <Input
        type="number"
        name="compounds"
        onBlur={formik.handleBlur}
        value={formik.values.compounds}
        max={30}
        min={1}
        placeholder={"0"}
        onChange={formik.handleChange}
        id="amount-input"
      />
      <InputRightAddon bgColor="input_bg" color="text.primary">
        Compounds
      </InputRightAddon>
    </InputGroup>
  );
};
