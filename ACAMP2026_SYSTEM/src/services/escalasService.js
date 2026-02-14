// Mock de Escalas
// Futuramente isso virá do Firestore: collection('escalas')

export const ESCALAS_DATA = [
    {
        id: 'cozinha_sab_almoco',
        titulo: 'COZINHA - Sábado Almoço',
        horario: '11:00 - 13:00',
        lider: 'Sgt. Marta',
        equipe: ['Gideão', 'Débora', 'Sansão', 'Samuel']
    },
    {
        id: 'limpeza_sab_tarde',
        titulo: 'LIMPEZA - Banheiros',
        horario: '14:00 - 15:00',
        lider: 'Cb. Davi',
        equipe: ['Pedro', 'Tiago', 'João']
    },
    {
        id: 'seguranca_noite',
        titulo: 'VIGÍLIA NOTURNA',
        horario: '00:00 - 02:00',
        lider: 'Ten. Josué',
        equipe: ['Elias', 'Eliseu', 'Moisés']
    }
];

export const EscalasService = {
    getEscalas() {
        return Promise.resolve(ESCALAS_DATA);
    },

    // Método para filtrar escalas onde o usuário está (Futuro)
    getMinhasEscalas(nomeGuerra) {
        return Promise.resolve(
            ESCALAS_DATA.filter(escala =>
                escala.equipe.some(membro => membro.toLowerCase() === nomeGuerra.toLowerCase())
            )
        );
    }
};
