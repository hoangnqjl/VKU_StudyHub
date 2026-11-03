import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { CustomAlert, AlertType, AlertAction } from './CustomAlert';

interface AlertOptions {
  type?: AlertType;
  title: string;
  message: string;
  actions?: AlertAction[];
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showError: (title: string, message: string, onOk?: () => void) => void;
  showSuccess: (title: string, message: string, onOk?: () => void) => void;
  showWarning: (title: string, message: string, onOk?: () => void) => void;
  showInfo: (title: string, message: string, onOk?: () => void) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    isDestructive?: boolean
  ) => void;
  hideAlert: () => void;
}

const defaultAlertContext: AlertContextType = {
  showAlert: (options) => {
    Alert.alert(options.title, options.message);
  },
  showError: (title, message, onOk) => {
    Alert.alert(title || 'Đã có lỗi xảy ra', message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  },
  showSuccess: (title, message, onOk) => {
    Alert.alert(title || 'Thành công', message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  },
  showWarning: (title, message, onOk) => {
    Alert.alert(title || 'Cảnh báo', message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  },
  showInfo: (title, message, onOk) => {
    Alert.alert(title || 'Thông tin', message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  },
  showConfirm: (title, message, onConfirm, confirmText = 'Xác nhận', isDestructive = false) => {
    Alert.alert(title, message, [
      { text: confirmText, onPress: onConfirm, style: isDestructive ? 'destructive' : 'default' },
      { text: 'Hủy bỏ', style: 'cancel' },
    ]);
  },
  hideAlert: () => {},
};

const AlertContext = createContext<AlertContextType>(defaultAlertContext);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertOptions & { visible: boolean }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    actions: [],
  });

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAlert = useCallback(
    ({ type = 'info', title, message, actions }: AlertOptions) => {
      setAlertConfig({
        visible: true,
        type,
        title,
        message,
        actions: actions || [{ text: 'Đã hiểu', style: 'default' }],
      });
    },
    []
  );

  const showError = useCallback(
    (title: string, message: string, onOk?: () => void) => {
      showAlert({
        type: 'error',
        title: title || 'Đã có lỗi xảy ra',
        message,
        actions: [{ text: 'Đóng', style: 'default', onPress: onOk }],
      });
    },
    [showAlert]
  );

  const showSuccess = useCallback(
    (title: string, message: string, onOk?: () => void) => {
      showAlert({
        type: 'success',
        title: title || 'Thành công',
        message,
        actions: [{ text: 'Xong', style: 'default', onPress: onOk }],
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, onOk?: () => void) => {
      showAlert({
        type: 'warning',
        title: title || 'Cảnh báo',
        message,
        actions: [{ text: 'Đã hiểu', style: 'default', onPress: onOk }],
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, onOk?: () => void) => {
      showAlert({
        type: 'info',
        title: title || 'Thông tin',
        message,
        actions: [{ text: 'Đã hiểu', style: 'default', onPress: onOk }],
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText = 'Xác nhận',
      isDestructive = false
    ) => {
      showAlert({
        type: isDestructive ? 'error' : 'warning',
        title,
        message,
        actions: [
          {
            text: confirmText,
            style: isDestructive ? 'destructive' : 'default',
            onPress: onConfirm,
          },
          { text: 'Hủy bỏ', style: 'cancel' },
        ],
      });
    },
    [showAlert]
  );

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showError,
        showSuccess,
        showWarning, showInfo,
        showConfirm,
        hideAlert,
      }}
    >
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext) || defaultAlertContext;
};
