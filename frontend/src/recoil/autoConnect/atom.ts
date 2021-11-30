import {atom, AtomEffect} from 'recoil';
// This is a recoil atom
// Atoms are pieces of state that can be accessed and or modified by various components through a set of hooks

const localStorageEffect = (key: string): AtomEffect<boolean> => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  
    onSet((newValue, _) => {
        localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  
export const autoConnectAtom = atom({
    key: 'autoConnect',
    default: false,
    effects_UNSTABLE: [
        localStorageEffect('autoConnect'),
    ]
});