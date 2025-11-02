let cnv;
var fios = {
    "bus": [0, 0, 0, 0, 0, 0, 0, 0],
    "ir": [0, 0, 0, 0, 0, 0, 0, 0],
    "temp": [0, 0, 0, 0, 0, 0, 0, 0],
    "a": [0, 0, 0, 0, 0, 0, 0, 0],
    "alu": [0, 0],
    "mar": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "ram": [0, 0, 0, 0, 0, 0, 0, 0]
}

function setup() {
    createCanvas(800, 800);
    // Cria o canvas via p5 normalmente ACTDOWN
    cnv = createCanvas(800, 800);
    // Coloca o canvas DENTRO do canvas HTML (substitui o conteúdo)
    const container = document.getElementById("sap2-canvas").parentNode;
    document.getElementById("sap2-canvas").remove(); // remove o canvas original
    cnv.parent(container); // coloca o novo p5 canvas no lugar

    const tamanhoDefault = document.querySelector(".files"); // peg tamanho que define ele, a classe css files
    const sec = document.querySelector(".sap2");
    cnv = createCanvas(800, 800);
    cnv.parent(sec);

    for (let i = 0; i < 8; i++) {
        activateFio("bus", i, i%2); // só pra ver q ligou
    }
}

function draw() {
    background("#ffffff");
    fill(255, 100, 0);
    const sec = document.querySelector(".files");

    mapSap2();

    // roda todos os componentes
    var comps = [CON, RAM, ALU, IN, PC, OUT, MAR, MDR, IR, A, B, C, TEMP];
    for (var i = 0; i < comps.length; i++) {
        comps[i].run();    
    }
}

function activateFio(local,numFio, data) {
    for (let i = 0; i < 8; i++) {
        if (i == numFio) {
            fios[local][i] = data;
        }
    }
}

// CPU

// Executor CPU do simulador SAP-2 (fetch-decode-execute).
// Mantém registradores, memória e executa instruções carregadas em CPU.memoria.

// Atualiza flags Zero e Sinal a partir de um valor 8-bit.
function setFlags(valor) {
    CPU.flagZero = (valor === 0) ? 1 : 0;
    CPU.flagSignal = (valor & 0x80) ? 1 : 0;
    logOutput(`    -> Flags Atualizadas: Zero=${CPU.flagZero}, Sinal=${CPU.flagSignal}`);
}

// Restaura estado inicial da CPU.
// PC inicia em 0x1000 (convenção do assembler).
function resetarCPU() {
    CPU.A = 0;
    CPU.B = 0;
    CPU.C = 0;
    PC.value = 0x2010;
    CPU.flagZero = 0;
    CPU.flagSignal = 0;
    CPU.memoria = [];
    CPU.estaRodando = false;
    logOutput("CPU Pronta. Aguardando execução...", true);
    for (let i = 0; i < 8; i++) { // reseta os fios do bus
        activateFio("bus", i, 0);
    }
}

// Carrega código formatado (saída do compilador) para CPU.memoria.
// Simula memória de 64K (array preenchido).
function carregarMemoria(codigoHex) {
    const linhas = codigoHex.split('\n');
    CPU.memoria = new Array(0xFFFF).fill(0); // simula 64K (0x0000..0xFFFE)

    for (let i = 0; i < 8; i++) { // reseta os fios do bus
        activateFio("bus", i, 0);
    }

    linhas.forEach(linha => {
        if (!linha.trim() || linha.startsWith(';')) return;

        const partes = linha.split(';')[0].trim().split(/\s+/);
        const enderecoHex = partes[0].replace('H', '');
        const endereco = parseInt(enderecoHex, 16);

        if (isNaN(endereco)) return;

        const bytes = partes.slice(1);
        bytes.forEach((byte, index) => {
            if (byte) {
                CPU.memoria[endereco + index] = parseInt(byte, 16);
            }
        });
    });
    logOutput("Memória carregada.");
}

