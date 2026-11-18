import React from 'react';

// The page content is rendered inside a scrollable <main> instead of the window,
// components that need to observe or control scrolling use this element.
export const ScrollContainerContext = React.createContext<HTMLElement | null>(null);

export const useScrollContainer = () => React.useContext(ScrollContainerContext);
