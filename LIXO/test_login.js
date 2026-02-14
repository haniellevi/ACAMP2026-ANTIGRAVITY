const https = require('https');

// URL obtida do deploy anterior
const API_URL = 'https://script.google.com/macros/s/AKfycbzwZ0Jtd6BJSRvj-A3l4pEjslkxrmuqb5scv1qvr_j9SoPP8eG6UIz_8_jZs4gDhgKh/exec';

const payload = JSON.stringify({
    action: 'adminLogin',
    email: 'igrejafiladelfiacorrente@gmail.com',
    senha: '1728'
});

// Simula a requisição JSONP feita pelo frontend
const fullUrl = `${API_URL}?action=post&callback=_jsonp_cb_test&payload=${encodeURIComponent(payload)}`;

console.log('=== INICIANDO TESTE DE LOGIN ===');
console.log('URL Base:', API_URL);
console.log('Payload:', payload);

https.get(fullUrl, (res) => {
    // Seguir redirecionamentos é importante para o Google Apps Script
    if (res.statusCode === 302) {
        console.log('Redirecionado para:', res.headers.location);
        https.get(res.headers.location, (res2) => {
            let data = '';
            res2.on('data', chunk => data += chunk);
            res2.on('end', () => {
                console.log('=== RESPOSTA DA API ===');
                console.log(data);
            });
        });
    } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('=== RESPOSTA DA API ===');
            console.log(data);
        });
    }
}).on('error', (err) => {
    console.error('❌ ERRO NA REQUISIÇÃO:', err.message);
});
