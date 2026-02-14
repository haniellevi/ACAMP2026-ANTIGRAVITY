import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION = 'passaportes';

export const PassaporteService = {
    // Inicializa o passaporte se não existir
    async initPassaporte(userId, userName) {
        const docRef = doc(db, COLLECTION, userId);
        const docSnap = getDoc(docRef);

        if (!(await docSnap).exists()) {
            await setDoc(docRef, {
                userId,
                userName,
                selos: [], // IDs dos selos conquistados
                progresso: 0,
                patente: 'Recruta',
                pontos: 0,
                createdAt: new Date()
            });
        }
    },

    // Escuta mudanças no passaporte em tempo real (Offline First)
    subscribeToPassaporte(userId, callback) {
        const docRef = doc(db, COLLECTION, userId);
        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                callback(null);
            }
        });
    },

    // Desbloqueia um selo (ex: via QR Code ou Pin)
    async desbloquearSelo(userId, seloId, pontos = 10) {
        const docRef = doc(db, COLLECTION, userId);
        await updateDoc(docRef, {
            selos: arrayUnion(seloId),
            pontos: parseInt(pontos) || 0 // TODO: Incrementar pontos corretamente
        });
    }
};
