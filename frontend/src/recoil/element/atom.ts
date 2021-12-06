import {atom, selector} from 'recoil'
import constants from '../../hardhat/mainnet-constants.json';
import { getBaseTokensWithActiveTranches } from "../../features/element";
import { Token } from '../../types/manual/types';

// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom is used to store the values of the element deployment addresses

export const elementAddressesAtom = atom({
  key: 'elementAddresses',
  default: constants,
})

export const activeTokensSelector = selector<Token[]>({
  key: 'activeTokens',
  get: async ({get}) => {
    const elementAddresses = get(elementAddressesAtom);
    
    const activeTokens =  await getBaseTokensWithActiveTranches(elementAddresses);

    return activeTokens;
  }
})
