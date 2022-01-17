import { useEffect } from "react";
import { Button, Text, Flex } from "@chakra-ui/react";
import { chainNameAtom } from "recoil/chain/atom";
import { useRecoilState } from "recoil";
import { Modal } from "./Modal";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { walletModalAtom } from "recoil/walletModal/atom";

interface Props {}

export const Wallet = (props: Props) => {
  const [isOpen, setIsOpen] = useRecoilState(walletModalAtom);
  const web3React = useWeb3React();

  const [chainName, setChainName] = useRecoilState(chainNameAtom);

  // Set the network name when connected
  useEffect(() => {
    const provider = web3React.library as Web3Provider;

    provider?.getNetwork().then(({ name }) => {
      if (name === "homestead") {
        setChainName("mainnet");
      } else {
        setChainName(name);
      }
    });
  }, [web3React.active, setChainName, web3React.library]);

  const shortenAddress = (address: string): string => {
    return address.slice(0, 6) + "...." + address.slice(-4);
  };

  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {web3React.active ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex justifyContent="space-between" alignItems="center">
            <Text pr={2} color="text.primary">
              {chainName}
            </Text>
          </Flex>
          <Button
            onClick={() => setIsOpen(true)}
            fontSize={"sm"}
            fontWeight={600}
            color=""
            bg={"card"}
            href={"#"}
            _hover={{
              bg: "primary.hover",
            }}
          >
            {shortenAddress(web3React.account || "")}
          </Button>
        </Flex>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          display={{ md: "inline-flex" }}
          fontSize={"sm"}
          fontWeight={600}
          color="text.secondary"
          bg="main.primary"
          href={"#"}
          _hover={{
            bg: "main.primary_hover",
          }}
        >
          CONNECT WALLET
        </Button>
      )}
    </div>
  );
};

export default Wallet;
