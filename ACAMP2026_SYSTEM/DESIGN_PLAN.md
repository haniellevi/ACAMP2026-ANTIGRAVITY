# Plano de Design: ACAMP 2026 - A FORJA (V3)

## 🎨 Identidade Visual (Baseada no Logo)
O design será focado no tema **"Aventura Rústica & Militar"**, utilizando texturas de madeira, couro e elementos de bússola/mapa.

### 1. Paleta de Cores (Extraída do Logo)
- **Primary (Madeira Escura):** `#2D1E17` (Fundo principal)
- **Secondary (Laranja Brasa):** `#D35400` (Ação/Atenção)
- **Accent (Ouro Velho):** `#C59D5F` (Destaques e borders)
- **Paper (Branco Pergaminho):** `#F4EBD0` (Textos e áreas de leitura)
- **Forest (Verde Musgo):** `#3E4A3D` (Sucesso/Escalas)

### 2. Tipografia
- **Títulos (Display/Hero):** `Bebas Neue` ou `Alumni Sans Pinstripe` para um ar militar/aventureiro.
- **Corpo:** `Outfit` ou `Inter` para legibilidade máxima em telas pequenas.

### 3. Componentes Customizados (UI Experimental)
- **Wooden Buttons:** Botões com textura de madeira e bordas entalhadas (CSS `mask-image` ou gradients).
- **Compass Nav:** Navegação inferior estilizada como uma bússola.
- **Parchment Cards:** Cards com fundo suave de pergaminho para textos longos (Sermões/Devocionais).

## 🛠️ Plano de Execução
1.  **Refatoração do `variables.css`:** Novos tokens de design baseados na paleta acima.
2.  **Global UI Update (`index.css`):** Reset visual completo, removendo o visual genérico de framework.
3.  **Refatoração de Componentes:** Criar componentes de Botão e Card que se comportem como "equipamentos" de sobrevivência.
4.  **Imagens Hero:** Gerar ilustrações de estilo "survivalist art" para as seções.
