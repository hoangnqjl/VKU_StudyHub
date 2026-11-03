import React, { createContext, useContext, useState, useCallback } from 'react';
import { LoadingIndicator } from './LoadingIndicator';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const defaultLoadingContext: LoadingContextType = {
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
};

const LoadingContext = createContext<LoadingContextType>(defaultLoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: 'Đang tải...',
  });

  const showLoading = useCallback((message = 'Đang tải...') => {
    setLoading({ visible: true, message });
  }, []);

  const hideLoading = useCallback(() => {
    setLoading((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        showLoading,
        hideLoading,
        isLoading: loading.visible,
      }}
    >
      {children}
      <LoadingIndicator visible={loading.visible} message={loading.message} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext) || defaultLoadingContext;
};
