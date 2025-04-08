// apis/FirebaseService.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs, 
    setDoc, 
    doc, 
    runTransaction, 
    updateDoc 
} from "firebase/firestore";

// Inicialización de servicios Firebase
const auth = getAuth();
const db = getFirestore();

// Servicios de Autenticación
export const authService = {
    login: (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    },
    
    register: (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    },
    
    getCurrentUser: () => {
        return auth.currentUser;
    }
};

// Servicios de Usuario
export const userService = {
    // Buscar usuario por nombre de usuario
    findUserByUsername: async (username) => {
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].data();
            }
            return null;
        } catch (error) {
            console.error("Error al buscar usuario:", error);
        }
    },
    
    // Verificar si existe un nombre de usuario
    usernameExists: async (username) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error al verificar usuario:", error);
        }
    },
    
    // Crear un nuevo usuario en Firestore
    createUser: async (userId, userData) => {
        try {
            await setDoc(doc(db, "users", userId), userData);
            return true;
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }
};

// Servicios de Códigos de Activación
export const activationCodeService = {
    // Verificar si un código es válido
    verifyCode: async (code) => {
        if (!code) return false;
    
        try {
            const codeRef = collection(db, "activationCodes");
            const q = query(codeRef, where("code", "==", code), where("used", "==", false));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) return false;
    
            // Devuelve la referencia del documento del código de activación
            return querySnapshot.docs[0].ref;
        } catch (error) {
            console.error("Error al verificar código:", error);
        }
    },
    
    // Marcar un código como usado en una transacción
    markCodeAsUsed: async (codeRef, userId) => {
        try {
            await updateDoc(codeRef, { 
                used: true,
                usedBy: userId,
                redeemedAt: new Date().toISOString() 
            });
            return true;
        } catch (error) {
            console.error("Error al marcar código como usado:", error);
        }
    }
};

// Función para registro completo (transacción)
export const registerWithCode = async (username, email, password, activationCode) => {
    try {
        // Verificar código de activación
        const codeDocRef = await activationCodeService.verifyCode(activationCode);
        if (!codeDocRef) {
            console.log("Código de activación inválido");
        }
        
        // Ejecutar una transacción para garantizar la actualización atómica
        return await runTransaction(db, async (transaction) => {
            const codeDoc = await transaction.get(codeDocRef);
            if (!codeDoc.exists() || codeDoc.data().used) {
                console.log("Código inválido o ya utilizado");
            }
            
            // Crear la cuenta en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Guardar el usuario en Firestore
            transaction.set(doc(db, "users", userCredential.user.uid), {
                username,
                email,
                activationCode,
                license: 3
            });
            
            // Marcar el código de activación como usado
            transaction.update(codeDocRef, { 
                used: true,
                usedBy: userCredential.user.uid,
                redeemedAt: new Date().toISOString() 
            });
            
            return userCredential;
        });
    } catch (error) {
        console.error("Error en transacción de registro:", error);
    }
};

// Función para mapear códigos de error de Firebase
export const getAuthErrorType = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email': return 'invalidEmail';
        case 'auth/email-already-in-use': return 'emailInUse';
        case 'auth/weak-password': return 'weakPassword';
        case 'auth/wrong-password': return 'wrongPassword';
        case 'auth/user-not-found': return 'userNotFound';
        case 'auth/too-many-requests': return 'tooManyRequests';
        default: return 'unknown';
    }
};