/*
 Loop principal: fetch-decode-execute.
 Cada ciclo:
  - busca opcode em PC,
  - decodifica via switch,
  - executa e atualiza PC/flags/memória.
 Retorna quando encontra HLT ou opcode não implementado.
*/
async function clock(){
    if (!CPU.estaRodando) return;

    var hz = 1;
    var tempo = 1000/hz;
    await executarProximoCiclo(tempo);
    // setTimeout(clock, tempo);
}

async function executarProximoCiclo(tempo) {
    CON.indexAddressFromPC();
    await sleep(tempo);
    // coloca no MAR
    CON.MARreceive = 1;
    await sleep(tempo);
    CON.MARreceive = 0;
    CON.run();
    pri(MAR.receive);
    await sleep(tempo);

    CON.levelBytePC = 1;
    CON.PC

    await sleep(tempo);
    CON.MARreceive = 1;
    await sleep(tempo);
    CON.MARreceive = 0;
    await sleep(tempo);
    
}

function processCON(){
    if (!CPU.estaRodando) return;

    // FETCH
    const opcode = CPU.memoria[PC.value];
    const opcodeHex = opcode.toString(16).toUpperCase().padStart(2, '0');
    logOutput(`PC: ${PC.value.toString(16).toUpperCase()}H | Opcode: ${opcodeHex}`, false);

    // DECODE && EXECUTE
    switch (opcodeHex) {

        // MVI / instruções com imediato (2 bytes)
        case "3E": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.A = byte;
            logOutput(`  -> MVI A, ${byte.toString(16).toUpperCase()}H. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`);
            PC.value += 2;
            break;
        }
        case "06": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.B = byte;
            logOutput(`  -> MVI B, ${byte.toString(16).toUpperCase()}H. B = ${CPU.B} (${CPU.B.toString(16).toUpperCase()}H)`);
            PC.value += 2;

            break;
        }
        case "0E": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.C = byte;
            logOutput(`  -> MVI C, ${byte.toString(16).toUpperCase()}H. C = ${CPU.C} (${CPU.C.toString(16).toUpperCase()}H)`);
            PC.value += 2;
            break;
        }
        case "E6": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.A = (CPU.A & byte) & 0xFF;
            setFlags(CPU.A);
            logOutput(`  -> ANI ${byte.toString(16).toUpperCase()}H. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`);
            PC.value += 2;
            break;
        }
        case "F6": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.A = (CPU.A | byte) & 0xFF;
            setFlags(CPU.A);
            logOutput(`  -> ORI ${byte.toString(16).toUpperCase()}H. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`);
            PC.value += 2;
            break;
        }
        case "EE": {
            const byte = CPU.memoria[PC.value + 1];
            CPU.A = (CPU.A ^ byte) & 0xFF;
            setFlags(CPU.A);
            logOutput(`  -> XRI ${byte.toString(16).toUpperCase()}H. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`);
            PC.value += 2;
            break;
        }

        // Movimentação entre registradores
        case "78": { CPU.A = CPU.B; logOutput(`  -> MOV A,B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "79": { CPU.A = CPU.C; logOutput(`  -> MOV A,C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "47": { CPU.B = CPU.A; logOutput(`  -> MOV B,A. B = ${CPU.B} (${CPU.B.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "4F": { CPU.C = CPU.A; logOutput(`  -> MOV C,A. C = ${CPU.C} (${CPU.C.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "41": { CPU.B = CPU.C; logOutput(`  -> MOV B,C. B = ${CPU.B} (${CPU.B.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "48": { CPU.C = CPU.B; logOutput(`  -> MOV C,B. C = ${CPU.C} (${CPU.C.toString(16).toUpperCase()}H)`); PC.value += 1; break; }

        // Incremento / Decremento
        case "3C": { CPU.A = (CPU.A + 1) & 0xFF; setFlags(CPU.A); logOutput(`  -> INR A. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "04": { CPU.B = (CPU.B + 1) & 0xFF; setFlags(CPU.B); logOutput(`  -> INR B. B = ${CPU.B} (${CPU.B.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "0C": { CPU.C = (CPU.C + 1) & 0xFF; setFlags(CPU.C); logOutput(`  -> INR C. C = ${CPU.C} (${CPU.C.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "3D": { CPU.A = (CPU.A - 1) & 0xFF; setFlags(CPU.A); logOutput(`  -> DCR A. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "05": { CPU.B = (CPU.B - 1) & 0xFF; setFlags(CPU.B); logOutput(`  -> DCR B. B = ${CPU.B} (${CPU.B.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "0D": { CPU.C = (CPU.C - 1) & 0xFF; setFlags(CPU.C); logOutput(`  -> DCR C. C = ${CPU.C} (${CPU.C.toString(16).toUpperCase()}H)`); PC.value += 1; break; }

        // Rotação / Complemento / NOP
        case "17": { const bitAlto = (CPU.A & 0x80) >> 7; CPU.A = ((CPU.A << 1) & 0xFF) | bitAlto; logOutput(`  -> RAL. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "1F": { const bitBaixo = CPU.A & 0x01; CPU.A = (CPU.A >> 1) | (bitBaixo << 7); logOutput(`  -> RAR. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "2F": { CPU.A = (~CPU.A) & 0xFF; logOutput(`  -> CMA. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "00": { logOutput(`  -> NOP.`); PC.value += 1; break; }

        // Aritmética entre registradores
        case "80": { CPU.A = (CPU.A + CPU.B) & 0xFF; setFlags(CPU.A); logOutput(`  -> ADD B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "81": { CPU.A = (CPU.A + CPU.C) & 0xFF; setFlags(CPU.A); logOutput(`  -> ADD C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "90": { CPU.A = (CPU.A - CPU.B) & 0xFF; setFlags(CPU.A); logOutput(`  -> SUB B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "91": { CPU.A = (CPU.A - CPU.C) & 0xFF; setFlags(CPU.A); logOutput(`  -> SUB C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }

        // Lógicas entre registradores
        case "A0": { CPU.A = (CPU.A & CPU.B) & 0xFF; setFlags(CPU.A); logOutput(`  -> ANA B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "A1": { CPU.A = (CPU.A & CPU.C) & 0xFF; setFlags(CPU.A); logOutput(`  -> ANA C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "B0": { CPU.A = (CPU.A | CPU.B) & 0xFF; setFlags(CPU.A); logOutput(`  -> ORA B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "B1": { CPU.A = (CPU.A | CPU.C) & 0xFF; setFlags(CPU.A); logOutput(`  -> ORA C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "A8": { CPU.A = (CPU.A ^ CPU.B) & 0xFF; setFlags(CPU.A); logOutput(`  -> XRA B. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }
        case "A9": { CPU.A = (CPU.A ^ CPU.C) & 0xFF; setFlags(CPU.A); logOutput(`  -> XRA C. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`); PC.value += 1; break; }

        // Acesso à memória (LDA/STA)
        case "3A": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const enderecoAlvo = (byteAlto << 8) | byteBaixo;
            CPU.A = CPU.memoria[enderecoAlvo];
            logOutput(`  -> LDA ${enderecoAlvo.toString(16).toUpperCase()}H. A = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H)`);
            PC.value += 3;
            break;
        }
        case "32": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const enderecoAlvo = (byteAlto << 8) | byteBaixo;
            CPU.memoria[enderecoAlvo] = CPU.A;
            logOutput(`  -> STA ${enderecoAlvo.toString(16).toUpperCase()}H. (Memória[${enderecoAlvo.toString(16).toUpperCase()}H] = ${CPU.A} (${CPU.A.toString(16).toUpperCase()}H))`);
            PC.value += 3;
            break;
        }

        // Saltos condicionais e incondicionais
        case "C3": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const novoPC = (byteAlto << 8) | byteBaixo;
            logOutput(`  -> JMP ${novoPC.toString(16).toUpperCase()}H`);
            PC.value = novoPC;
            break;
        }
        case "CA": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const novoPC = (byteAlto << 8) | byteBaixo;
            if (CPU.flagZero === 1) {
                logOutput(`  -> JZ ${novoPC.toString(16).toUpperCase()}H. (Flag Zero=1) PULO EXECUTADO.`);
                PC.value = novoPC;
            } else {
                logOutput(`  -> JZ ${novoPC.toString(16).toUpperCase()}H. (Flag Zero=0) PULO IGNORADO.`);
                PC.value += 3;
            }
            break;
        }
        case "C2": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const novoPC = (byteAlto << 8) | byteBaixo;
            if (CPU.flagZero === 0) {
                logOutput(`  -> JNZ ${novoPC.toString(16).toUpperCase()}H. (Flag Zero=0) PULO EXECUTADO.`);
                PC.value = novoPC;
            } else {
                logOutput(`  -> JNZ ${novoPC.toString(16).toUpperCase()}H. (Flag Zero=1) PULO IGNORADO.`);
                PC.value += 3;
            }
            break;
        }
        case "FA": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const novoPC = (byteAlto << 8) | byteBaixo;
            if (CPU.flagSignal === 1) {
                logOutput(`  -> JM ${novoPC.toString(16).toUpperCase()}H. (Flag Sinal=1) PULO EXECUTADO.`);
                PC.value = novoPC;
            } else {
                logOutput(`  -> JM ${novoPC.toString(16).toUpperCase()}H. (Flag Sinal=0) PULO IGNORADO.`);
                PC.value += 3;
            }
            break;
        }

        // CALL/RET: usa área fixa 0xFFFD/0xFFFE para salvar endereço de retorno.
        case "CD": {
            const byteBaixo = CPU.memoria[PC.value + 1];
            const byteAlto = CPU.memoria[PC.value + 2];
            const enderecoSubrotina = (byteAlto << 8) | byteBaixo;
            const enderecoRetorno = PC.value + 3;
            const returnAlto = (enderecoRetorno >> 8) & 0xFF;
            const returnBaixo = enderecoRetorno & 0xFF;
            CPU.memoria[0xFFFD] = returnBaixo;
            CPU.memoria[0xFFFE] = returnAlto;
            logOutput(`  -> CALL ${enderecoSubrotina.toString(16).toUpperCase()}H. (Retorno salvo: ${enderecoRetorno.toString(16).toUpperCase()}H)`);
            PC.value = enderecoSubrotina;
            break;
        }
        case "C9": {
            const returnBaixo = CPU.memoria[0xFFFD];
            const returnAlto = CPU.memoria[0xFFFE];
            const enderecoRetorno = (returnAlto << 8) | returnBaixo;
            logOutput(`  -> RET. (Pulando de volta para ${enderecoRetorno.toString(16).toUpperCase()}H)`);
            PC.value = enderecoRetorno;
            break;
        }

        // Parada
        case "76": {
            CPU.estaRodando = false;
            document.querySelector('.buttons .btn:nth-child(2)').textContent = "EXECUTAR";
            logOutput("Execução finalizada (HLT).");
            return;
        }

        // Opcodes não implementados
        default: {
            if (opcodeHex === "DB" || opcodeHex === "D3") {
                logOutput(`  -> ${opcodeHex} (I/O) ignorado. (Implementação pendente)`);
                PC.value += 2;
                break;
            }
            CPU.estaRodando = false;
            document.querySelector('.buttons .btn:nth-child(2)').textContent = "EXECUTAR";
            logOutput(`ERRO: Opcode ${opcodeHex} não implementado no PC ${PC.value.toString(16).toUpperCase()}H.`);
            return;
        }
    }
}

