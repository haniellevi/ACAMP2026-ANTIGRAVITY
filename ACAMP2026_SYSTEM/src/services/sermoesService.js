import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Dados oficiais dos sermões e senhas para selos (7 senhas distintas)
export const SERMOES_DATA = [
    {
        id: '1',
        titulo: 'RENÚNCIA: O PREÇO DO CHAMADO',
        pregador: 'Pr. Gilvan',
        data: 'Domingo - 08:30',
        tema: 'Renúncia',
        senhaSelo: '4821',
        icon: '🔥',
        perguntas: [
            { q: 'O que significa renúncia no contexto do Reino?', opts: ['Fugir das responsabilidades', 'Trocar o que é bom pelo que é excelente', 'Abrir mão de tudo sem motivo', 'Ignorar os problemas'], correta: 1 },
            { q: 'Qual o principal "preço" mencionado no chamado?', opts: ['Dinheiro e bens', 'Conforto e vontade própria', 'Tempo de sono', 'Popularidade nas redes'], correta: 1 },
            { q: 'Seguir a Cristo exige uma decisão:', opts: ['Semanal', 'Mental apenas', 'Diária de negar-se a si mesmo', 'Opcional'], correta: 2 }
        ]
    },
    {
        id: '2',
        titulo: 'A FORJA DA MENTE',
        pregador: 'Pra. Débora',
        data: 'Domingo - 19:00',
        tema: 'Renovação',
        senhaSelo: '7356',
        icon: '🧠',
        perguntas: [
            { q: 'Segundo o sermão, onde começa a verdadeira batalha?', opts: ['Nas circunstâncias externas', 'Na mente', 'No comportamento', 'Nas palavras'], correta: 1 },
            { q: 'Como renovamos nossa mente segundo Romanos 12?', opts: ['Lendo mais notícias', 'Não nos conformando com este século', 'Esquecendo o passado', 'Sendo pessoas positivas'], correta: 1 },
            { q: 'Uma mente forjada em Deus é:', opts: ['Inabalável e focada no Reino', 'Lógica e fria', 'Confusa e mística', 'Sempre feliz'], correta: 0 }
        ]
    },
    {
        id: '3',
        titulo: 'IDENTIDADE DO GUERREIRO',
        pregador: 'Pr. Marcos',
        data: 'Segunda - 08:30',
        tema: 'Identidade',
        senhaSelo: '1947',
        icon: '🛡️',
        perguntas: [
            { q: 'Quem define a identidade do guerreiro?', opts: ['Sua família', 'Seu desempenho', 'O Criador (Deus)', 'A sociedade'], correta: 2 },
            { q: 'Qual a principal arma defensiva mencionada?', opts: ['Espada do Espírito', 'Escudo da Fé', 'Capacete da Salvação', 'Sandálias da Paz'], correta: 1 },
            { q: 'Um guerreiro que não conhece sua identidade:', opts: ['Luta melhor', 'É vulnerável aos ataques do inimigo', 'Não precisa de armadura', 'É independente'], correta: 1 }
        ]
    },
    {
        id: '4',
        titulo: 'COMUNHÃO NO FRONT',
        pregador: 'Miss. Ana',
        data: 'Segunda - 19:00',
        tema: 'Comunhão',
        senhaSelo: '6283',
        icon: '🤝',
        perguntas: [
            { q: 'Por que o isolamento é perigoso no front?', opts: ['Porque é chato', 'Porque o soldado sozinho é alvo fácil', 'Porque gasta mais recursos', 'Não é perigoso'], correta: 1 },
            { q: 'O que sustenta a comunhão verdadeira?', opts: ['Interesses em comum', 'O amor sacrificial de Cristo', 'Apenas amizade social', 'Concordar em tudo'], correta: 1 },
            { q: 'No corpo de Cristo, cada membro é:', opts: ['Indispensável', 'Opcional', 'Substituível', 'Superior aos outros'], correta: 0 }
        ]
    },
    {
        id: '5',
        titulo: 'HONRA E LEALDADE',
        pregador: 'Pr. Silas',
        data: 'Terça - 08:30',
        tema: 'Honra',
        senhaSelo: '5094',
        icon: '🎖️',
        perguntas: [
            { q: 'Honra é uma questão de:', opts: ['Poder', 'Princípio e coração', 'Status', 'Troca de favores'], correta: 1 },
            { q: 'A quem devemos honra primeiro?', opts: ['Aos líderes', 'Aos pais', 'A Deus', 'A nós mesmos'], correta: 2 },
            { q: 'A deslealdade no exército de Deus causa:', opts: ['Crescimento', 'Divisão e fraqueza', 'Nada demais', 'Independência'], correta: 1 }
        ]
    },
    {
        id: '6',
        titulo: 'PRONTIDÃO PARA O SERVIÇO',
        pregador: 'Ev. Lucas',
        data: 'Terça - 19:00',
        tema: 'Serviço',
        senhaSelo: '3617',
        icon: '⚒️',
        perguntas: [
            { q: 'O que define a prontidão de um servo?', opts: ['Sua disposição em obedecer logo', 'Seu conhecimento técnico', 'Seus anos de igreja', 'Sua vontade própria'], correta: 0 },
            { q: 'Servir no Reino é um:', opts: ['Fardo pesado', 'Privilégio e missão', 'Emprego espiritual', 'Hobbie'], correta: 1 },
            { q: 'O maior no Reino é aquele que:', opts: ['Manda mais', 'Sermoneia melhor', 'Serve a todos', 'Tem mais títulos'], correta: 2 }
        ]
    },
    {
        id: '7',
        titulo: 'ENVIO: A GRANDE COMISSÃO',
        pregador: 'Coordenação',
        data: 'Quarta - 07:30',
        tema: 'Envio',
        senhaSelo: '8472',
        icon: '🚀',
        perguntas: [
            { q: 'Qual a nossa principal missão após o acampamento?', opts: ['Descansar', 'Fazer discípulos de todas as nações', 'Apenas guardar as memórias', 'Mudar de igreja'], correta: 1 },
            { q: 'Onde começa o campo missionário?', opts: ['Na África', 'Em Corrente-PI', 'Onde quer que nossos pés pisem', 'No prédio da igreja'], correta: 2 },
            { q: 'Quem nos capacita para o envio?', opts: ['Nossa inteligência', 'O Espírito Santo', 'Os cursos que fizemos', 'A diretoria do acampamento'], correta: 1 }
        ]
    },
];

const COLLECTION = 'anotacoes_sermoes';

export const SermoesService = {
    getListaSermoes() {
        return SERMOES_DATA;
    },

    async getAnotacao(userId, sermaoId) {
        const docRef = doc(db, COLLECTION, `${userId}_${sermaoId}`);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data().conteudo || '' : '';
    },

    async salvarAnotacao(userId, sermaoId, conteudo) {
        const docRef = doc(db, COLLECTION, `${userId}_${sermaoId}`);
        await setDoc(docRef, {
            userId,
            sermaoId,
            conteudo,
            updatedAt: new Date()
        }, { merge: true });
    },

    /**
     * Valida senha e libera selo no passaporte do usuário.
     */
    async validarSelo(userId, sermaoId, senhaDigitada) {
        const sermao = SERMOES_DATA.find(s => s.id === sermaoId);
        if (!sermao || sermao.senhaSelo !== senhaDigitada) {
            return { success: false, message: 'Senha incorreta para este selo.' };
        }

        try {
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, {
                selos: arrayUnion(sermaoId)
            }, { merge: true });
            return { success: true };
        } catch (error) {
            console.error("Erro ao validar selo:", error);
            return { success: false, message: 'Erro na conexão com o QG.' };
        }
    }
};
