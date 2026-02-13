// COLE ESTE CÓDIGO NO GOOGLE APPS SCRIPT
// 1. Vá na sua planilha: Extensões > Apps Script
// 2. Apague qualquer código que estiver lá e cole este.
// 3. Clique em "Implantar" > "Nova implantação"
// 4. Selecione "App da Web"
// 5. Em "Quem pode acessar", escolha "Qualquer pessoa" (Importante!)
// 6. Autorize o script e copie a URL gerada (Web App URL).

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Tenta ler os dados enviados (JSON)
  try {
    var data = JSON.parse(e.postData.contents);

    // Prepara a linha com data e hora atual
    var row = [
      new Date(),           // Data/Hora
      data.nome,            // Nome do Discípulo
      data.igreja,          // Igreja
      data.total,           // Pontuação Total
      data.perfil,          // Perfil (Semente, Muda, etc)

      // Detalhes das Categorias (Pontuação / 20)
      data.cat_renuncia,
      data.cat_mente,
      data.cat_comunhao,
      data.cat_honra,
      data.cat_servico,

      // Respostas Completas
      JSON.stringify(data.respostas)
    ];

    // Adiciona na próxima linha vazia
    sheet.appendRow(row);

    // Retorna sucesso
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retorna erro se algo der errado
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// FUNÇÃO PARA O DASHBOARD DE BI - LÊ OS DADOS
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var json = [];

    for (var i = 1; i < data.length; i++) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j];
      }
      json.push(obj);
    }

    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Configuração inicial das colunas (rode essa função uma vez se a planilha estiver vazia)
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    "Data/Hora",
    "Nome",
    "Igreja",
    "Total (/100)",
    "Perfil",
    "Renúncia",
    "Mente",
    "Comunhão",
    "Honra",
    "Serviço",
    "Respostas Brutas"
  ]);

  // Deixa o cabeçalho em negrito e congela a primeira linha
  var header = sheet.getRange(1, 1, 1, 11);
  header.setFontWeight("bold");
  sheet.setFrozenRows(1);
}
