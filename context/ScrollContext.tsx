import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

export const ScrollContext = createContext<SharedValue<number> | null>(null);
export const useScrollContext = () => useContext(ScrollContext);
