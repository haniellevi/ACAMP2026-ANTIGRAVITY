# Product Requirements Document (PRD) - ACAMP 2026: "A Forja"

## 1. Visão Geral
Sistema de gestão e gamificação para acampamento da igreja, focado na experiência do acampante ("Guerreiro") e gestão da liderança ("Comando").
**Diferencial Crítico:** Funcionalidade **Offline-First**. O app deve funcionar plenamente em um ambiente com conectividade intermitente ou inexistente (sincronização posterior).

## 2. Objetivos
- **Engajamento:** Gamificar a participação nos cultos e atividades através de "Selos" e "Passaporte".
- **Organização:** Gerir escalas de serviço (limpeza, cozinha) e agenda.
- **Espiritualidade:** Incentivar anotações de sermões e reflexão.
- **Resiliência:** Operar sem internet, garantindo que dados (respostas de quiz, anotações) não sejam perdidos.

## 3. Stack Tecnológica Recomendada
Para atender aos requisitos de **GitHub Pages** (custo zero, estático) e **Offline Robusto**:

*   **Frontend (PWA):** React.js com Vite.
    *   *Por que?* Leve, rápido e permite criar um PWA (Progressive Web App) instalável no celular.
*   **Banco de Dados & Auth:** Firebase (Firestore + Authentication).
    *   *Por que?* O Firestore possui **persistência offline nativa** no SDK Web. Se a internet cair, o app continua lendo/escrevendo no banco local. Assim que o sinal volta, ele sincroniza automaticamente. Melhor que LocalStorage + API Google Sheets.
*   **Hospedagem:** GitHub Pages (via GitHub Actions).
*   **Estilização:** CSS Modules ou Vanilla CSS (com variáveis CSS modernas) para controle total do tema "Rústico".

## 4. Personas
1.  **Guerreiro (Acampante):**
    *   Acessa escala, agenda, passaporte.
    *   Responde quizzes, anota sermões.
    *   Visualiza progresso.
2.  **Comando (Admin/Líder):**
    *   Gerencia usuários.
    *   Gerencia escalas (move pessoas).
    *   Gera vouchers de pontuação.
    *   Visualiza estatísticas.

## 5. Funcionalidades Detalhadas

### 5.1. Autenticação & Perfil
- **Login/Cadastro:** Nome, Data de Nascimento, Sexo De/Para (Quarto).
- **Foto de Perfil:** Upload local (armazenado em Base64 ou Firebase Storage se houver rede, com fallback local).
- **Modo Offline:** O login persiste indefinidamente.

### 5.2. Passaporte & Gamificação (Core)
- **Painel de Selos:** Grid de 7 a 12 selos representando conquistas espirituais (ex: "Renúncia", "Identidade").
- **Mecânica de Desbloqueio:**
    1.  **Via Quiz:** Responder corretamente pergunta sobre o sermão.
    2.  **Via Senha (Pin Pad):** Digitar código numérico fornecido pelo líder.
    3.  **Via Voucher:** Código alfanumérico para prêmios especiais.
- **Progresso:** Barra de progresso visual (ex: "3/7 Selos - Patente: Cabo").

### 5.3. Espiritualidade (Eu + Deus)
- **Lista de Sermões:** Cartões para cada culto programado.
- **Anotações (Caderno de Guerra):**
    *   Campo de texto livre para "Rhema" (o que Deus falou).
    *   **Requisito Offline:** As notas devem ser salvas localmente imediatamente e sincronizadas quando possível.
- **Quiz de Fixação:** Perguntas de múltipla escolha associadas a cada sermão.

### 5.4. Gestão de Escalas (Missões)
- **Minhas Escalas:** Visualização filtrada onde o usuário vê apenas ONDE e QUANDO deve servir.
- **Gestão (Admin):**
    *   Interface "Drag & Drop" ou "Tap to Move" para realocar acampantes entre equipes (ex: tirar da "Cozinha" e por na "Limpeza").
    *   **Geração Automática:** Algoritmo para distribuir tarefas garantindo rotação (ninguém fica na cozinha 2x seguidas).

### 5.5. Agenda & Regras
- **Timeline:** Agenda completa do evento (Sábado/Domingo/Segunda).
- **Destaque:** Widget "Próxima Atividade" na home.
- **Regras:** Tela de leitura obrigatória com diretrizes de convivência.

## 6. Regras de Negócio e UX
1.  **Bloqueio de Navegação:** Admin não pode acessar dashboard sem login.
2.  **Feedback Visual:** Todo erro (ex: sem internet) deve gerar um Toast não intrusivo.
3.  **Sincronização Silenciosa:** O usuário não deve precisar clicar em "Sincronizar". O app deve tentar em background.
4.  **Conflito de Escala:** O sistema deve avisar se tentar colocar a mesma pessoa em duas tarefas no mesmo horário.

## 7. UI/UX Design System: "A Forja"
**Conceito:** Acampamento militar vintage, exploração, diário de campo gasto.

### Identidade Visual
*   **Cores:**
    *   `Dark Earth` (#1e1b18): Fundo principal.
    *   `Burnt Orange` (#d35400): Ações de destaque/alerta (Fogo).
    *   `Sage Green` (#8da399): Elementos de sucesso/segurança (Musgo).
    *   `Old Gold` (#f1c40f): Conquistas e Títulos (Ouro envelhecido).
    *   `Paper White` (#ecf0f1): Texto (evitar branco absoluto).
*   **Tipografia:**
    *   Títulos: *Bebas Neue* (Impacto, militar).
    *   Corpo: *Roboto Slab* ou *Bitter* (Legibilidade, estilo máquina de escrever/jornal antigo).
*   **Componentes:**
    *   **Cards:** Bordas levemente irregulares, textura de papel craft/papelão.
    *   **Botões:** Estilo "Carimbo" ou "Etiqueta Militar".
    *   **Ícones:** Estilo "Sketch" (desenhado a mão) ou Símbolos Militares simplificados.

### Fluxo de Navegação
*   **Bottom Navigation:** Acesso rápido às 4 áreas principais (Base, Eu+Deus, Agenda, Passaporte).
*   **Gestos:** Swipe para mudar de abas na agenda.

## 8. Estrutura de Pastas Sugerida (Novo Projeto)
```
/ACAMP_SYSTEM_V2
  /public (assets, manifest.json, service-worker.js)
  /src
    /assets (images, fonts)
    /components (Button, Card, Modal, Toast)
    /context (AuthContext, DataContext)
    /hooks (useOfflineSync)
    /pages (Home, Login, Admin, Scales)
    /services (firebaseConfig, offlineStorage)
    /styles (CSS Modules / Global)
    main.jsx
    App.jsx
  vite.config.js
  package.json
```
