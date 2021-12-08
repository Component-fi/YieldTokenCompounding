import { InfoOutlineIcon } from "@chakra-ui/icons";
import { IconProps, Tooltip } from "@chakra-ui/react";

interface InfoTooltipProps {
  label: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps & IconProps> = (props) => {
  const { label, ...rest } = props;

  return (
    <Tooltip label={label}>
      <InfoOutlineIcon
        _hover={{
          color: "component.blue",
        }}
        {...rest}
      />
    </Tooltip>
  );
};
