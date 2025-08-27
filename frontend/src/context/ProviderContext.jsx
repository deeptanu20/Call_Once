import { createContext, useState, useContext } from 'react';

const ProviderContext = createContext();

export const ProviderProvider = ({ children }) => {
  const [providerDetails, setProviderDetails] = useState(null);

  return (
    <ProviderContext.Provider value={{ providerDetails, setProviderDetails }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProviderContext = () => useContext(ProviderContext);