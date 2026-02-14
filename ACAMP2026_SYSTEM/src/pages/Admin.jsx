import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getAllUsers,
    getAllVouchers,
    generateVouchers,
    generateAutomatedEscala
} from '../services/adminService';
import { checkIsAdmin } from '../services/authService';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Ticket, Users, Calendar, Plus, RefreshCcw, ShieldAlert, Share2, Clipboard } from 'lucide-react';

import { db } from '../services/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

function Admin() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [tab, setTab] = useState('VOUCHERS'); // VOUCHERS, USERS, ESCALAS
    const [loading, setLoading] = useState(true);
    const [voucherAmount, setVoucherAmount] = useState(10);

    // Proteção de Rota
    useEffect(() => {
        if (!currentUser || !checkIsAdmin(currentUser.email)) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        setLoading(true);

        // Listeners em tempo real com tratamento de erro e logs
        console.log("Iniciando monitoramento do QG Central...");

        const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            console.log("Usuários sincronizados:", snapshot.size);
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("ERRO ao sincronizar usuários:", error);
            setLoading(false);
        });

        // Vouchers ordenados por criação (mais recentes primeiro)
        const vQuery = query(collection(db, 'vouchers'), orderBy('createdAt', 'desc'));
        const unsubVouchers = onSnapshot(vQuery, (snapshot) => {
            console.log("Vouchers sincronizados:", snapshot.size);
            setVouchers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("ERRO ao sincronizar vouchers:", error);
        });


        return () => {
            unsubUsers();
            unsubVouchers();
        };
    }, []);

    const handleGenerateVouchers = async () => {
        if (voucherAmount <= 0) return;
        setLoading(true);
        await generateVouchers(Number(voucherAmount));
        setLoading(false);
    };

    const handleCopyInvite = (code) => {
        const url = "https://haniellevi.github.io/ACAMP2026-ANTIGRAVITY/";
        const message = `💂‍♂️ *CONVOCAÇÃO PARA A FORJA 2026* 💂‍♂️\n\nSoldado, o alistamento oficial foi aberto! ⚔️\nSua presença é requisitada para o maior treinamento do ano.\n\n📍 *Identidade do Front:* ${url}\n🔑 *Código de Acesso:* ${code}\n\nPrepare seus equipamentos e apresente-se no QG Digital! 🛡️🫡`;

        navigator.clipboard.writeText(message);
        alert(`Convite Militar para o voucher ${code} copiado para a área de transferência!`);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <ShieldAlert size={40} color="var(--color-fire)" style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ color: 'var(--color-gold)', margin: 0 }}>CENTRO DE COMANDO (ADMIN)</h2>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Gerencie a logística da Forja 2026</p>
            </header>

            {/* Abas de Navegação Admin */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', padding: '5px' }}>
                <Button variant={tab === 'VOUCHERS' ? 'primary' : 'secondary'} onClick={() => setTab('VOUCHERS')} style={{ flex: 1, minWidth: '120px' }}>
                    <Ticket size={16} style={{ marginRight: '4px' }} /> VOUCHERS
                </Button>
                <Button variant={tab === 'USERS' ? 'primary' : 'secondary'} onClick={() => setTab('USERS')} style={{ flex: 1, minWidth: '120px' }}>
                    <Users size={16} style={{ marginRight: '4px' }} /> SOLDADOS
                </Button>
                <Button variant={tab === 'ESCALAS' ? 'primary' : 'secondary'} onClick={() => setTab('ESCALAS')} style={{ flex: 1, minWidth: '120px' }}>
                    <Calendar size={16} style={{ marginRight: '4px' }} /> ESCALAS
                </Button>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Sincronizando com o QG Central...</div>}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={tab}>

                {tab === 'VOUCHERS' && (
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '1.5rem',
                            gap: '10px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--color-gold)', display: 'block', marginBottom: '5px' }}>QUANTIDADE PARA GERAR</label>
                                <input
                                    type="number"
                                    value={voucherAmount}
                                    onChange={(e) => setVoucherAmount(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid var(--color-wood-dark)',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <Button onClick={handleGenerateVouchers} variant="primary" style={{ height: '45px' }}>
                                <Plus size={20} /> GERAR VOUCHERS
                            </Button>
                        </div>

                        <h3>Vouchers no Sistema ({vouchers.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem' }}>
                            {vouchers.map(v => (
                                <Card key={v.id} style={{
                                    padding: '1rem', textAlign: 'center',
                                    background: v.used ? 'rgba(0,0,0,0.2)' : 'rgba(197, 157, 95, 0.1)',
                                    border: v.used ? '1px solid #444' : '1px solid var(--color-gold)',
                                    opacity: v.used ? 0.7 : 1,
                                    position: 'relative'
                                }}>
                                    <code style={{ fontSize: '1.1rem', color: 'var(--color-gold)', display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>{v.code}</code>

                                    <div style={{ padding: '4px', borderRadius: '4px', background: v.used ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.65rem', color: v.used ? '#ff6b6b' : '#51cf66', fontWeight: 'bold' }}>
                                            {v.used ? 'utilizado' : ' disponível'}
                                        </span>
                                    </div>

                                    {v.used && v.usedByName && (
                                        <div style={{ mt: '5px', borderTop: '1px solid rgba(255,255,255,0.1)', pt: '5px' }}>
                                            <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase' }}>Soldado:</p>
                                            <strong style={{ fontSize: '0.8rem', color: 'white' }}>{v.usedByName}</strong>
                                        </div>
                                    )}

                                    {!v.used && (
                                        <button
                                            onClick={() => handleCopyInvite(v.code)}
                                            style={{
                                                marginTop: '10px',
                                                background: 'none',
                                                border: '1px solid var(--color-gold)',
                                                borderRadius: '4px',
                                                padding: '5px',
                                                color: 'var(--color-gold)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '5px',
                                                width: '100%',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            <Share2 size={12} /> ENVIAR CONVITE
                                        </button>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}


                {tab === 'USERS' && (
                    <div>
                        <h3>Pelotão Alistado ({users.length} soldados)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {users.map(u => (
                                <Card key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong style={{ color: 'var(--color-gold)' }}>{u.nomeGuerra}</strong>
                                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>PIN: {u.pin} | {u.role}</p>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-sage-green)' }}>ATIVO</span>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'ESCALAS' && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Calendar size={48} opacity={0.3} style={{ marginBottom: '1rem' }} />
                        <h3>Gerenciamento de Escalas</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>O algoritmo está pronto para distribuir {users.length} soldados.</p>
                        <Button style={{ marginTop: '1rem' }}>GERAR DISTRIBUIÇÃO AUTOMÁTICA</Button>
                    </div>
                )}

            </motion.div>

            <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => navigate('/home')} variant="secondary" fullWidth>VOLTAR AO QG</Button>
            </div>
        </div>
    );
}

export default Admin;
