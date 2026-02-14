import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EscalasService } from '../services/escalasService';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

function Escalas() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [escalas, setEscalas] = useState([]);
    const [filtroMinhas, setFiltroMinhas] = useState(false);

    useEffect(() => {
        EscalasService.getEscalas().then(setEscalas);
    }, []);

    const nomeGuerra = currentUser?.email?.split('@')[0] || '';

    const escalasExibidas = filtroMinhas
        ? escalas.filter(e => e.equipe.some(m => m.toLowerCase().includes(nomeGuerra.toLowerCase())))
        : escalas;

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-old-gold)', margin: 0 }}>ORDENS DE SERVIÇO</h2>
                <p style={{ opacity: 0.7 }}>Escalas e Turnos</p>
            </header>

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Button
                    onClick={() => setFiltroMinhas(false)}
                    variant={!filtroMinhas ? 'primary' : 'secondary'}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                    TODAS
                </Button>
                <Button
                    onClick={() => setFiltroMinhas(true)}
                    variant={filtroMinhas ? 'primary' : 'secondary'}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                    MINHAS MISSÕES
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {escalasExibidas.map((escala) => (
                    <Card
                        key={escala.id}
                        style={{ borderLeft: '4px solid var(--color-sage-green)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-old-gold)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                {escala.horario}
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Líder: {escala.lider}</span>
                        </div>

                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>{escala.titulo}</h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {escala.equipe.map(pessoa => (
                                <span key={pessoa} style={{
                                    backgroundColor: pessoa.toLowerCase().includes(nomeGuerra.toLowerCase()) ? 'var(--color-burnt-orange)' : 'rgba(255,255,255,0.1)',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-paper-white)'
                                }}>
                                    {pessoa}
                                </span>
                            ))}
                        </div>
                    </Card>
                ))}

                {escalasExibidas.length === 0 && (
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '2rem' }}>
                        <p>Nenhuma missão encontrada.</p>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button onClick={() => navigate('/home')} variant="secondary">VOLTAR AO QG</Button>
            </div>
        </div>
    );
}

export default Escalas;
