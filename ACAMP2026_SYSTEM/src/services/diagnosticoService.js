import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

export const saveDiagnosticResult = async (userId, resultData) => {
    try {
        const userRef = doc(db, 'users', userId);

        const newResult = {
            date: Timestamp.now(),
            ...resultData
        };

        await updateDoc(userRef, {
            diagnostico: arrayUnion(newResult),
            lastDiagnostico: newResult
        });

        return true;
    } catch (error) {
        console.error("Error saving diagnostic result: ", error);
        throw error;
    }
};

export const getLastQuizResult = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && docSnap.data().lastDiagnostico) {
            return docSnap.data().lastDiagnostico;
        }
        return null;
    } catch (error) {
        console.error("Error getting quiz result: ", error);
        return null;
    }
};
