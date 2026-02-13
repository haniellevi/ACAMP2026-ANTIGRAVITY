// =============================================================
// BACKEND DO APP WEB DO ACAMPANTE — DISCÍPULO RADICAL 2026
// =============================================================
// INSTRUÇÕES:
// 1. Crie uma planilha no Google Sheets com 3 abas: "Acampantes", "Admins", "LogSelos"
// 2. Vá em Extensões > Apps Script
// 3. Cole este código inteiro
// 4. Rode a função setupSheets() uma vez para criar os cabeçalhos
// 5. Implante: Implantar > Nova implantação > App da Web > Qualquer pessoa
// 6. Copie a URL gerada (formato: https://script.google.com/macros/s/.../exec)
// 7. Cole essa URL no app.html (variável API_URL)
// ⚠️ NÃO use a URL de Biblioteca! Use a URL de "App da Web" (termina com /exec)
// =============================================================

// SENHAS DOS SELOS (4 DÍGITOS) - SOMENTE NO BACKEND!
var SEAL_PASSWORDS = {
  1: '4821',  // Renúncia
  2: '7356',  // Renovação
  3: '1947',  // Identidade
  4: '6283',  // Comunhão
  5: '5094',  // Honra
  6: '3617',  // Serviço
  7: '8472'   // Envio
};

// ============ CONFIGURAÇÃO INICIAL (rodar UMA VEZ) ============
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Aba Acampantes
  var acampantes = ss.getSheetByName('Acampantes');
  if (!acampantes) acampantes = ss.insertSheet('Acampantes');
  acampantes.clear();
  acampantes.appendRow([
    'ID', 'Nome', 'DataNascimento', 'Sexo', 'Idade', 'DataCadastro',
    'Selo1', 'Selo2', 'Selo3', 'Selo4', 'Selo5', 'Selo6', 'Selo7',
    'RegistradoPor'
  ]);
  acampantes.getRange(1, 1, 1, 14).setFontWeight('bold');
  acampantes.setFrozenRows(1);

  // Aba Admins
  var admins = ss.getSheetByName('Admins');
  if (!admins) admins = ss.insertSheet('Admins');
  admins.clear();
  admins.appendRow(['Email', 'Senha', 'Nome', 'Nivel', 'Ativo']);
  admins.appendRow(['igrejafiladelfiacorrente@gmail.com', '1728', 'Coordenação Geral', 'master', true]);
  admins.getRange(1, 1, 1, 5).setFontWeight('bold');
  admins.setFrozenRows(1);

  // Aba LogSelos
  var log = ss.getSheetByName('LogSelos');
  if (!log) log = ss.insertSheet('LogSelos');
  log.clear();
  log.appendRow(['Timestamp', 'AcampanteID', 'NomeCampista', 'NumSelo', 'ValidadoPor']);
  log.getRange(1, 1, 1, 5).setFontWeight('bold');
  log.setFrozenRows(1);
}

// ============ ROTA PRINCIPAL (tudo via GET + JSONP) ============
function doGet(e) {
  var cb = e.parameter.callback || null;
  try {
    var action = e.parameter.action || 'getAll';

    // Ações de escrita (recebidas como payload JSON na URL)
    if (action === 'post') {
      var data = JSON.parse(e.parameter.payload);
      switch (data.action) {
        case 'register': return respond(registerCamper(data), cb);
        case 'validateSeal': return respond(validateSeal(data), cb);
        case 'adminLogin': return respond(adminLogin(data), cb);
        case 'addAdmin': return respond(addAdmin(data), cb);
        case 'adminRegisterCamper': return respond(adminRegisterCamper(data), cb);
        case 'adminApplySeal': return respond(adminApplySeal(data), cb);
        default: return respond({ status: 'error', message: 'Ação desconhecida' }, cb);
      }
    }

    // Ações de leitura
    switch (action) {
      case 'getAll': return respond(getAllCampers(), cb);
      case 'getCamper': return respond(getCamperById(e.parameter.id), cb);
      case 'getStats': return respond(getStats(), cb);
      case 'checkDevice': return respond(checkDevice(e.parameter.id), cb);
      default: return respond({ status: 'error', message: 'Ação desconhecida' }, cb);
    }
  } catch (err) {
    return respond({ status: 'error', message: err.toString() }, cb);
  }
}

// Mantém doPost como fallback
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    switch (data.action) {
      case 'register': return jsonOut(registerCamper(data));
      case 'validateSeal': return jsonOut(validateSeal(data));
      case 'adminLogin': return jsonOut(adminLogin(data));
      case 'addAdmin': return jsonOut(addAdmin(data));
      case 'adminRegisterCamper': return jsonOut(adminRegisterCamper(data));
      case 'adminApplySeal': return jsonOut(adminApplySeal(data));
      default: return jsonOut({ status: 'error', message: 'Ação desconhecida' });
    }
  } catch (err) {
    return jsonOut({ status: 'error', message: err.toString() });
  }
}

