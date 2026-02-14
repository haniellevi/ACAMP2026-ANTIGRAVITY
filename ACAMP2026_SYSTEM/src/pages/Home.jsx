import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkIsAdmin } from '../services/authService';
import { PROGRAMACAO } from '../data/programacao';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    LogOut,
    Shield,
    Map,
    Scroll,
    Calendar,
    Trophy,
    Zap,
    ShieldAlert,
    Settings2,
    BookOpen,
    Clock,
    ListChecks
} from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    };

    const soldierName = currentUser?.email?.split('@')[0].toUpperCase().replace('.', ' ') || 'SOLDADO';

    const getNextMission = () => {
        const now = new Date();
        const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const todayName = daysOfWeek[now.getDay()];
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        // 1. Tentar encontrar hoje
        let todayProgram = PROGRAMACAO.find(p => p.dia === todayName);

        if (todayProgram) {
            const nextEvent = todayProgram.eventos.find(e => e.hora > currentTime);
            if (nextEvent) return { ...nextEvent, dia: 'HOJE' };
        }

        // 2. Se não encontrou hoje, procurar no próximo dia de programação
        const todayIndex = PROGRAMACAO.findIndex(p => p.dia === todayName);
        const nextDayProgram = PROGRAMACAO[(todayIndex + 1) % PROGRAMACAO.length];

        return { ...nextDayProgram.eventos[0], dia: nextDayProgram.dia };
    };

    const missaoUrgent = getNextMission();

    const [hasEscalas, setHasEscalas] = useState(false);
    const isAdmin = checkIsAdmin(currentUser?.email);

    useEffect(() => {
        if (currentUser) {
            const nomeGuerra = currentUser.email.split('@')[0].toLowerCase();
            import('../services/escalasService').then(({ EscalasService }) => {
                EscalasService.getEscalas().then(data => {
                    const found = data.some(escala =>
                        escala.equipe.some(m => m.toLowerCase().includes(nomeGuerra))
                    );
                    setHasEscalas(found);
                });
            });
        }
    }, [currentUser]);

    const menuItems = [
        { label: 'SERMÕES = EU + DEUS', route: '/sermoes', icon: <Scroll size={32} color="var(--color-gold)" />, desc: 'Minha intimidade' },
        { label: 'PASSAPORTE', route: '/passaporte', icon: <Map size={32} color="var(--color-gold)" />, desc: 'Sua jornada militar' },
        { label: 'FERRAMENTAS', route: '/ferramentas', icon: <Settings2 size={32} color="var(--color-gold)" />, desc: 'Diagnósticos e Perfis' },
        { label: 'REGRAS DO ACAMP', route: '/regras', icon: <BookOpen size={32} color="var(--color-gold)" />, desc: 'Código de Conduta' },
        { label: 'PROGRAMAÇÃO', route: '/programacao', icon: <Clock size={32} color="var(--color-gold)" />, desc: 'Horário das missões' },
        { label: 'RANKING', route: '/ranking', icon: <Trophy size={32} color="var(--color-gold)" />, desc: 'Honra e Glória' }
    ];

    if (hasEscalas) {
        menuItems.splice(5, 0, { label: 'ESCALAS', route: '/escalas', icon: <ListChecks size={32} color="var(--color-gold)" />, desc: 'Seu posto hoje' });
    }

    if (isAdmin) {
        menuItems.push({ label: 'COMANDO', route: '/admin', icon: <ShieldAlert size={32} color="var(--color-fire)" />, desc: 'Controle Master' });
    }


    return (
        <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    background: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-rustic)',
                    borderBottom: '2px solid var(--color-gold)',
                    boxShadow: 'var(--shadow-rustic)'
                }}
            >
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1 }}>QG PRINCIPAL</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', opacity: 0.8, fontWeight: 'bold' }}>
                        MATRÍCULA: {soldierName}
                    </span>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--color-wood-dark)',
                    borderRadius: 'var(--radius-rustic)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-gold)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}>
                    <Zap size={24} color="var(--color-fire)" />
                </div>
            </motion.header>

            <section style={{ marginBottom: '2rem' }}>
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        borderColor: 'var(--color-fire)',
                        backgroundColor: 'rgba(211, 84, 0, 0.15)',
                        borderLeft: '4px solid var(--color-fire)'
                    }}>
                        <div style={{
                            background: 'var(--color-fire)',
                            padding: '10px',
                            borderRadius: '50%',
                            boxShadow: '0 0 15px rgba(211, 84, 0, 0.4)'
                        }}>
                            <Zap size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-fire-glow)' }}>MISSÃO URGENTE: {missaoUrgent.dia}</h3>
                            <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                                {missaoUrgent.hora} - {missaoUrgent.nome}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>{missaoUrgent.desc}</p>
                        </div>
                    </Card>
                </motion.div>
            </section>

            <section style={{ flex: 1 }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem'
                }}>
                    <span style={{ width: '12px', height: '12px', background: 'var(--color-gold)', transform: 'rotate(45deg)' }}></span>
                    ARSENAL DISPONÍVEL
                    <span style={{ width: '12px', height: '12px', background: 'var(--color-gold)', transform: 'rotate(45deg)' }}></span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {menuItems.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                onClick={() => navigate(item.route)}
                                style={{
                                    textAlign: 'center',
                                    padding: '1.5rem 1rem',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem'
                                }}
                            >
                                {item.icon}
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '2px' }}>{item.label}</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.desc}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div style={{ marginTop: '2rem', padding: '1rem 0' }}>
                <Button onClick={handleLogout} variant="secondary" fullWidth>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <LogOut size={20} />
                        ABANDONAR POSTO (SAIR)
                    </div>
                </Button>
            </div>
        </div>
    );
}

export default Home;
