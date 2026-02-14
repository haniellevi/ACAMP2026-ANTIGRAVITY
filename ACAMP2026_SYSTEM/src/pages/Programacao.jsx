import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Calendar } from 'lucide-react';
import { PROGRAMACAO } from '../data/programacao';
import { useEffect, useState } from 'react';

function ProgramacaoPage() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = daysOfWeek[currentTime.getDay()];
    const [activeDay, setActiveDay] = useState(PROGRAMACAO.some(d => d.dia === todayName) ? todayName : PROGRAMACAO[0].dia);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Atualiza a cada minuto
        return () => clearInterval(timer);
    }, []);

    const timeStr = currentTime.getHours().toString().padStart(2, '0') + ':' + currentTime.getMinutes().toString().padStart(2, '0');

    return (
        <div className="page-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                <Button variant="ghost" onClick={() => navigate('/home')} style={{ padding: '5px' }}>
                    <ChevronLeft size={24} />
                </Button>
                <h1 style={{ fontSize: '1.8rem' }}>PROGRAMAÇÃO</h1>
            </div>

            {/* Filtro por Dia */}
            <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '10px',
                marginBottom: '20px',
                scrollbarWidth: 'none'
            }}>
                {PROGRAMACAO.map(dia => (
                    <Button
                        key={dia.dia}
                        variant={activeDay === dia.dia ? 'primary' : 'secondary'}
                        onClick={() => setActiveDay(dia.dia)}
                        style={{
                            minWidth: '100px',
                            border: activeDay === dia.dia ? '2px solid var(--color-gold)' : '1px solid var(--color-wood-dark)'
                        }}
                    >
                        {dia.dia.toUpperCase()}
                    </Button>
                ))}
            </div>

            {PROGRAMACAO.filter(d => d.dia === activeDay).map((dia, dIndex) => {
                const DAYS_ORDER = ['Sábado', 'Domingo', 'Segunda', 'Terça'];
                const dayIndex = DAYS_ORDER.indexOf(dia.dia);

                // Mapeia o dia atual do JS (0-6) para o nosso índice (Sáb=0, Dom=1, Seg=2, Ter=3)
                const jsDay = currentTime.getDay();
                const currentDayMappedIdx = jsDay === 6 ? 0 : (jsDay === 0 ? 1 : (jsDay === 1 ? 2 : (jsDay === 2 ? 3 : -1)));

                const isPastDay = currentDayMappedIdx > dayIndex;
                const isToday = currentDayMappedIdx === dayIndex;

                return (
                    <div key={dIndex} style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            color: isToday ? 'var(--color-fire)' : 'var(--color-gold)',
                            fontSize: '1.2rem',
                            borderBottom: '1px solid var(--color-wood-dark)',
                            paddingBottom: '5px',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <Calendar size={20} />
                            {dia.dia.toUpperCase()} {isToday && <span style={{ fontSize: '0.7rem', background: 'var(--color-fire)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>HOJE</span>}
                        </h2>

                        <div style={{ display: 'grid', gap: '10px' }}>
                            {dia.eventos.map((evento, eIndex) => {
                                const nextEvent = dia.eventos[eIndex + 1];
                                const isHappening = isToday && timeStr >= evento.hora && (!nextEvent || timeStr < nextEvent.hora);
                                const isPastEvent = isPastDay || (isToday && timeStr > (nextEvent ? nextEvent.hora : evento.hora));
                                // Se for o último evento do dia e já passou da hora dele + 1h (aproximadamente), consideramos passado
                                // Mas a regra simples: se já começou o próximo, esse já foi.

                                return (
                                    <motion.div
                                        key={eIndex}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <Card style={{
                                            padding: '12px 15px',
                                            border: isHappening
                                                ? '2px solid var(--color-fire)'
                                                : (isPastEvent ? '1px solid #27ae60' : '1px solid var(--color-wood-dark)'),
                                            background: isHappening
                                                ? 'rgba(211, 84, 0, 0.1)'
                                                : (isPastEvent ? 'rgba(39, 174, 96, 0.05)' : 'var(--bg-card)'),
                                            position: 'relative',
                                            overflow: 'hidden',
                                            opacity: isPastEvent ? 0.8 : 1
                                        }}>
                                            {isHappening && (
                                                <motion.div
                                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0, left: 0, width: '4px', height: '100%',
                                                        background: 'var(--color-fire)'
                                                    }}
                                                />
                                            )}
                                            {isPastEvent && !isHappening && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, width: '4px', height: '100%',
                                                    background: '#27ae60'
                                                }} />
                                            )}

                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    minWidth: '60px',
                                                    color: isHappening ? 'var(--color-fire)' : (isPastEvent ? '#27ae60' : 'var(--text-main)'),
                                                    animation: isHappening ? 'blink 2s infinite' : 'none'
                                                }}>
                                                    {evento.hora}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{
                                                            margin: 0,
                                                            fontSize: '0.95rem',
                                                            color: isHappening ? 'var(--color-fire-glow)' : (isPastEvent ? '#2ecc71' : 'var(--color-gold)')
                                                        }}>
                                                            {evento.nome}
                                                        </h4>
                                                        {isPastEvent && !isHappening && (
                                                            <span style={{ fontSize: '0.6rem', color: '#2ecc71', fontWeight: 'bold' }}>CONCLUÍDO</span>
                                                        )}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
                                                        {evento.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}


            <style>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default ProgramacaoPage;