// ============ FUNÇÕES ACAMPANTE ============
function registerCamper(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Acampantes');
  var id = Utilities.getUuid();
  var hoje = new Date();
  var nascimento = new Date(data.dataNascimento);
  var idade = Math.floor((hoje - nascimento) / (365.25 * 24 * 60 * 60 * 1000));

  sheet.appendRow([
    id, data.nome, data.dataNascimento, data.sexo, idade, hoje,
    false, false, false, false, false, false, false,
    data.registradoPor || 'self'
  ]);

  return { status: 'success', id: id, nome: data.nome, idade: idade };
}

function getCamperById(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Acampantes');
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return {
        status: 'success',
        camper: {
          id: data[i][0], nome: data[i][1], dataNascimento: data[i][2],
          sexo: data[i][3], idade: data[i][4], dataCadastro: data[i][5],
          selos: [data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11], data[i][12]]
        }
      };
    }
  }
  return { status: 'error', message: 'Acampante não encontrado' };
}

function checkDevice(id) {
  if (!id) return { status: 'not_found' };
  var result = getCamperById(id);
  if (result.camper) return { status: 'found', camper: result.camper };
  return { status: 'not_found' };
}

// ============ VALIDAÇÃO DE SELO ============
function validateSeal(data) {
  var sealNum = parseInt(data.sealNum);
  var password = data.password;
  var camperId = data.camperId;

  if (!SEAL_PASSWORDS[sealNum]) return { status: 'error', message: 'Selo inválido' };
  if (SEAL_PASSWORDS[sealNum] !== password) return { status: 'error', message: 'Senha incorreta!' };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Acampantes');
  var dataAll = sheet.getDataRange().getValues();

  for (var i = 1; i < dataAll.length; i++) {
    if (dataAll[i][0] === camperId) {
      var col = 6 + sealNum;
      sheet.getRange(i + 1, col).setValue(true);

      var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LogSelos');
      logSheet.appendRow([new Date(), camperId, dataAll[i][1], sealNum, data.validadoPor || 'self']);

      return { status: 'success', message: 'Selo validado!', sealNum: sealNum };
    }
  }
  return { status: 'error', message: 'Acampante não encontrado' };
}

// ============ FUNÇÕES ADMIN ============
function adminLogin(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Admins');
  var admins = sheet.getDataRange().getValues();

  for (var i = 1; i < admins.length; i++) {
    if (admins[i][0] === data.email && String(admins[i][1]) === String(data.senha) && admins[i][4] === true) {
      return {
        status: 'success',
        admin: { email: admins[i][0], nome: admins[i][2], nivel: admins[i][3] }
      };
    }
  }
  return { status: 'error', message: 'Email ou senha incorretos' };
}

function addAdmin(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Admins');
  sheet.appendRow([data.email, data.senha, data.nome, data.nivel || 'coordenador', true]);
  return { status: 'success', message: 'Admin adicionado!' };
}

function adminRegisterCamper(data) {
  return registerCamper({
    nome: data.nome, dataNascimento: data.dataNascimento,
    sexo: data.sexo, registradoPor: data.adminEmail
  });
}

function adminApplySeal(data) {
  return validateSeal({
    sealNum: data.sealNum, password: SEAL_PASSWORDS[parseInt(data.sealNum)],
    camperId: data.camperId, validadoPor: data.adminEmail
  });
}

function getAllCampers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Acampantes');
  var data = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < data.length; i++) {
    result.push({
      id: data[i][0], nome: data[i][1], dataNascimento: data[i][2],
      sexo: data[i][3], idade: data[i][4], dataCadastro: data[i][5],
      selos: [data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11], data[i][12]],
      registradoPor: data[i][13]
    });
  }
  return { status: 'success', campers: result, total: result.length };
}

function getStats() {
  var all = getAllCampers();
  var campers = all.campers;
  var masc = campers.filter(function (c) { return c.sexo === 'M' }).length;
  var fem = campers.filter(function (c) { return c.sexo === 'F' }).length;
  var idades = campers.map(function (c) { return c.idade }).filter(function (a) { return a > 0 });
  var mediaIdade = idades.length > 0 ? (idades.reduce(function (a, b) { return a + b }, 0) / idades.length).toFixed(1) : 0;

  var faixas = { '10-14': 0, '15-19': 0, '20-24': 0, '25-29': 0, '30+': 0 };
  idades.forEach(function (i) {
    if (i <= 14) faixas['10-14']++;
    else if (i <= 19) faixas['15-19']++;
    else if (i <= 24) faixas['20-24']++;
    else if (i <= 29) faixas['25-29']++;
    else faixas['30+']++;
  });

  var selosCount = [0, 0, 0, 0, 0, 0, 0];
  campers.forEach(function (c) {
    for (var idx = 0; idx < c.selos.length; idx++) {
      if (c.selos[idx] === true) selosCount[idx]++;
    }
  });

  return {
    status: 'success', total: campers.length,
    masculino: masc, feminino: fem, mediaIdade: parseFloat(mediaIdade),
    faixas: faixas, selosCount: selosCount
  };
}

// ============ HELPERS ============
// JSONP: retorna callback(json) quando callback está presente
function respond(data, callback) {
  if (callback) {
    var js = callback + '(' + JSON.stringify(data) + ')';
    return ContentService.createTextOutput(js).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function jsonOut(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
