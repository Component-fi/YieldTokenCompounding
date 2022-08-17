import * as React from "react";
import { Link } from "react-router-dom";
import WalletSettings from "@/components/Web3/Wallet/Settings";
// @ts-ignore
import componentLogo from "@/images/Logo_Dot_Color_Main_Orange.svg";
import { Flex, Icon } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <Flex
      id="header"
      flexDir={{
        base: "column",
        md: "row",
      }}
      gridGap={2}
      justify="space-between"
      align="center"
    >
      <Flex
        id="logo"
        flexDir="row"
        justify={{
          base: "center",
          md: "start",
        }}
        flexShrink={0}
        flexGrow={{ md: 1 }}
      >
        <Link to="/ytc">
          <img
            src={componentLogo}
            alt={"Component Logo"}
            className="h-8 w-30"
          />
        </Link>
      </Flex>
      <Flex
        flexDir="row"
        justifyContent={{
          base: "center",
          md: "end",
        }}
        alignItems="center"
        flex={{ md: 1 }}
        gridGap={1}
      >
        <WalletSettings icon={<GearIcon />} />
        {/*<Wallet />*/}
        <ConnectButton/>
      </Flex>
    </Flex>
  );
};

const GearIcon = () => {
  return (
    <Flex
      p={2}
      justifyContent="center"
      alignItems="center"
      tabIndex={0}
      rounded="full"
      cursor="pointer"
    >
      {/** This is a gear icon */}
      <Icon
        viewBox="0 0 20 20"
        color="text.primary"
        h={5}
        w={5}
        stroke="text.primary"
        fill="text.primary"
      >
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </Icon>
    </Flex>
  );
};

export default Header;
