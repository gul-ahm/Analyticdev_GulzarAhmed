'use client';

import { createContext, useContext } from 'react';
import Lenis from 'lenis';

interface ScrollContextType {
    lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextType>({
    lenis: null,
});

export const useScroll = () => useContext(ScrollContext);

export default ScrollContext;
