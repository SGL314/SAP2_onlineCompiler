// Assembler (compiler) para o simulador SAP-2.
// Entrada: string com código assembly. Saída: { sucesso: boolean, resultado: string }.

// Compila código assembly.

function compilar(codigoAssembly) {
    const linhas = codigoAssembly.split('\n')
        .map(limparLinha)
        .filter(linha => linha.length > 0);

    // 1ª passada: encontra labels
    const { labels, errosPassada1 } = primeiraPassada(linhas);
    if (errosPassada1.length > 0) {
        return { sucesso: false, resultado: errosPassada1.join('\n') };
    }

    // 2ª passada: gera bytes hex
    const { codigoHex, errosPassada2 } = segundaPassada(linhas, labels, opcodes);
    if (errosPassada2.length > 0) {
        return { sucesso: false, resultado: errosPassada2.join('\n') };
    }

    // Formata saída para display
    const resultadoFormatado = codigoHex.map(linha => {
        const bytesFormatados = linha.bytes.join('  ').padEnd(8);
        return `${linha.endereco}H  ${bytesFormatados}  ; ${linha.instrucaoOriginal}`;
    }).join('\n');
    
    return { sucesso: true, resultado: resultadoFormatado };
}

/**
 * Remove comentários (;) e trim.
 */
function limparLinha(linha) {
    let linhaLimpa = linha.split(';')[0];
    linhaLimpa = linhaLimpa.trim();
    return linhaLimpa;
}

/**
 * Identifica padrão da instrução e seu tamanho em bytes.
 * Retorna { padrao, tamanho, argumento }.
 * Lança erro se não reconhecer a instrução.
 */
function findMatchingPattern(linha) {
    const linhaUpper = linha.toUpperCase();
    
    // instrução de 1 byte exata
    if (opcodes[linhaUpper]) {
        return { padrao: linhaUpper, tamanho: 1, argumento: null };
    }

    // separa comando e resto (apenas no primeiro espaço)
    const partes = linhaUpper.split(/ (.*)/s);
    const comando = partes[0];
    const argumento = partes[1] || '';

    // padrão de 3 bytes (address)
    const padraoAddress = `${comando} address`;
    if (opcodes[padraoAddress]) {
        return { padrao: padraoAddress, tamanho: 3, argumento: argumento.trim() };
    }

    // padrão de 2 bytes (byte imediato)
    const comandoVirgula = linhaUpper.split(',')[0].trim();
    const padraoByte = `${comandoVirgula},byte`;
    
    if (opcodes[padraoByte]) {
        const argumentoByte = linhaUpper.split(',')[1] ? linhaUpper.split(',')[1].trim() : '';
        return { padrao: padraoByte, tamanho: 2, argumento: argumentoByte };
    }
    
    throw new Error(`Instrução ou sintaxe não reconhecida: '${linha}'`);
}

/**
 * 1ª passada: monta mapa de labels e calcula endereços.
 * Start address fixo: 0x1000.
 * Retorna { labels, errosPassada1 }.
 */
function primeiraPassada(linhas) {
    const labels = {};
    const erros = [];
    let enderecoAtual = 0x1000;

    linhas.forEach((linha, indice) => {
        const numeroLinha = indice + 1;
        
        if (linha.includes(':')) {
            const partes = linha.split(':');
            const nomeEtiqueta = partes[0].trim().toUpperCase();
            const restoDaLinha = partes.slice(1).join(':').trim(); 

            if (restoDaLinha.length > 0) {
                 erros.push(`Erro Linha ${numeroLinha}: Instrução não pode estar na mesma linha que a etiqueta '${nomeEtiqueta}:'`);
                 return;
            }
            if (!nomeEtiqueta) {
                 erros.push(`Erro Linha ${numeroLinha}: Etiqueta vazia.`);
                 return;
            }
            
            if (labels[nomeEtiqueta]) {
                erros.push(`Erro Linha ${numeroLinha}: Etiqueta '${nomeEtiqueta}' definida mais de uma vez.`);
            } else {
                // armazena endereço em hex (string)
                labels[nomeEtiqueta] = enderecoAtual.toString(16).toUpperCase();
            }
        } else {
            // calcula tamanho da instrução para avançar o endereço
            try {
                const { tamanho } = findMatchingPattern(linha);
                enderecoAtual += tamanho;
            } catch (e) {
                erros.push(`Erro Linha ${numeroLinha}: ${e.message}`);
            }
        }
    });

    return { labels, errosPassada1: erros };
}

/**
 * 2ª passada: converte instruções em bytes hex.
 * Usa labels resolvidas pela primeira passagem.
 * Retorna { codigoHex, errosPassada2 }.
 */
function segundaPassada(linhas, labels, opcodes) {
    const codigoHex = [];
    const erros = [];
    let enderecoAtual = 0x1000;

    linhas.forEach((linha, indice) => {
        const numeroLinha = indice + 1;
        if (linha.includes(':')) {
            return; // etiqueta apenas
        }

        try {
            const { padrao, tamanho, argumento } = findMatchingPattern(linha);
            const opcode = opcodes[padrao];
            
            let linhaHex = {
                endereco: enderecoAtual.toString(16).toUpperCase().padStart(4, '0'),
                bytes: [opcode],
                instrucaoOriginal: linha
            };

            if (tamanho === 2) {
                // byte imediato (hex)
                const byte = argumento.replace('H', '');
                if (byte.length > 2 || isNaN(parseInt(byte, 16))) {
                    throw new Error(`Argumento inválido para 'byte': '${argumento}'`);
                }
                linhaHex.bytes.push(byte.padStart(2, '0'));
                
            } else if (tamanho === 3) {
                // endereço: resolve label ou usa valor imediato
                let enderecoAlvo = "";
                const argumentoUpper = argumento.toUpperCase();
                
                if (labels[argumentoUpper]) {
                    enderecoAlvo = labels[argumentoUpper];
                } else {
                    enderecoAlvo = argumento.replace('H', '');
                }

                if (enderecoAlvo.length > 4 || isNaN(parseInt(enderecoAlvo, 16))) {
                    throw new Error(`Argumento inválido para 'address': '${argumento}'`);
                }
                
                enderecoAlvo = enderecoAlvo.padStart(4, '0'); 
                const byteBaixo = enderecoAlvo.substring(2, 4); 
                const byteAlto = enderecoAlvo.substring(0, 2);  
                
                linhaHex.bytes.push(byteBaixo);
                linhaHex.bytes.push(byteAlto);
            }

            codigoHex.push(linhaHex);
            enderecoAtual += tamanho;

        } catch (e) {
            erros.push(`Erro Linha ${numeroLinha}: ${e.message}`);
        }
    });

    return { codigoHex, errosPassada2: erros };
}
