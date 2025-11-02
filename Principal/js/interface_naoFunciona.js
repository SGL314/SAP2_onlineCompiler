// interface.js
import { auth, db } from "./firebase.js";
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Elementos principais da UI
const painel = document.getElementById('painel');
const painel2 = document.getElementsByClassName('rigth-part')[0];
const alca = document.getElementById('alca');
const seletor = document.getElementById('seletor');
const listaArquivos = document.getElementsByClassName('files')[0];
const btnSalvar = document.getElementById('button-save');
const textArea = document.getElementById('textArea');
const hexDisplay = document.querySelector('.hex-output');

let arrastando = false;
let arquivos = [];

// ===== 1) Redimensionamento do painel =====
alca.addEventListener('mousedown', e => { arrastando = true; e.preventDefault(); });
document.addEventListener('mousemove', e => {
  if (arrastando) {
    painel.style.width = e.clientX + 'px';
    painel.style.height = (e.clientY - 20) + 'px';
    painel2.style.height = (e.clientY - 20) + 'px';
  }
});
document.addEventListener('mouseup', () => { arrastando = false; });

// ===== 2) Carregar / salvar arquivos =====
seletor.addEventListener('change', event => {
  listaArquivos.innerHTML = '';
  arquivos = [];
  const arqs = event.target.files;
  for (let arq of arqs) arquivos.push(arq.name);

  for (let arquivo of arquivos) adicionarArquivoNaLista(arquivo);
});

btnSalvar.addEventListener('click', async (event) => {
  await salvarArquivoFirebase(event.target.dataset.id, textArea.value);
});

// ===== Funções Firebase =====
async function salvarArquivoFirebase(nomeArquivo, conteudo) {
  if (!nomeArquivo) { alert("Nenhum arquivo selecionado"); return; }
  try {
    await set(ref(db, "arquivos/" + nomeArquivo), { conteudo, data: new Date().toISOString() });
    alert("Arquivo salvo com sucesso!");
    console.log("Arquivo salvo no Firebase:", nomeArquivo);
  } catch (e) {
    console.error("Erro ao salvar arquivo:", e);
    alert("Erro ao salvar arquivo.");
  }
}

async function lerArquivoFirebase(nomeArquivo) {
  if (!nomeArquivo) return "";
  try {
    const snapshot = await get(child(ref(db), "arquivos/" + nomeArquivo));
    if (snapshot.exists()) return snapshot.val().conteudo;
    alert("Arquivo não encontrado!");
    return "";
  } catch (e) {
    console.error("Erro ao ler arquivo:", e);
    return "";
  }
}

// ===== 3) Conexão com o simulador (COMPILAR / EXECUTAR) =====
const botaoCompilar = document.querySelector('.buttons .btn:nth-child(1)');
const botaoExecutar = document.querySelector('.buttons .btn:nth-child(2)');

botaoCompilar.addEventListener('click', async () => {
  const codigoFonte = textArea.value;
  const nomeArquivoAtual = document.getElementById("identificador-arquivo-acessado").textContent;

  if (!nomeArquivoAtual || nomeArquivoAtual === "Nenhum arquivo selecionado") {
    logOutput("ERRO: Abra um arquivo primeiro", true);
    return;
  }

  const nomeBase = nomeArquivoAtual.split('.')[0];
  const novoNomeHex = nomeBase + ".hex";

  const resultado = compilar(codigoFonte);
  if (resultado.sucesso) {
    hexDisplay.textContent = resultado.resultado;
    await salvarArquivoFirebase(novoNomeHex, resultado.resultado);
    adicionarArquivoNaLista(novoNomeHex);
    logOutput(`Compilado com sucesso! Salvo como ${novoNomeHex}`, true);
  } else {
    hexDisplay.textContent = "--:--:--";
    logOutput(resultado.resultado, true);
  }
});

botaoExecutar.addEventListener('click', async () => {
  if (CPU.estaRodando) {
    CPU.estaRodando = false;
    botaoExecutar.textContent = "EXECUTAR";
    logOutput("Execução parada", false);
    return;
  }

  const nomeArquivoAtual = document.getElementById("identificador-arquivo-acessado").textContent;
  if (!nomeArquivoAtual || nomeArquivoAtual === "Nenhum arquivo selecionado") {
    logOutput("ERRO: Nenhum arquivo selecionado", true);
    return;
  }

  const nomeBase = nomeArquivoAtual.split('.')[0];
  const nomeHex = nomeBase + ".hex";

  logOutput(`Tentando executar "${nomeHex}"...`, true);
  const codigoHex = await lerArquivoFirebase(nomeHex);
  if (!codigoHex) return;

  resetarCPU();
  logOutput(`Carregando "${nomeHex}" na memória...`);
  carregarMemoria(codigoHex);

  botaoExecutar.textContent = "PARAR";
  CPU.estaRodando = true;
  logOutput("Executando...");
  executarProximoCiclo();
});

// ===== Função auxiliar =====
function adicionarArquivoNaLista(nomeArquivo) {
  if (arquivos.includes(nomeArquivo)) return;
  arquivos.push(nomeArquivo);

  const item = document.createElement('button');
  item.className = "buttonOpenFile";
  item.dataset.id = nomeArquivo;

  item.addEventListener('click', async () => {
    textArea.value = '';
    document.getElementById("identificador-arquivo-acessado").textContent = nomeArquivo;
    btnSalvar.dataset.id = nomeArquivo;
    textArea.value = await lerArquivoFirebase(nomeArquivo);
  });

  const areaText = document.createElement('h3');
  areaText.textContent = nomeArquivo;
  item.appendChild(areaText);
  listaArquivos.appendChild(item);
}
