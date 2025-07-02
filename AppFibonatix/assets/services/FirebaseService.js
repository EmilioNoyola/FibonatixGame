// Funciones para la interacción con Firebase.
import '../services/Credentials';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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

const auth = getAuth();
const db = getFirestore();

export const authService = {
    login: (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    },
    
    register: (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    },
    
    getCurrentUser: () => {
        return auth.currentUser;
    },
    
    resetPassword: (email) => {
        return sendPasswordResetEmail(auth, email);
    }
};

export const userService = {
    usernameExists: async (username) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error al verificar usuario:", error);
            throw error;
        }
    },
    
    createUser: async (userId, userData) => {
        try {
            await setDoc(doc(db, "users", userId), userData);
            return true;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    }
};

export const activationCodeService = {
    verifyCode: async (code) => {
        if (!code) return false;
    
        try {
            const codeRef = collection(db, "activationCodes");
            const q = query(codeRef, where("code", "==", code), where("used", "==", false));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) return false;
    
            return querySnapshot.docs[0].ref;
        } catch (error) {
            console.error("Error al verificar código:", error);
            throw error;
        }
    },
    
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
            throw error;
        }
    }
};

export const registerWithCode = async (username, email, password, activationCode) => {
    try {
        const codeDocRef = await activationCodeService.verifyCode(activationCode);
        if (!codeDocRef) {
            throw new Error("Código de activación inválido");
        }
        
        return await runTransaction(db, async (transaction) => {
            const codeDoc = await transaction.get(codeDocRef);
            if (!codeDoc.exists() || codeDoc.data().used) {
                throw new Error("Código inválido o ya utilizado");
            }
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            transaction.set(doc(db, "users", userCredential.user.uid), {
                username,
                email,
                activationCode,
                license: 3
            });
            
            transaction.update(codeDocRef, { 
                used: true,
                usedBy: userCredential.user.uid,
                redeemedAt: new Date().toISOString() 
            });
            
            return userCredential;
        });
    } catch (error) {
        console.error("Error en transacción de registro:", error);
        throw error;
    }
};

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