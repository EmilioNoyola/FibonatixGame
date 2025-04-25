import React from 'react';
import CustomAlert from '../../../assets/components/CustomAlert';

const alertMessages = {
    emptyFields: { title: "Campos vacíos", message: "Por favor, completa todos los campos." },
    usernameTaken: { title: "Nombre de Usuario Inválido", message: "Este nombre de usuario ya está en uso." },
    invalidEmail: { title: "Correo Electrónico Inválido", message: "Por favor, ingresa un correo válido." },
    emailInUse: { title: "Correo Electrónico en Uso", message: "Este correo electrónico ya está en uso." },
    weakPassword: { title: "Contraseña Inválida", message: "La contraseña debe tener al menos 6 caracteres." },
    registerError: { title: "Error de Registro", message: "Hubo un problema con el registro. Intenta de nuevo." },
    registerSuccess: { title: "Registro Exitoso", message: "Registro completado con éxito. Por favor, inicia sesión." },
    invalidCode: { title: "Código de Activación Inválido", message: "El código de activación no es válido o ya ha sido usado." },
    serverRegisterError: { title: "Error del Servidor", message: "No se pudo completar el registro en el servidor. Intenta de nuevo." },
    dataFetchError: { title: "Error de Datos", message: "No se pudieron obtener los datos del usuario. Intenta de nuevo." },
    userNotFound: { title: "Usuario Inexistente", message: "Por favor, ingresa un Usuario válido." },
    wrongPassword: { title: "Contraseña Incorrecta", message: "Por favor, inténtalo de nuevo." },
    loginError: { title: "Error de Inicio de Sesión", message: "Hubo un problema al iniciar sesión. Intenta de nuevo." },
    loginSuccess: { title: "¡Bienvenido!", message: "Haz iniciado sesión correctamente." },
    searchError: { title: "Error en la Búsqueda de Usuario", message: "Por favor, inténtalo de nuevo." },
};

const AuthAlertHandler = ({ alertType, visible, onConfirm, onCancel }) => {
    if (!alertType || !visible) return null;

    const { title, message } = alertMessages[alertType] || { title: "Alerta", message: "" };

    return (
        <CustomAlert
            showAlert={visible}
            title={title}
            message={message}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmButtonColor="#0B5A39"
            confirmText="Aceptar"
        />
    );
};

export default AuthAlertHandler;