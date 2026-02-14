# PRD V3 - A FORJA: A JORNADA DO GUERREIRO

## 🎯 Visão Geral
Transformar o sistema atual em uma ferramenta completa de gerenciamento de acampantes, focada em segurança (Voucher), devocional (Eu + Deus) e organização operacional (Escalas).

## 🚀 Novas Funcionalidades (Gap Analysis)

### 1. Sistema de Portaria (Gatekeeper)
- **Voucher de Acesso:** O aplicativo deve solicitar um código de voucher unívoco antes de permitir o primeiro cadastro/login.
- **Gerador de Vouchers:** No painel Admin, o coordenador gera lotes de códigos (Ex: `ACAMP-XXXX`).
- **Associação:** Um voucher = um acampante.

### 2. Autenticação Adaptada
- **Login:** Nome de Guerra + PIN (ou Data de Nascimento DDMM).
- **Consistência:** Um dispositivo por usuário (persistência local).

### 3. Módulo "EU + DEUS" (Devocional)
- **Sermões:** Lista de mensagens com integração de notas.
- **Fixação:** Campos de texto para aprendizado.
- **Voz-para-Texto:** Botão para ditar notas (Acessibilidade).
- **Selo do Passaporte:** Cada sermão libera um selo específico mediante senha de 4 dígitos (fornecida pelo ministrante).

### 4. Gestão de Escalas (Logística)
- **Algoritmo Automático:** Distribuir tarefas (limpeza, cozinha, etc) baseando-se em:
    - Idade (>12 anos).
    - Sexo.
    - Frequência (ninguém trabalha mais que o outro).
    - Sem conflitos de horário.
- **Painel do Líder:** Arrastar e soltar (Drag & Drop) para ajustes finos.
- **Visão do Acampante:** "Minhas Missões" - vê apenas suas tarefas e quem é seu líder.

### 5. Passaporte & Ranking
- **7 Selos:** Bloqueados por senhas distintas.
- **Gamificação:** Pontos por diagnóstico + selos = Ranking de Prontidão.

## 🎨 Design & UX (Militar Rústico)
- **Mobile First:** Interface pensada para uso sob sol e em pé.
- **Nano Banana Style:** Ícones e elementos de alta fidelidade que remetem a equipamentos reais.
- **Acessibilidade:** Letras grandes e legíveis (Bebas Neue + Outfit).

## 🛠️ Stack Técnica
- **Frontend:** React + Vite + Framer Motion.
- **Backend:** Firebase (Firestore + Auth).
- **Backup:** Exportação opcional para Google Sheets para o Coordenador.
