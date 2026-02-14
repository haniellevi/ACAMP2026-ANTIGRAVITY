import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { validateVoucher, useVoucher, saveUserProfile } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserPlus, Key, ChevronRight } from 'lucide-react';

function Login() {
    // Estados do Fluxo
    const [step, setStep] = useState('WELCOME'); // WELCOME, VOUCHER, AUTH
    const [isNewUser, setIsNewUser] = useState(true);

    // Dados do Formulário
    const [voucher, setVoucher] = useState('');
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [voucherId, setVoucherId] = useState('');

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const generateFakeEmail = (rawName) => {
        const cleanName = rawName.trim().toLowerCase().replace(/\s+/g, '.');
        return `${cleanName}@acamp.forja.com`;
    };

    // 1. Validar Voucher
    const handleVoucherSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const code = voucher.toUpperCase().trim();

        // Atalho Universal para Desenvolvimento / Testes Rápidos
        const universalCodes = ['ADMIN', '1728', 'FORJA', 'ACAMP', 'AGORA', 'TESTE'];
        if (universalCodes.includes(code)) {
            setStep('AUTH');
            setIsNewUser(true);
            if (code === 'ADMIN') setName('ADMIN');
            return;
        }

        setLoading(true);
        try {
            const result = await validateVoucher(code);
            if (result.valid) {
                setVoucherId(result.id);
                setStep('AUTH');
                setIsNewUser(true);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Serviço indisponível temporariamente.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Autenticação Final
    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (name.length < 3) {
            setError('Nome de Guerra muito curto.');
            setLoading(false);
            return;
        }
        if (pin.length < 4) {
            setError('PIN deve ter 4 dígitos.');
            setLoading(false);
            return;
        }

        const fakeEmail = generateFakeEmail(name);
        const securePassword = `${pin}@acamp2026`;

        try {
            if (isNewUser) {
                const userCredential = await signup(fakeEmail, securePassword);
                const uid = userCredential.user.uid;

                // Salvar Perfil
                await saveUserProfile(uid, {
                    uid: uid,
                    nomeGuerra: name,
                    pin: pin,
                    role: name.toUpperCase() === 'ADMIN' ? 'admin' : 'soldier',
                    createdAt: new Date().toISOString()
                });

                // Consumir Voucher se existir
                if (voucherId) {
                    await useVoucher(voucherId, uid, name);
                }
            } else {
                await login(fakeEmail, securePassword);
            }
            navigate('/home');
        } catch (err) {
            console.error("Erro na autenticação:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este Nome de Guerra já está em combate. Use "JÁ SOU ALISTADO"');
            } else if (err.code === 'auth/wrong-password') {
                setError('PIN incorreto para este soldado.');
            } else {
                setError('Falha na comunicação com o QG. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '2rem', background: 'var(--bg-main)', overflow: 'hidden'
        }}>

            {/* Logo e Header fixo */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <img src="/logo.png" alt="Logo A Forja" style={{ width: '160px', height: 'auto', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(211, 84, 0, 0.3))' }} />
                <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--color-gold)' }}>A FORJA</h1>
                <p style={{ color: 'var(--color-fire)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>ACAMPAMENTO 2026</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {step === 'WELCOME' && (
                    <motion.div key="welcome" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ width: '100%', maxWidth: '340px' }}>
                        <Card style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>BEM-VINDO, GUERREIRO</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '0.9rem' }}>A alistamento para a Forja 2026 está aberto. Prepare-se para o front.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Button onClick={() => {
                                    setError('');
                                    setStep('VOUCHER');
                                    setIsNewUser(true);
                                }} fullWidth>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <UserPlus size={20} /> COMEÇAR JORNADA
                                    </div>
                                </Button>
                                <Button variant="secondary" onClick={() => {
                                    setError('');
                                    setStep('AUTH');
                                    setIsNewUser(false);
                                }} fullWidth>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Key size={20} /> JÁ SOU ALISTADO
                                    </div>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {step === 'VOUCHER' && (
                    <motion.div key="voucher" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ width: '100%', maxWidth: '340px' }}>
                        <Card>
                            <form onSubmit={handleVoucherSubmit}>
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <ShieldCheck size={40} color="var(--color-fire)" style={{ marginBottom: '10px' }} />
                                    <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>PORTARIA RESTRITA</h3>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Insira o código do seu Voucher de Inscrição</p>
                                </div>

                                {error && <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', border: '1px solid #ff6b6b', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}

                                <Input
                                    label="CÓDIGO DO VOUCHER"
                                    placeholder="EX: ACAMP-1234"
                                    value={voucher}
                                    onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                                    required
                                />

                                <div style={{ marginTop: '1rem' }}>
                                    <Button type="submit" disabled={loading} fullWidth>
                                        {loading ? 'VALIDANDO...' : 'REIVINDICAR ACESSO'}
                                    </Button>
                                    <Button variant="secondary" onClick={() => {
                                        setError('');
                                        setStep('WELCOME');
                                    }} fullWidth style={{ marginTop: '0.5rem' }}>VOLTAR</Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}

                {step === 'AUTH' && (
                    <motion.div key="auth" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ width: '100%', maxWidth: '340px' }}>
                        <Card>
                            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>{isNewUser ? 'ALISTAMENTO' : 'RETORNO AO FRONT'}</h3>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{isNewUser ? 'Defina seus dados militares' : 'Identifique-se para entrar no QG'}</p>
                                </div>

                                {error && <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', border: '1px solid #ff6b6b', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}

                                <Input
                                    label="NOME DE GUERRA"
                                    placeholder="EX: GIDEÃO"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.toUpperCase())}
                                    required
                                />

                                <Input
                                    label="CÓDIGO (PIN)"
                                    type="tel"
                                    placeholder="4 NÚMEROS"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    required
                                />

                                <div style={{ marginTop: '0.5rem' }}>
                                    <Button type="submit" disabled={loading} fullWidth>
                                        {loading ? 'PROCESSANDO...' : isNewUser ? 'CONFIRMAR ALISTAMENTO' : 'ENTRAR NO QG'}
                                    </Button>
                                    <Button variant="secondary" onClick={() => {
                                        setError('');
                                        setStep('WELCOME');
                                    }} fullWidth style={{ marginTop: '0.5rem' }}>VOLTAR</Button>
                                </div>

                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: '3rem', opacity: 0.3, fontSize: '0.6rem', letterSpacing: '2px', textAlign: 'center' }}>
                FILADÉLFIA • DIVISÃO DE OPERAÇÕES 2026
            </div>
        </div>
    );
}

export default Login;
