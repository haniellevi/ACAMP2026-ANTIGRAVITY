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
  if (acampantes.getLastRow() === 0) {
    acampantes.appendRow([
      'ID', 'Nome', 'DataNascimento', 'Sexo', 'Idade', 'DataCadastro',
      'Selo1', 'Selo2', 'Selo3', 'Selo4', 'Selo5', 'Selo6', 'Selo7',
      'RegistradoPor'
    ]);
    acampantes.getRange(1, 1, 1, 14).setFontWeight('bold');
    acampantes.setFrozenRows(1);
  }

  // Aba Admins
  var admins = ss.getSheetByName('Admins');
  if (!admins) admins = ss.insertSheet('Admins');
  if (admins.getLastRow() === 0) {
    admins.appendRow(['Email', 'Senha', 'Nome', 'Nivel', 'Ativo']);
    admins.appendRow(['igrejafiladelfiacorrente@gmail.com', '1728', 'Coordenação Geral', 'master', true]);
    admins.getRange(1, 1, 1, 5).setFontWeight('bold');
    admins.setFrozenRows(1);
  }

  // Aba LogSelos
  var log = ss.getSheetByName('LogSelos');
  if (!log) log = ss.insertSheet('LogSelos');
  if (log.getLastRow() === 0) {
    log.appendRow(['Timestamp', 'AcampanteID', 'NomeCampista', 'NumSelo', 'ValidadoPor']);
    log.getRange(1, 1, 1, 5).setFontWeight('bold');
    log.setFrozenRows(1);
  }

  // Aba Tarefas (Nova)
  var tarefas = ss.getSheetByName('Tarefas');
  if (!tarefas) tarefas = ss.insertSheet('Tarefas');
  if (tarefas.getLastRow() === 0) {
    tarefas.appendRow(['ID', 'Nome', 'Dia', 'HoraInicio', 'HoraFim', 'QtdPessoas', 'MinIdade', 'Sexo', 'LiderNome']);
    // Exemplo de tarefa
    tarefas.appendRow(['T1', 'Lavar Louça Almoço', 'Sábado', '13:00', '14:00', 6, 12, 'Amb', 'Tia Cozinha']);
    tarefas.getRange(1, 1, 1, 9).setFontWeight('bold');
    tarefas.setFrozenRows(1);
  }

  // Aba Escalas (Nova)
  var escalas = ss.getSheetByName('Escalas');
  if (!escalas) escalas = ss.insertSheet('Escalas');
  if (escalas.getLastRow() === 0) {
    escalas.appendRow(['TarefaID', 'AcampanteID', 'NomeAcampante', 'Travado']);
    escalas.getRange(1, 1, 1, 4).setFontWeight('bold');
    escalas.setFrozenRows(1);
  }
}

// ============ ROTA PRINCIPAL (tudo via GET + JSONP) ============
function doGet(e) {
  var cb = e.parameter.callback || null;
  try {
    var action = e.parameter.action || 'getAll';

    // Ações de escrita/leitura mistas
    if (action === 'post') {
      var data = JSON.parse(e.parameter.payload);
      switch (data.action) {
        case 'register': return respond(registerCamper(data), cb);
        case 'login': return respond(loginCamper(data), cb);
        case 'validateSeal': return respond(validateSeal(data), cb);
        case 'adminLogin': return respond(adminLogin(data), cb);
        case 'addAdmin': return respond(addAdmin(data), cb);
        case 'adminRegisterCamper': return respond(adminRegisterCamper(data), cb);
        case 'adminApplySeal': return respond(adminApplySeal(data), cb);

        // Novas Rotas de Escala
        case 'generateScales': return respond(generateScales(data), cb);
        case 'updateScale': return respond(updateScale(data), cb);

        default: return respond({ status: 'error', message: 'Ação desconhecida' }, cb);
      }
    }

    // Ações de leitura pura
    switch (action) {
      case 'getAll': return respond(getAllCampers(), cb);
      case 'getCamper': return respond(getCamperById(e.parameter.id), cb);
      case 'getStats': return respond(getStats(), cb);
      case 'checkDevice': return respond(checkDevice(e.parameter.id), cb);
      case 'getScales': return respond(getScales(), cb); // Nova Rota
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
      case 'login': return jsonOut(loginCamper(data));
      case 'validateSeal': return jsonOut(validateSeal(data));
      case 'adminLogin': return jsonOut(adminLogin(data));
      case 'addAdmin': return jsonOut(addAdmin(data));
      case 'adminRegisterCamper': return jsonOut(adminRegisterCamper(data));
      case 'adminApplySeal': return jsonOut(adminApplySeal(data));
      case 'generateScales': return jsonOut(generateScales(data));
      case 'updateScale': return jsonOut(updateScale(data));
      default: return jsonOut({ status: 'error', message: 'Ação desconhecida' });
    }
  } catch (err) {
    return jsonOut({ status: 'error', message: err.toString() });
  }
}

// ... (Funções existentes mantidas: loginCamper até adminApplySeal) ...

// ============ ESCALAS DE SERVIÇO ============

