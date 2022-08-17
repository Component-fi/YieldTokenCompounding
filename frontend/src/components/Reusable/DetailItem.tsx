import { Flex, Text } from "@chakra-ui/layout";

interface DetailItemProps {
  name: string | React.ReactElement;
  value: string | React.ReactElement;
}

export const DetailItem: React.FC<DetailItemProps> = (props) => {
  const { name, value } = props;

  return (
    <Flex flexDir="row" justify="space-between" gridGap={4} alignItems="center">
      <div>{name}</div>
      <div>{value}</div>
    </Flex>
  );
};
