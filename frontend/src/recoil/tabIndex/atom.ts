import { atom } from "recoil";

// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

// This atom is used to store the tab index for YTC

export const tabIndexAtom = atom({
  key: "tabIndex",
  default: 0,
});
