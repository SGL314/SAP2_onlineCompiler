// Utilities do simulador: mapa de opcodes, estado da CPU e função de log.

// 1. Mapa de opcodes (mnemonic -> opcode hex, como string de 2 dígitos).
const opcodes = {
  // 1 byte (sem operandos)
  "ADD B": "80", "MOV B,A": "47", "ADD C": "81", "MOV B,C": "41", "ANA B": "A0",
  "MOV C,A": "4F", "ANA C": "A1", "MOV C,B": "48", "CMA": "2F", "DCR A": "3D",
  "NOP": "00", "DCR B": "05", "ORA B": "B0", "DCR C": "0D", "ORA C": "B1", 
  "HLT": "76", "INR A": "3C", "RAL": "17", "INR B": "04", "RAR": "1F",
  "INR C": "0C", "RET": "C9", "SUB B": "90", "SUB C": "91", "XRA B": "A8",
  "XRA C": "A9", "MOV A,B": "78", "MOV A,C": "79",
  // 2 bytes (operand byte)
  "ANI byte": "E6", "MVI A,byte": "3E", "MVI B,byte": "06", "MVI C,byte": "0E",
  "ORI byte": "F6", "IN byte": "DB", "OUT byte": "D3", "XRI byte": "EE",
  // 3 bytes (address operand)
  "CALL address": "CD", "JM address": "FA", "STA address": "32", "JMP address": "C3",
  "JNZ address": "C2", "JZ address": "CA", "LDA address": "3A"
};

// 2. Estado da CPU
const CPU = {
    // Registradores A, B, C (valores 0..255)
    A: 0, B: 0, C: 0,
    
    // Ponteiro de instrução e flags (0 ou 1)
    PC: 0,
    flagZero: 0,
    flagSignal: 0,
    
    // Memória: array de bytes (usado pelo simulador/assembler)
    memoria: [],
    
    // Estado de execução
    estaRodando: false
};

// 3. Função de log
// Adiciona linha ao elemento '.output-log'. Se clear=true, substitui o conteúdo.
function logOutput(message, clear = false) {
    const outputLog = document.querySelector('.output-log');
    if (!outputLog) return;
    if (clear) outputLog.textContent = '';
    outputLog.textContent += message + '\n';
    outputLog.scrollTop = outputLog.scrollHeight;
}
