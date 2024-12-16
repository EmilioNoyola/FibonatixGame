// Alertas Personalizadas
import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

  const CustomAlert = ({
    showAlert,
    title, // Título de la alerta
    message, // Mensaje de la alerta
    confirmText, // Texto del botón confirm
    cancelText, // Texto del botón cancel
    onCancel,  // Función para cancelar
    onConfirm, // Función para confirmar
    closeOnTouchOutside, 
    closeOnHardwareBackPress,
    confirmButtonColor, // Color del botón confirmar.
    cancelButtonColor, // Color del botón cancelar.
  }) => {
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={title}
        message={message}
        closeOnTouchOutside={!!closeOnTouchOutside}
        closeOnHardwareBackPress={!!closeOnHardwareBackPress}  // Asegura que se puede cerrar con el botón de hardware
        showConfirmButton={true}
        showCancelButton={!!onCancel}  // Solo mostrar botón cancelar si la función existe
        confirmText={confirmText}
        cancelText={cancelText}
        confirmButtonColor={confirmButtonColor}
        cancelButtonColor={cancelButtonColor}
        onConfirmPressed={onConfirm}
        onCancelPressed={onCancel}  // Acción de cancelar
      />
    );
  };

export default CustomAlert;
