import { useEffect, useState } from "react";

const OFAC_JSON_LIST_URL = 'https://gist.githubusercontent.com/mattiaslightstone/a503b2e3025f575d79ab60f2dd97498f/raw/5ee2ac067d88be844d09acdb5f1ee1faa7bf3a35/OFAC_ETH_ADDRESSES.json';

export const useOfac = (address: string): {isLoading: boolean, isBanned: boolean} => {
  // fetch the OFAC list on first load
  // filter the OFAC list to get the ETH addresses starting with 0x
  const [ofacAddresses, setOfacAddresses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getLowerCaseOfacAddresses().then((_lowerCaseOfacAddresses: string[]) => {
      setOfacAddresses((_lowerCaseOfacAddresses));
      setIsLoading(false);
    })
  }, [])

  // checks if the address is on the banned list
  // it's a short array at the moment, so we can probably just use an includes
  const isBanned = ofacAddresses.includes(address.toLowerCase())

  return {isLoading, isBanned};
}

const getLowerCaseOfacAddresses = async (): Promise<string[]> => {
  const response = await fetch(OFAC_JSON_LIST_URL);
  const json = await response.json();
  if (!json){
    return [];
  }
  return json.map((address: string) => address.toLowerCase()) as string[];
}