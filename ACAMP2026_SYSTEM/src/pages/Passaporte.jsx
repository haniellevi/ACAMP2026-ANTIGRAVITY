import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SERMOES_DATA } from '../services/sermoesService';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

function Passaporte() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        // Escutar dados do usuário em tempo real
        const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    const selosConquistados = userData?.selos || [];

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <Award size={40} color="var(--color-gold)" style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '2rem' }}>PASSAPORTE DO GUERREIRO</h2>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>STATUS DE PRONTIDÃO</p>
            </header>

            <Card style={{ marginBottom: '2rem', textAlign: 'center', borderColor: 'var(--color-gold)' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>CONQUISTAS:</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                    {selosConquistados.length}<span style={{ fontSize: '1rem', opacity: 0.5 }}> / {SERMOES_DATA.length}</span>
                </div>
            </Card>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '1rem'
            }}>
                {SERMOES_DATA.map((selo) => {
                    const conquistado = selosConquistados.includes(selo.id);
                    return (
                        <motion.div
                            key={selo.id}
                            whileHover={conquistado ? { scale: 1.05 } : {}}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card style={{
                                opacity: conquistado ? 1 : 0.3,
                                border: conquistado ? '2px solid var(--color-gold)' : '1px dashed var(--color-wood-light)',
                                background: conquistado ? 'var(--color-wood-dark)' : 'transparent',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                aspectRatio: '1',
                                padding: '1rem'
                            }}>
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                    {conquistado ? selo.icon : <Lock size={32} opacity={0.5} />}
                                </span>
                                <strong style={{
                                    fontSize: '0.7rem',
                                    color: conquistado ? 'var(--color-gold)' : 'var(--text-dim)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    {selo.tema}
                                </strong>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Button onClick={() => navigate('/home')} variant="secondary" fullWidth>VOLTAR AO QG</Button>
            </div>
        </div>
    );
}

export default Passaporte;
