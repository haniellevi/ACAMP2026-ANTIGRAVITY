import { useNavigate } from 'react-router-dom';
import { SermoesService } from '../services/sermoesService';
import Card from '../components/Card';
import Button from '../components/Button';

function Sermoes() {
    const navigate = useNavigate();
    const sermoes = SermoesService.getListaSermoes();

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-old-gold)', margin: 0 }}>CADERNO DE GUERRA</h2>
                <p style={{ opacity: 0.7 }}>Anotações e Reflexões</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sermoes.map((sermao) => (
                    <Card
                        key={sermao.id}
                        style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-burnt-orange)' }}
                        onClick={() => navigate(`/sermoes/${sermao.id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--color-sage-green)',
                                    textTransform: 'uppercase'
                                }}>
                                    {sermao.data}
                                </span>
                                <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem' }}>{sermao.titulo}</h3>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Preletor: {sermao.pregador}</p>
                            </div>
                            <span style={{ fontSize: '1.5rem' }}>📝</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button onClick={() => navigate('/home')} variant="secondary">VOLTAR AO QG</Button>
            </div>
        </div>
    );
}

export default Sermoes;
