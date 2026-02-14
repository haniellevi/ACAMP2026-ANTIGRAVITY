import { db } from './firebaseConfig';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocsFromServer,
    Timestamp
} from 'firebase/firestore';

/**
 * Valida um voucher de acesso.
 * @param {string} code 
 * @returns {Promise<{valid: boolean, message: string}>}
 */
export const validateVoucher = async (code) => {
    console.log("Iniciando validação do voucher:", code);

    // Promessa de Timeout para evitar espera infinita
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_QG')), 10000)
    );

    try {
        const vouchersRef = collection(db, 'vouchers');
        const q = query(vouchersRef, where('code', '==', code.toUpperCase()));

        console.log("Buscando no Firestore (Online)...");

        // Corrida entre a busca no servidor e o timeout
        const querySnapshot = await Promise.race([
            getDocsFromServer(q),
            timeout
        ]);

        console.log("Busca concluída. Documentos encontrados:", querySnapshot.size);

        if (querySnapshot.empty) {
            console.warn("Voucher não encontrado no sistema.");
            return { valid: false, message: 'Voucher não encontrado. Verifique o código.' };
        }

        const voucherDoc = querySnapshot.docs[0];
        const voucherData = voucherDoc.data();

        if (voucherData.used === true) {
            return { valid: false, message: 'Este voucher já foi utilizado.' };
        }

        return { valid: true, id: voucherDoc.id, data: voucherData };
    } catch (error) {
        console.error("ERRO na validação:", error.message);

        if (error.message === 'TIMEOUT_QG') {
            return { valid: false, message: 'O QG está demorando a responder. Verifique sua conexão.' };
        }

        return { valid: false, message: 'Erro de comunicação com o QG Central.' };
    }
};



/**
 * Marca um voucher como utilizado por um usuário.
 */
export const useVoucher = async (voucherId, userId, userName) => {
    try {
        const voucherRef = doc(db, 'vouchers', voucherId);
        await updateDoc(voucherRef, {
            used: true,
            usedBy: userId,
            usedByName: userName,
            usedAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Erro ao consumir voucher:", error);
    }
};

/**
 * Verifica se um usuário é administrador.
 */
export const checkAdminStatus = async (userId) => {
    try {
        const adminRef = doc(db, 'admins', userId);
        const adminSnap = await getDoc(adminRef);
        return adminSnap.exists();
    } catch (error) {
        return false;
    }
};

/**
 * Verifica se um usuário possui e-mail de administrador.
 */
export const checkIsAdmin = (email) => {
    const adminEmails = [
        'igrejafiladelfiacorrente@gmail.com',
        'admin@acamp.forja.com'
    ];
    return adminEmails.includes(email);
};

/**
 * Cria ou atualiza o perfil do soldado após o alistamento.
 */
export const saveUserProfile = async (userId, data) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
    }
};
