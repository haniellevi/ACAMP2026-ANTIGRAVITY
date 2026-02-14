import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, QUESTIONS } from '../data/quizData';
import { saveDiagnosticResult, getLastQuizResult } from '../services/diagnosticoService';
import { auth } from "../services/firebaseConfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Trophy, RotateCcw, Home as HomeIcon } from 'lucide-react';

const Diagnostico = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
    const [isFinished, setIsFinished] = useState(false);
    const [scores, setScores] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleOptionSelect = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQIndex] = optionIndex;
        setAnswers(newAnswers);

        if (currentQIndex < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQIndex(currentQIndex + 1), 300);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = async (finalAnswers) => {
        setLoading(true);
        let newScores = {};
        let total = 0;
        CATEGORIES.forEach(cat => newScores[cat.id] = 0);

        finalAnswers.forEach((ansIdx, qIdx) => {
            const question = QUESTIONS[qIdx];
            newScores[question.catId] += ansIdx;
            total += ansIdx;
        });

        setScores(newScores);
        setTotalScore(total);
        setIsFinished(true);

        if (user) {
            await saveDiagnosticResult(user.uid, {
                answers: finalAnswers,
                scores: newScores,
                totalScore: total
            });
        }
        setLoading(false);
    };

    const getCategoryPercentage = (catId) => {
        const maxScore = 5 * 3;
        const currentScore = (scores && scores[catId]) || 0;
        return (currentScore / maxScore) * 100;
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '3rem' }}>🔥</motion.div>
        </div>
    );

    if (isFinished) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem', maxWidth: '500px', margin: '0 auto', paddingBottom: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Trophy size={64} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>RELATÓRIO DE CAMPO</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Perfil do Discípulo • ACAMP 2026</p>
                </div>

                <Card style={{ textAlign: 'center', marginBottom: '1.5rem', border: '2px solid var(--color-gold)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>PONTUAÇÃO TOTAL</h3>
                    <div style={{ fontSize: '4.5rem', color: 'var(--color-gold)', lineHeight: 1, margin: '10px 0' }}>{totalScore}</div>
                    <div style={{ fontSize: '1rem', color: 'var(--color-fire)', fontWeight: 'bold' }}>NÍVEL DE PRONTIDÃO: {totalScore > 50 ? 'ELITE' : 'RECRUTA'}</div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {CATEGORIES.map(cat => (
                        <Card key={cat.id} style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--color-gold)' }}>{cat.icon} {cat.name}</span>
                                <span>{scores[cat.id]} pts</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--color-wood-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getCategoryPercentage(cat.id)}%` }}
                                    style={{ height: '100%', background: cat.color || 'var(--color-gold)' }}
                                />
                            </div>
                        </Card>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Button onClick={() => { setIsFinished(false); setCurrentQIndex(0); setAnswers(Array(QUESTIONS.length).fill(null)); }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <RotateCcw size={20} /> REFAZER MISSÃO
                        </div>
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/home')}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <HomeIcon size={20} /> VOLTAR AO QG
                        </div>
                    </Button>
                </div>
            </motion.div>
        );
    }

    const question = QUESTIONS[currentQIndex];
    const category = CATEGORIES.find(c => c.id === question.catId);
    const progress = (currentQIndex / QUESTIONS.length) * 100;

    return (
        <div style={{ padding: '1rem', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ChevronLeft /> VOLTAR
                </button>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
                    FALTA {QUESTIONS.length - currentQIndex} PARA CONCLUIR
                </div>
            </header>

            <div style={{ height: '4px', background: 'var(--bg-card)', borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--color-fire)' }} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--color-gold)', color: 'var(--color-wood-dark)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {category?.icon} {category?.name.toUpperCase()}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    style={{ flex: 1 }}
                >
                    <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '2rem', textAlign: 'center' }}>{question.q}</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {question.opts.map((opt, idx) => (
                            <Card
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                style={{
                                    borderColor: answers[currentQIndex] === idx ? 'var(--color-fire)' : 'var(--color-wood-light)',
                                    background: answers[currentQIndex] === idx ? 'rgba(211, 84, 0, 0.1)' : 'var(--bg-card)',
                                    padding: '1.2rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '24px', height: '24px', border: '2px solid var(--color-gold)', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {answers[currentQIndex] === idx && <div style={{ width: '12px', height: '12px', background: 'var(--color-fire)', borderRadius: '50%' }} />}
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: answers[currentQIndex] === idx ? 'bold' : 'normal' }}>{opt}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="secondary" disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)}>
                    ANTERIOR
                </Button>
            </div>
        </div>
    );
};

export default Diagnostico;
