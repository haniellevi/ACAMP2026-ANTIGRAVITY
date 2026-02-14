# Como Pegar as Chaves do Firebase (Passo a Passo)

Para o nosso sistema offline funcionar, precisamos conectar ele ao Firebase. Siga estes passos exatos:

1.  Acesse o **[Console do Firebase](https://console.firebase.google.com/)** e faça login com sua conta Google.
2.  Clique em **"Adicionar projeto"** (ou selecione um existente se já criou).
    *   Dê um nome, ex: `Acamp 2026 Forja`.
    *   Desative o Google Analytics (opcional, mas agiliza).
    *   Clique em "Criar projeto".
3.  Na tela inicial do projeto, procure o ícone de **Web** (`</>`) logo abaixo do título "Comece adicionando o Firebase ao seu aplicativo".
4.  Dê um apelido para o app (ex: `PWA Forja`) e clique em **"Registrar app"**.
5.  Role a página para baixo até ver um bloco de código escrito `const firebaseConfig = { ... };`.
6.  **Copie apenas o conteúdo dentro das chaves**, parecido com isso:

```javascript
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
```

7.  **Volte aqui no chat e cole esse código.**

---

**Nota:** Não se preocupe com os passos de "instalar firebase" (npm install), eu já fiz isso. Só preciso das chaves!
