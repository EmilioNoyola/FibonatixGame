// Componente de las Alertas Personalizadas
import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

  const CustomAlert = ({
    showAlert,
    title, 
    message, 
    confirmText, 
    cancelText, 
    onCancel, 
    onConfirm, 
    closeOnTouchOutside, 
    closeOnHardwareBackPress,
    confirmButtonColor, 
    cancelButtonColor, 
  }) => {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={title}
        message={message}
        closeOnTouchOutside={!!closeOnTouchOutside}
        closeOnHardwareBackPress={!!closeOnHardwareBackPress}
        showConfirmButton={true}
        showCancelButton={!!onCancel}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmButtonColor={confirmButtonColor}
        cancelButtonColor={cancelButtonColor}
        onConfirmPressed={onConfirm}
        onCancelPressed={onCancel} 
      />
    );
  };

export default CustomAlert;