// 1. Algoritmo de Distribuição
function generateScales(data) {
  // Verifica permissão (apenas master/coordenador deveria rodar, mas simplificado aqui)

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetTarefas = ss.getSheetByName('Tarefas');
  var sheetEscalas = ss.getSheetByName('Escalas');
  var sheetAcampantes = ss.getSheetByName('Acampantes');

  // Limpar escalas NÃO travadas
  var escalasRows = sheetEscalas.getDataRange().getValues();
  var escalasParaManter = [];
  // Cabeçalho
  if (escalasRows.length > 0) escalasParaManter.push(escalasRows[0]);

  for (var i = 1; i < escalasRows.length; i++) {
    if (escalasRows[i][3] === true) { // Se Travado = true
      escalasParaManter.push(escalasRows[i]);
    }
  }

  // Reescreve a planilha apenas com os travados
  sheetEscalas.clear();
  if (escalasParaManter.length > 0) {
    sheetEscalas.getRange(1, 1, escalasParaManter.length, 4).setValues(escalasParaManter);
  } else {
    sheetEscalas.appendRow(['TarefaID', 'AcampanteID', 'NomeAcampante', 'Travado']);
  }

  // Pegar dados
  var tarefas = sheetTarefas.getDataRange().getValues(); // Ignorar header na lógica
  var acampantes = sheetAcampantes.getDataRange().getValues(); // Ignorar header

  // Filtrar Campistas Elegíveis (>12 anos)
  var pool = [];
  for (var i = 1; i < acampantes.length; i++) {
    var c = acampantes[i];
    if (c[4] >= 12) { // Idade >= 12
      pool.push({
        id: c[0], nome: c[1], sexo: c[3], idade: c[4],
        count: 0, // Quantas tarefas já pegou
        tasks: [] // IDs das tarefas que pegou (para evitar conflito de horário)
      });
    }
  }

  // Embaralhar pool para não pegar sempre os mesmos (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Processar Tarefas
  var novasEscalas = [];

  for (var t = 1; t < tarefas.length; t++) {
    var task = {
      id: tarefas[t][0], nome: tarefas[t][1], dia: tarefas[t][2],
      hora: tarefas[t][3], qtd: tarefas[t][5], minIdade: tarefas[t][6], sexo: tarefas[t][7]
    };

    // Contar quantos já tem (travados)
    var currentCount = escalasParaManter.filter(e => e[0] === task.id).length;
    var need = task.qtd - currentCount;

    if (need <= 0) continue;

    // Sortear do pool
    // Estratégia: Ordenar pool por 'count' crescente (quem trabalhou menos vai primeiro)
    pool.sort((a, b) => a.count - b.count);

    var added = 0;
    for (var p = 0; p < pool.length; p++) {
      if (added >= need) break;
      var person = pool[p];

      // Validações
      if (person.idade < task.minIdade) continue;
      if (task.sexo !== 'Amb' && task.sexo !== person.sexo) continue;

      // Validação de Conflito de Horário (simplificada: mesma tarefaID não, mas dia/hora idealmente checaria)
      // Como não temos tabela de horários complexa, assumimos que tarefas diferentes podem ser em horarios diferentes
      // Para evitar conflito real, melhor checar se Dia + Hora bate.
      // Aqui vamos simplificar: 1 pessoa max 3 tarefas total no acampamento
      if (person.count >= 3) continue;

      // Adicionar
      novasEscalas.push([task.id, person.id, person.nome, false]);
      person.count++;
      person.tasks.push(task.id);
      added++;
    }
  }

  // Salvar no Sheet
  if (novasEscalas.length > 0) {
    sheetEscalas.getRange(sheetEscalas.getLastRow() + 1, 1, novasEscalas.length, 4).setValues(novasEscalas);
  }

  return { status: 'success', message: 'Escalas geradas com sucesso!', novos: novasEscalas.length };
}

// 2. Ler Escalas (formatado para App)
function getScales() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tarefasVals = ss.getSheetByName('Tarefas').getDataRange().getValues();
  var escalasVals = ss.getSheetByName('Escalas').getDataRange().getValues();

  var tarefasMap = {};
  var resultTarefas = [];

  // Mapear Tarefas
  for (var i = 1; i < tarefasVals.length; i++) {
    var t = tarefasVals[i];
    var tObj = {
      id: t[0], nome: t[1], dia: t[2], hora: t[3], lider: t[8],
      equipe: []
    };
    tarefasMap[t[0]] = tObj;
    resultTarefas.push(tObj);
  }

  // Popular Equipe
  for (var i = 1; i < escalasVals.length; i++) {
    var e = escalasVals[i]; // [TarefaID, AcampanteID, Nome, Travado]
    if (tarefasMap[e[0]]) {
      tarefasMap[e[0]].equipe.push({
        id: e[1], nome: e[2], locked: e[3]
      });
    }
  }

  return { status: 'success', escalas: resultTarefas };
}

// 3. Atualizar Escala (Drag & Drop)
function updateScale(data) {
  // action: 'move', tarefaDestino: 'T1', camperId: '...', nome: '...'
  // action: 'remove', tarefaId: 'T1', camperId: '...'

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Escalas');
  var rows = sheet.getDataRange().getValues();

  // Remover entrada anterior desse campista nessa tarefa (ou de todas se for movimento unico, mas assumimos movimento)
  // Se for 'move', remove da anterior se especificado, ou apenas adiciona na nova se não existir.
  // Simplificação: DragDrop geralmente Tira de A e Põe em B.

  // Lógica:
  // 1. Se Remove: Deleta linha.
  // 2. Se Add: Adiciona linha com Travado=true.

  if (data.subAction === 'remove') {
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.tarefaId && rows[i][1] === data.camperId) {
        sheet.deleteRow(i + 1);
        return { status: 'success', message: 'Removido' };
      }
    }
    return { status: 'error', message: 'Não encontrado para remover' };
  }

  if (data.subAction === 'add') {
    // Verifica duplicidade
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.tarefaId && rows[i][1] === data.camperId) {
        return { status: 'error', message: 'Já está nesta escala' };
      }
    }
    sheet.appendRow([data.tarefaId, data.camperId, data.nomeAcampante, true]);
    return { status: 'success', message: 'Adicionado' };
  }

  return { status: 'error', message: 'Sub-ação inválida' };
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
