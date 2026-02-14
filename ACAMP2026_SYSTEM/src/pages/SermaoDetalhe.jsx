import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SermoesService, SERMOES_DATA } from '../services/sermoesService';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import debounce from 'lodash.debounce';
import { db } from '../services/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Mic, CheckCircle, Lock, Key } from 'lucide-react';

function SermaoDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [conteudo, setConteudo] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [showSeloModal, setShowSeloModal] = useState(false);
    const [senhaSelo, setSenhaSelo] = useState('');
    const [seloConquistado, setSeloConquistado] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [feedbackSelo, setFeedbackSelo] = useState('');

    const sermao = SERMOES_DATA.find(s => s.id === id);

    useEffect(() => {
        let unsubscribe;
        if (currentUser && id) {
            // Carregar anotações
            try {
                SermoesService.getAnotacao(currentUser.uid, id).then(text => {
                    setConteudo(text || '');
                }).catch(err => console.error("Erro ao carregar anotações:", err));
            } catch (e) {
                console.error(e);
            }

            // Escutar status do selo em tempo real
            const userRef = doc(db, 'users', currentUser.uid);
            unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const selos = docSnap.data().selos || [];
                    if (selos.includes(id)) {
                        setSeloConquistado(true);
                    }
                }
            }, (err) => console.error("Erro ao escutar selos:", err));
        }
        return () => unsubscribe && unsubscribe();
    }, [currentUser, id]);

    // Função de Voz-para-Texto
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setConteudo(prev => prev + (prev ? ' ' : '') + transcript);
            if (currentUser) autoSave(currentUser.uid, id, conteudo + ' ' + transcript);
        };

        recognition.start();
    };

    const autoSave = useCallback(
        debounce((uid, sid, text) => {
            setSalvando(true);
            SermoesService.salvarAnotacao(uid, sid, text).then(() => {
                setSalvando(false);
            });
        }, 1000),
        []
    );

    const handleChange = (e) => {
        const text = e.target.value;
        setConteudo(text);
        if (currentUser) {
            setSalvando(true);
            autoSave(currentUser.uid, id, text);
        }
    };

    const [quizStep, setQuizStep] = useState(0); // 0: instrução, 1, 2, 3: perguntas, 4: PIN
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizError, setQuizError] = useState(false);

    const handleValidarSelo = async () => {
        setFeedbackSelo('');
        const res = await SermoesService.validarSelo(currentUser.uid, id, senhaSelo);
        if (res.success) {
            setSeloConquistado(true);
            setFeedbackSelo('SELO CONQUISTADO COM SUCESSO!');
            setTimeout(() => {
                setShowSeloModal(false);
                setQuizStep(0);
                setQuizAnswers([]);
            }, 2000);
        } else {
            setFeedbackSelo(res.message);
        }
    };

    const handleQuizOption = (idx) => {
        const currentQuestion = sermao.perguntas[quizStep - 1];
        if (idx === currentQuestion.correta) {
            setQuizError(false);
            if (quizStep < 3) {
                setQuizStep(quizStep + 1);
            } else {
                setQuizStep(4); // Vai para o PIN
            }
        } else {
            setQuizError(true);
            setFeedbackSelo('RESPOSTA INCORRETA. REVISE SUAS ANOTAÇÕES!');
        }
    };

    if (!sermao) return <div style={{ color: 'white', padding: '2rem' }}>Sermão não encontrado no arsenal.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)' }}>

            {/* Header Rústico */}
            <header style={{
                padding: '1rem',
                background: 'rgba(45, 30, 23, 0.9)',
                borderBottom: '2px solid var(--color-wood-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/sermoes')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}
                >
                    <motion.div whileTap={{ scale: 0.9 }}>← VOLTAR</motion.div>
                </button>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {sermao.titulo}
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: salvando ? 'var(--color-fire)' : 'var(--color-gold)' }}>
                        {salvando ? 'MARCANDO PAPEL...' : 'REGISTRADO NO ARQUIVO'}
                    </span>
                </div>
                {!seloConquistado && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSeloModal(true)}
                        style={{
                            background: 'var(--color-gold)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Lock size={12} /> SELAR
                    </motion.button>
                )}
                {seloConquistado && (
                    <div style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={16} /> <span style={{ fontSize: '0.7rem' }}>SELADO</span>
                    </div>
                )}
            </header>

            {/* Área de Notas */}
            <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        value={conteudo}
                        onChange={handleChange}
                        placeholder="O Mestre está falando... anote aqui suas ordens e reflexões."
                        style={{
                            flex: 1,
                            width: '100%',
                            background: 'rgba(0,0,0,0.3)',
                            backgroundImage: 'radial-gradient(var(--color-wood-light) 0.5px, transparent 0.5px)',
                            backgroundSize: '20px 20px',
                            border: '1px solid var(--color-wood-medium)',
                            color: '#e0d6c5',
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            padding: '1.5rem',
                            resize: 'none',
                            borderRadius: '8px',
                            outline: 'none',
                            lineHeight: '1.8'
                        }}
                    />

                    {/* Botão de Voz Flutuante */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={startListening}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: isListening ? 'var(--color-fire)' : 'var(--color-gold)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-wood-dark)'
                        }}
                    >
                        {isListening ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}><Mic size={24} /></motion.div> : <Mic size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Modal de Selo / Quiz */}
            <AnimatePresence>
                {showSeloModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ width: '100%', maxWidth: '400px' }}
                        >
                            <Card style={{ padding: '2rem' }}>

                                {quizStep === 0 && (
                                    <div style={{ textAlign: 'center' }}>
                                        <Key size={40} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                                        <h3 style={{ color: 'var(--color-gold)' }}>FIXAÇÃO DE COMANDO</h3>
                                        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                                            Soldado, para receber o selo deste sermão em seu passaporte, responda corretamente 3 perguntas de fixação.
                                        </p>
                                        <Button onClick={() => setQuizStep(1)} fullWidth>INICIAR TESTE</Button>
                                        <Button variant="secondary" onClick={() => setShowSeloModal(false)} fullWidth style={{ marginTop: '0.5rem' }}>CANCELAR</Button>
                                    </div>
                                )}

                                {(quizStep >= 1 && quizStep <= 3) && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>PERGUNTA {quizStep}/3</span>
                                            <div style={{ width: '60px', height: '4px', background: '#333', borderRadius: '2px', alignSelf: 'center' }}>
                                                <div style={{ width: `${(quizStep / 3) * 100}%`, height: '100%', background: 'var(--color-gold)' }}></div>
                                            </div>
                                        </div>
                                        <h4 style={{ marginBottom: '1.5rem', minHeight: '3.6rem' }}>{sermao.perguntas[quizStep - 1].q}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            {sermao.perguntas[quizStep - 1].opts.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuizOption(idx)}
                                                    style={{
                                                        padding: '1rem',
                                                        textAlign: 'left',
                                                        background: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid var(--color-gold-dim)',
                                                        borderRadius: '4px',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        {quizError && (
                                            <p style={{ color: 'var(--color-fire)', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
                                                {feedbackSelo}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {quizStep === 4 && (
                                    <div style={{ textAlign: 'center' }}>
                                        <CheckCircle size={40} color="#4cd137" style={{ marginBottom: '1rem' }} />
                                        <h3 style={{ color: 'var(--color-gold)' }}>TESTE CONCLUÍDO</h3>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.5rem' }}>
                                            Agora, insira o PIN de 4 dígitos dado pelo preletor para SELAR seu passaporte.
                                        </p>

                                        {feedbackSelo && (
                                            <div style={{
                                                color: seloConquistado ? '#4cd137' : 'var(--color-fire)',
                                                marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold'
                                            }}>
                                                {feedbackSelo}
                                            </div>
                                        )}

                                        <Input
                                            type="tel"
                                            placeholder="XXXX"
                                            value={senhaSelo}
                                            onChange={(e) => setSenhaSelo(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '10px' }}
                                        />

                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <Button onClick={handleValidarSelo} fullWidth disabled={seloConquistado || senhaSelo.length < 4}>
                                                {seloConquistado ? 'CONQUISTADO!' : 'SELAR AGORA'}
                                            </Button>
                                            <Button variant="secondary" onClick={() => { setShowSeloModal(false); setQuizStep(0); }} fullWidth>VOLTAR</Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SermaoDetalhe;
