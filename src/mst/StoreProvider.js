import React from 'react';
import store from './';

export const StoreContext = React.createContext(store);

const StoreProvider = ({children}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
