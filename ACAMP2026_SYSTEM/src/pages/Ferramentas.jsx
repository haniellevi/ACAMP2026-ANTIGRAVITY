import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Send,
    CheckCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { MATURIDADE_QUESTIONS, MINISTERIAL_QUESTIONS } from '../data/diagnosticos';
import { saveDiagnosticResult } from '../services/diagnosticoService';

function Ferramentas() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeDiag, setActiveDiag] = useState(null); // 'MATURIDADE' ou 'MINISTERIAL'
    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const questions = activeDiag === 'MATURIDADE' ? MATURIDADE_QUESTIONS : MINISTERIAL_QUESTIONS;

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) return;

        setLoading(true);
        const result = {
            tipo: activeDiag,
            respostas: answers,
            data: new Date().toISOString(),
            userId: currentUser.uid
        };

        try {
            await saveDiagnosticResult(currentUser.uid, result);
            setSubmitted(true);
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="page-container" style={{ padding: '20px', textAlign: 'center' }}>
                <Card>
                    <CheckCircle size={64} color="var(--color-gold)" style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ color: 'var(--color-gold)' }}>MISSÃO CUMPRIDA!</h2>
                    <p>Seu diagnóstico foi enviado para o Grande Comando.</p>
                    <Button onClick={() => navigate('/home')} style={{ marginTop: '20px' }}>VOLTAR AO QG</Button>
                </Card>
            </div>
        );
    }

    if (!activeDiag) {
        return (
            <div className="page-container" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                    <Button variant="ghost" onClick={() => navigate('/home')} style={{ padding: '5px' }}>
                        <ChevronLeft size={24} />
                    </Button>
                    <h1 style={{ fontSize: '1.8rem' }}>FERRAMENTAS</h1>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    <Card onClick={() => setActiveDiag('MATURIDADE')} interactive>
                        <h3 style={{ color: 'var(--color-gold)' }}>PERFIL DE MATURIDADE</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avalie sua fibra espiritual e emocional para o combate.</p>
                        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                            INICIAR <ArrowRight size={18} />
                        </div>
                    </Card>

                    <Card onClick={() => setActiveDiag('MINISTERIAL')} interactive>
                        <h3 style={{ color: 'var(--color-gold)' }}>DESCOBRINDO MEU MINISTÉRIO</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Identifique seu chamado nos 5 ministérios (Efésios 4:11).</p>
                        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                            INICIAR <ArrowRight size={18} />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="page-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Button variant="ghost" onClick={() => setActiveDiag(null)} style={{ padding: '5px' }}>
                    <ChevronLeft size={24} />
                </Button>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                    QUESTÃO {currentStep + 1} DE {questions.length}
                </div>
            </div>

            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '30px' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: 'var(--color-gold)', borderRadius: '2px' }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <Card style={{ padding: '30px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '0' }}>{q.text}</h2>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div style={{ display: 'grid', gap: '12px', marginTop: '30px' }}>
                {q.opts.map((optText, idx) => {
                    const val = idx + 1;
                    return (
                        <button
                            key={val}
                            onClick={() => handleAnswer(q.id, val)}
                            style={{
                                background: answers[q.id] === val ? 'var(--color-gold)' : 'var(--bg-card)',
                                border: `2px solid ${answers[q.id] === val ? 'var(--color-gold)' : 'var(--color-wood-dark)'}`,
                                color: answers[q.id] === val ? 'var(--color-dark-earth)' : 'var(--color-gold)',
                                padding: '15px 20px',
                                borderRadius: 'var(--radius-rustic)',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: 'var(--shadow-rustic)',
                                lineSize: '1.2'
                            }}
                        >
                            {optText}
                        </button>
                    );
                })}
            </div>


            {currentStep === questions.length - 1 && answers[q.id] && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '40px' }}>
                    <Button onClick={handleSubmit} fullWidth loading={loading}>
                        ENVIAR RELATÓRIO <Send size={20} style={{ marginLeft: '10px' }} />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

export default Ferramentas;
