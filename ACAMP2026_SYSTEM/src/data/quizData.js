export const CATEGORIES = [
    { id: 'renuncia', name: 'Renúncia e Compromisso', icon: '🏴', color: '#ef4444' },
    { id: 'mente', name: 'Renovação da Mente', icon: '🧠', color: '#6c5ce7' },
    { id: 'comunhao', name: 'Comunhão e Relacionamento', icon: '🤝', color: '#00cec9' },
    { id: 'honra', name: 'Honra e Lealdade', icon: '👑', color: '#ffd700' },
    { id: 'servico', name: 'Serviço e Multiplicação', icon: '🛠️', color: '#f97316' }
];

export const QUESTIONS = [
    // RENÚNCIA (1-5)
    { catId: 'renuncia', q: 'Quando algo que eu quero conflita com o que Deus pede, eu:', opts: ['Sigo minha vontade sem pensar', 'Fico dividido e geralmente faço o que quero', 'Luto internamente mas tento obedecer', 'Renuncio minha vontade com convicção'] },
    { catId: 'renuncia', q: 'Minha vida de oração e devocional pessoal é:', opts: ['Praticamente inexistente', 'Esporádica, só quando preciso de algo', 'Regular, mas ainda inconsistente', 'Diária e intencional — é prioridade'] },
    { catId: 'renuncia', q: 'Quando enfrento dificuldade por causa da fé, eu:', opts: ['Questiono se vale a pena seguir a Jesus', 'Fico desanimado e me afasto um pouco', 'Me apoio em Deus mas sinto o peso', 'Entendo que faz parte e persevero com alegria'] },
    { catId: 'renuncia', q: 'Meu compromisso com a igreja local é:', opts: ['Vou quando tenho vontade ou não tenho nada melhor', 'Frequento mas sem muito envolvimento', 'Sou presente e participo das atividades', 'Estou comprometido como aliança, não como opção'] },
    { catId: 'renuncia', q: 'Em relação ao meu tempo, dinheiro e talentos para o Reino:', opts: ['Não penso nisso como algo que devo a Deus', 'Contribuo quando sobra ou é conveniente', 'Dizimo e oferto, mas ainda sou apegado ao controle', 'Entendo que tudo é de Deus e administro como mordomo'] },

    // MENTE (6-10)
    { catId: 'mente', q: 'Quando ouço um ensino bíblico que confronta meu estilo de vida, eu:', opts: ['Ignoro ou descarto como "radical demais"', 'Fico incomodado mas não mudo nada', 'Reflito e começo a fazer ajustes', 'Abraço a mudança mesmo que doa'] },
    { catId: 'mente', q: 'Minha mentalidade em relação à igreja é mais de:', opts: ['"O que a igreja faz por mim?" (consumidor)', '"Eu vou quando me convém" (visitante)', 'Estou disposto a contribuir (participante)', '"O que eu posso fazer pelo Reino?" (discípulo)'] },
    { catId: 'mente', q: 'Quando passo por uma crise pessoal, minha reação é:', opts: ['Reclamar de Deus e da liderança', 'Ficar distante e resolver sozinho', 'Buscar ajuda mas com certa resistência', 'Interceder, buscar a Palavra e apoiar a comunidade'] },
    { catId: 'mente', q: 'Em relação à renovação da mente (mudar padrões de pensamento):', opts: ['Não entendo do que se trata', 'Sei que preciso mas não sei como', 'Estou no processo, lendo e meditando na Palavra', 'Minha mente é constantemente alimentada por verdades bíblicas'] },
    { catId: 'mente', q: 'Quando vejo outro cristão errando, minha primeira reação é:', opts: ['Comentar com outros sobre o erro', 'Julgar internamente', 'Sentir compaixão mas não fazer nada', 'Orar e, se apropriado, restaurar com mansidão'] },

    // COMUNHÃO (11-15)
    { catId: 'comunhao', q: 'Meu envolvimento com um pequeno grupo ou célula é:', opts: ['Não participo de nenhum grupo', 'Participo às vezes quando posso', 'Frequento regularmente', 'Sou comprometido e ajudo o grupo a crescer'] },
    { catId: 'comunhao', q: 'Em relação a compartilhar minhas lutas e vitórias com outros cristãos:', opts: ['Não me abro com ninguém', 'Falo superficialmente quando perguntam', 'Tenho uma ou duas pessoas de confiança', 'Pratico transparência e vulnerabilidade na comunidade'] },
    { catId: 'comunhao', q: 'Quando um irmão/irmã da fé está passando por dificuldade:', opts: ['Geralmente nem fico sabendo', 'Digo "vou orar" mas esqueço', 'Oro e mando uma mensagem de apoio', 'Vou até a pessoa, ajudo com ação prática e oro junto'] },
    { catId: 'comunhao', q: 'Sobre construir relacionamentos de discipulado (mentoria):', opts: ['Nunca tive um mentor espiritual', 'Já tive mas não deu certo', 'Tenho alguém que me acompanha às vezes', 'Tenho mentor e também mentoreio alguém'] },
    { catId: 'comunhao', q: 'Quando há conflito entre irmãos na igreja, eu:', opts: ['Fico de um lado e falo mal do outro', 'Evito o assunto completamente', 'Tento ser pacificador mas de longe', 'Vou diretamente buscar reconciliação conforme Mateus 18'] },

    // HONRA (16-20)
    { catId: 'honra', q: 'Quando a liderança da igreja toma uma decisão com a qual discordo:', opts: ['Reclamo com outros membros', 'Critico internamente e fico ressentido', 'Fico em silêncio mas não apoio', 'Converso em particular com respeito e apoio a decisão final'] },
    { catId: 'honra', q: 'Em relação à honra e reconhecimento dos meus líderes:', opts: ['Raramente penso nisso', 'Honro quando é conveniente', 'Respeito a posição mas nem sempre a pessoa', 'Honro a unção e a pessoa, independente de falhas'] },
    { catId: 'honra', q: 'Quando ouço fofoca sobre um líder ou irmão, eu:', opts: ['Ouço e passo para frente', 'Ouço mas não compartilho', 'Mudo de assunto', 'Interrompo e defendo o ausente'] },
    { catId: 'honra', q: 'Minha postura em relação à autoridade (pais, chefes, líderes):', opts: ['Tenho problema com autoridade em geral', 'Respeito quando merecem', 'Entendo o principio mas nem sempre pratico', 'Honro como princípio bíblico, mesmo quando é difícil'] },
    { catId: 'honra', q: 'Se meu líder comete um erro público, minha reação é:', opts: ['Contar para outros e usar como justificativa para sair', 'Perder a confiança e me afastar', 'Ficar decepcionado mas manter distância', '"Cobrir" com oração, apoiar a restauração e manter lealdade'] },

    // SERVIÇO (21-25)
    { catId: 'servico', q: 'Em relação ao voluntariado na igreja, eu:', opts: ['Não sirvo em nenhuma área', 'Servo quando pedem, mas sem compromisso', 'Sirvo em uma área com regularidade', 'Sirvo por chamado e procuro novas oportunidades'] },
    { catId: 'servico', q: 'Eu conheço meus dons espirituais e como usá-los?', opts: ['Não sei quais são meus dons', 'Tenho uma ideia vaga', 'Conheço alguns e uso quando posso', 'Conheço bem e sirvo ativamente com eles'] },
    { catId: 'servico', q: 'Sobre evangelismo e compartilhar minha fé:', opts: ['Nunca falei de Jesus para alguém', 'Falo muito raramente e com vergonha', 'Compartilho quando surge oportunidade', 'Busco intencionalmente oportunidades para testemunhar'] },
    { catId: 'servico', q: 'Se alguém me pedisse para discipular um novo convertido, eu:', opts: ['Não me sentiria capaz de forma alguma', 'Ficaria inseguro e provavelmente recusaria', 'Tentaria com auxílio de material', 'Aceitaria com alegria — já faço ou estou pronto'] },
    { catId: 'servico', q: 'Minha visão sobre o meu papel na expansão do Reino de Deus:', opts: ['Isso é trabalho de pastor e missionário', 'Sei que deveria participar mas não sei como', 'Estou começando a entender meu papel', 'Sei que EU sou o agente do Reino onde piso'] }
];
