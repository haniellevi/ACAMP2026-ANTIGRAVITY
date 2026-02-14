import { db } from './firebaseConfig';
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    writeBatch,
    Timestamp
} from 'firebase/firestore';

/**
 * Gera um lote de vouchers aleatórios.
 */
export const generateVouchers = async (amount = 10) => {
    const batch = writeBatch(db);
    const codes = [];

    for (let i = 0; i < amount; i++) {
        const randomCode = `FORJA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const ref = doc(collection(db, 'vouchers'));
        batch.set(ref, {
            code: randomCode,
            used: false,
            createdAt: Timestamp.now()
        });
        codes.push(randomCode);
    }

    await batch.commit();
    return codes;
};

/**
 * Lista todos os usuários alistados.
 */
export const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Lista todos os vouchers (usados e disponíveis).
 */
export const getAllVouchers = async () => {
    const querySnapshot = await getDocs(collection(db, 'vouchers'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Algoritmo de Geração de Escalas (Lógica Básica)
 * Regras: Idade > 12, Equilíbrio de Gênero, Frequência.
 */
export const generateAutomatedEscala = (users, taskTitle, shift, slots = 4) => {
    // 1. Filtrar aptos (ex: idade > 12 se tivermos esse dado)
    const eligible = users.filter(u => u.role !== 'admin');

    // 2. Embaralhar para evitar repetição (Simulação de frequência)
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());

    // 3. Pegar os primeiros 'slots'
    const team = shuffled.slice(0, slots).map(u => u.nomeGuerra);

    return {
        titulo: taskTitle,
        horario: shift,
        equipe: team,
        lider: team[0] // O primeiro é o líder temporário
    };
};
