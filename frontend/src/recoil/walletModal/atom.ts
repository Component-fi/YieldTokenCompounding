import { atom } from "recoil";
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom keeps track of if the connect wallet modal is open

export const walletModalAtom = atom<boolean>({
  key: "walletModal",
  default: false,
});
