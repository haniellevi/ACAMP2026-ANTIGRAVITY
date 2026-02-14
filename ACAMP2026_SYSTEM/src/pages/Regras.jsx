import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ShieldCheck,
    Clock,
    Flame,
    Droplets,
    Utensils,
    Brush,
    AlertTriangle
} from 'lucide-react';

function Regras() {
    const navigate = useNavigate();

    const regras = [
        { title: "HONRA E RESPEITO", desc: "Honrar a liderança e respeitar cada soldado de Cristo no campo.", icon: <ShieldCheck size={28} /> },
        { title: "PONTUALIDADE", desc: "A alvorada e os cultos não esperam. Esteja pronto 5 min antes.", icon: <Clock size={28} /> },
        { title: "DISCIPLINA", desc: "Celulares apenas para o app e anotações nos momentos permitidos.", icon: <AlertTriangle size={28} /> },
        { title: "LIMPEZA (ZELO)", desc: "Mantenha sua barraca e áreas comuns impecáveis. O lixo tem lugar certo.", icon: <Brush size={28} /> },
        { title: "CONSUMO CONSCIENTE", desc: "Água e comida são preciosos. Evite desperdícios.", icon: <Utensils size={28} /> },
        { title: "BANHOS RÁPIDOS", desc: "Respeite o tempo do seu irmão. 5 a 10 minutos no máximo.", icon: <Droplets size={28} /> },
        { title: "SILÊNCIO", desc: "Após o 'Apagar Luzes', o silêncio é absoluto para o descanso da tropa.", icon: <Flame size={28} /> }
    ];

    return (
        <div className="page-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                <Button variant="ghost" onClick={() => navigate('/home')} style={{ padding: '5px' }}>
                    <ChevronLeft size={24} />
                </Button>
                <h1 style={{ fontSize: '1.8rem' }}>CÓDIGO DE CONDUTA</h1>
            </div>

            <Card style={{ marginBottom: '20px', border: '1px dashed var(--color-fire)' }}>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
                    "Ninguém que milita se embaraça com negócios desta vida, a fim de agradar àquele que o alistou para a guerra." <br />
                    <strong>2 Timóteo 2:4</strong>
                </p>
            </Card>

            <div style={{ display: 'grid', gap: '15px' }}>
                {regras.map((regra, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px' }}>
                            <div style={{
                                color: 'var(--color-gold)',
                                background: 'var(--color-wood-dark)',
                                padding: '10px',
                                borderRadius: '8px'
                            }}>
                                {regra.icon}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: 'var(--color-gold)', letterSpacing: '1px' }}>{regra.title}</h4>
                                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>{regra.desc}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card style={{ marginTop: '25px', background: 'var(--color-wood-dark)', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>INFRAÇÕES</h3>
                <p style={{ fontSize: '0.8rem', margin: '5px 0 0', opacity: 0.7 }}>O descumprimento das regras resultará em perda de pontos no ranking do pelotão.</p>
            </Card>
        </div>
    );
}

export default Regras;
