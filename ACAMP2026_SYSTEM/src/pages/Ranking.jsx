import { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Target } from 'lucide-react';
import { motion } from 'framer-motion';

function Ranking() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const q = query(collection(db, 'users'), limit(50)); // Em prod, ordenaria por pontos
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    score: (doc.data().selos?.length || 0) * 100 // Pontuação básica por selos
                }));

                // Ordenação manual enquanto não temos campo redundante de score
                const sorted = users.sort((a, b) => b.score - a.score);
                setRanking(sorted);
            } catch (error) {
                console.error("Erro ao buscar ranking:", error);
            }
            setLoading(false);
        };

        fetchRanking();
    }, []);

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <Trophy size={40} color="var(--color-gold)" style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ color: 'var(--color-gold)', margin: 0 }}>RANKING DE PRONTIDÃO</h2>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>HONRA MILITAR NO FRONT</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Calculando méritos...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {ranking.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                borderLeft: index < 3 ? '4px solid var(--color-gold)' : '2px solid var(--color-wood-light)'
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: index === 0 ? 'var(--color-gold)' : index === 1 ? '#bdc3c7' : index === 2 ? '#cd7f32' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', border: index > 2 ? '1px solid var(--color-wood-light)' : 'none',
                                    color: index < 3 ? 'var(--color-wood-dark)' : 'inherit'
                                }}>
                                    {index + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <strong style={{ display: 'block', color: 'var(--color-gold)' }}>{user.nomeGuerra}</strong>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{user.selos?.length || 0} SELOS CONQUISTADOS</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>{user.score}</div>
                                    <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>PTOS</div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => navigate('/home')} variant="secondary" fullWidth>VOLTAR AO QG</Button>
            </div>
        </div>
    );
}

export default Ranking;
