import axios from "axios";

export const fetchElementState = async (chainName: string) => {
  const MAINNET_ELEMENT_CONSTANTS_URL =
    "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/mainnet.json";
  const GOERLI_ELEMENT_CONSTANTS_URL =
    "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/goerli.json";

  let url = MAINNET_ELEMENT_CONSTANTS_URL;

  if (chainName === "goerli") {
    url = GOERLI_ELEMENT_CONSTANTS_URL;
  }

  const response = await axios.get(url);

  const jsonData = await response.data;

  return jsonData;
};
