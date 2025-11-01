// Interface UI do simulador SAP-2.

document.addEventListener('DOMContentLoaded', () => {

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
    let arquivos = []; // nomes dos arquivos carregados

    // 1) Redimensionamento do painel pela "alça"
    alca.addEventListener('mousedown', (e) => {
      arrastando = true;
      e.preventDefault();
    });
  
    document.addEventListener('mousemove', (e) => {
      if (arrastando) {
        const novaLargura = e.clientX;
        const novaAltura = e.clientY - 20;
        painel.style.width = novaLargura + 'px';
        painel.style.height = novaAltura + 'px';
        painel2.style.height = novaAltura + 'px';
      }
    });
  
    document.addEventListener('mouseup', () => {
      arrastando = false;
    });

    // 2) Carregar / salvar arquivos

    // Botão Salvar: envia o arquivo atual ao backend
    btnSalvar.addEventListener('click', (event) => {
      console.log("arquivo: " + event.target.dataset.id);
      salvarArquivo(event.target.dataset.id);
    });
    
    // Seletor de diretório: popula a lista de arquivos
    seletor.addEventListener('change', (event) => {
      listaArquivos.innerHTML = '';
      const arqs = event.target.files;
      arquivos = [];
      
      for (let arq of arqs) {
        arquivos.push(arq.name);
      }
      console.log("Lendo diretório...");

      for (let arquivo of arquivos) {
        const item = document.createElement('button');
        item.className = "buttonOpenFile";
        item.dataset.id = arquivo;

        item.addEventListener('click', () => {
          document.getElementById('textArea').value = '';
          document.getElementById("identificador-arquivo-acessado").textContent = arquivo;
          btnSalvar.dataset.id = arquivo;
          lerArquivo(arquivo);
        });

        const areaText = document.createElement('h3');
        areaText.textContent = arquivo;
        item.appendChild(areaText);
        listaArquivos.appendChild(item);
      }
      console.log("Lista de arquivos populada.");
    });

    function adicionarArquivoNaLista(nomeArquivo) {
        if (arquivos.includes(nomeArquivo)) {
            return; 
        }
        
        arquivos.push(nomeArquivo); 
        
        const item = document.createElement('button');
        item.className = "buttonOpenFile";
        item.dataset.id = nomeArquivo;

        item.addEventListener('click', () => {
          textArea.value = '';
          document.getElementById("identificador-arquivo-acessado").textContent = nomeArquivo;
          btnSalvar.dataset.id = nomeArquivo;
          lerArquivo(nomeArquivo);
        });

        const areaText = document.createElement('h3');
        areaText.textContent = nomeArquivo;
        item.appendChild(areaText);
        listaArquivos.appendChild(item); 
    }

    // Pede ao backend o conteúdo do arquivo (lerArquivo.php)
    function lerArquivo(arquivo) {
      const caminho = "../data/files/" + arquivo;
      fetch('lerArquivo.php?caminho=' + encodeURIComponent(caminho))
        .then(resp => {
          if (!resp.ok) throw new Error('Erro: ' + resp.status);
          return resp.text();
        })
        .then(texto => {
          textArea.value = texto;
        })
        .catch(console.error);
    }
    
    // Envia conteúdo para o backend salvar (salvarArquivo.php)
    function salvarArquivo(arquivo, conteudoParaSalvar = null) {
      if (!arquivo) {
        alert("Nenhum arquivo selecionado para salvar.");
        return;
      }
      
      const caminho = "../data/files/" + arquivo;
      const conteudo = (conteudoParaSalvar !== null) ? conteudoParaSalvar : textArea.value;

      fetch('salvarArquivo.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `caminho=${encodeURIComponent(caminho)}&conteudo=${encodeURIComponent(conteudo)}`
      })
      .then(resp => resp.text())
      .then(msg => {
          if (conteudoParaSalvar === null) {
              alert(msg);
          }
          console.log(msg);
      })
      .catch(console.error);
    }

    // 3) Conexão com o simulador (botões COMPILAR / EXECUTAR)
    const botaoCompilar = document.querySelector('.buttons .btn:nth-child(1)');
    const botaoExecutar = document.querySelector('.buttons .btn:nth-child(2)');

    botaoCompilar.addEventListener('click', () => {
        const codigoFonte = textArea.value;
        const nomeArquivoAtual = document.getElementById("identificador-arquivo-acessado").textContent;
        
        if (!nomeArquivoAtual || nomeArquivoAtual === "Nenhum arquivo selecionado") {
            logOutput("ERRO: Por favor, abra um arquivo (.txt) primeiro.", true);
            return;
        }

        // Cria o novo nome do arquivo (ex: "file001.txt" -> "file001.hex")
        const nomeBase = nomeArquivoAtual.split('.')[0];
        const novoNomeHex = nomeBase + ".hex";
        
        const resultado = compilar(codigoFonte); 

        if (resultado.sucesso) {

            hexDisplay.textContent = resultado.resultado;
            salvarArquivo(novoNomeHex, resultado.resultado); //
            adicionarArquivoNaLista(novoNomeHex);
            logOutput(`Compilado com sucesso! Salvo como ${novoNomeHex}`, true);
        } else {
            hexDisplay.textContent = "--:--:--";
            logOutput(resultado.resultado, true);
        }
    });

    // Executar / Parar: controla o estado da CPU do simulador
    botaoExecutar.addEventListener('click', () => {
        if (CPU.estaRodando) {
            CPU.estaRodando = false;
            botaoExecutar.textContent = "EXECUTAR";
            logOutput("Execução parada pelo usuário.", false);
            return;
        }

        const nomeArquivoAtual = document.getElementById("identificador-arquivo-acessado").textContent;
        if (!nomeArquivoAtual || nomeArquivoAtual === "Nenhum arquivo selecionado") {
            logOutput("ERRO: Nenhum arquivo selecionado para executar.", true);
            return;
        }
        
        const nomeBase = nomeArquivoAtual.split('.')[0];
        const nomeHex = nomeBase + ".hex";
        
        logOutput(`Tentando executar "${nomeHex}"...`, true);

        const caminho = "../data/files/" + nomeHex;
        fetch('lerArquivo.php?caminho=' + encodeURIComponent(caminho)) //
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(`Arquivo ${nomeHex} não encontrado. Você compilou o código?`);
                }
                return resp.text();
            })
            .then(codigoHex => {
                resetarCPU(); 
                logOutput(`Carregando "${nomeHex}" na memória...`);
                
                carregarMemoria(codigoHex); 
                
                botaoExecutar.textContent = "PARAR"; 
                CPU.estaRodando = true;
                logOutput("Executando...");
                
                executarProximoCiclo();
                
            })
            .catch(e => {
                logOutput(`ERRO: ${e.message}`, false);
            });
    });

}); 
