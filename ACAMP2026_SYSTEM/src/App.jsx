import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Passaporte from './pages/Passaporte';
import Sermoes from './pages/Sermoes';
import SermaoDetalhe from './pages/SermaoDetalhe';
import Escalas from './pages/Escalas';
import Diagnostico from './pages/Diagnostico';
import Admin from './pages/Admin';
import Ranking from './pages/Ranking';
import Ferramentas from './pages/Ferramentas';
import Regras from './pages/Regras';
import Programacao from './pages/Programacao';

// Componente para Proteger Rotas
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-body)'
        }}>
          <Routes>
            {/* Rota Pública */}
            <Route path="/" element={<Login />} />

            {/* Rotas Privadas */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/passaporte" element={<PrivateRoute><Passaporte /></PrivateRoute>} />
            <Route path="/sermoes" element={<PrivateRoute><Sermoes /></PrivateRoute>} />
            <Route path="/sermoes/:id" element={<PrivateRoute><SermaoDetalhe /></PrivateRoute>} />
            <Route path="/escalas" element={<PrivateRoute><Escalas /></PrivateRoute>} />
            <Route path="/ranking" element={<PrivateRoute><Ranking /></PrivateRoute>} />
            <Route path="/diagnostico" element={<PrivateRoute><Diagnostico /></PrivateRoute>} />
            <Route path="/ferramentas" element={<PrivateRoute><Ferramentas /></PrivateRoute>} />
            <Route path="/regras" element={<PrivateRoute><Regras /></PrivateRoute>} />
            <Route path="/programacao" element={<PrivateRoute><Programacao /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
