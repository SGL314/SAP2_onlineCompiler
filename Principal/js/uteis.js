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
class geral{
   constructor(){
    this.A= 0; this.TEMP= 0;this.B= 0; this.C= 0;

    // porta in
    this.IN= 0;

    // components
    
    
    // Ponteiro de instrução e flags (0 ou 1)
    this.PC= 0;
    this.flagZero= 0;
    this.flagSignal= 0;
    
    // Memória= array de bytes (usado pelo simulador/assembler)
    this.memoria= [];
    
    // Estado de execução
    this.estaRodando= false
   }
};
class component{
  constructor(){
    this.value = 0;
  }
  run(){};
}

class component_CON extends component{
  constructor(){
    super();
    this.levelBytePC= 0; // 0 baixo (0-7); 1 alto (8-15)
    this.nextCounter = 0;
    this.MARreceive= 0;
    this.RAMreceive= 0;
    this.IRreceive = 0;

  }
  indexAddressFromPC(){
    var pc = PC.value.toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // pri(pc);
    for (var i =15;i>=16-pc.length;i--){
        onBus[i] = int(pc[i-(16-pc.length)]);
    }
    // console.log(onBus);
    if (CON.levelBytePC == 0){
        for (var i = 15;i>=8;i--){
            activateFio("bus",i%8,onBus[i]);
        }
    }else{
        for (var i = 7;i>=0;i--){
            activateFio("bus",i,onBus[i]);
        }
        CPU.PC += 1;
    }
  }
  run(){
    // receiving
    var values = [this.MARreceive,this.RAMreceive];
    var targets = [MAR,RAM];
    for (var i = 0; i < values.length; i++) {
      targets[i].receive = values[i];
    }

    // giving
    var values = [this.levelBytePC];
    var targets = [PC];
    for (var i = 0; i < values.length; i++) {
      targets[i].give = values[i];
    }
    // PC
    PC.next = this.nextCounter;
    if (this.Counter) this.nextCounter = 0;
  }
}

class component_RAM extends component{
  constructor(){
    super();
  }
}
// class component_MDR extends component{
//   constructor(){
//     super();
//   }
// }
class component_ALU extends component{
  constructor(){
    super();
  }
}
// class component_IR extends component{
//   constructor(){
//     super();
//   }
// }
class component_IN extends component{
  constructor(){
    super();
  }
}

class component_register extends component{
  constructor(){
    super();
    this.receive = 0;
    this.give = 0;
  }
  run(){
    if (this.receive) this.#getFromBus();
  }
  #getFromBus(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["bus"][i];
    }
    // pri(str);
    str = int(str,2);
    this.value = str.toString(16).toUpperCase();
  }
  _putOnBus(){
    var str = this.value.toString(2);
    for (var i=0;i<8-str.length;i++){
      fios["bus"][i] = int(str[i]);
    }
  }
}

class component_PC extends component_register{
  constructor(){
    super();
    this.next = 0;
  }
  run(){
    if (this.next) this.value += 1;
    if (this.give) this._putOnBus();
  }
}

// registradores
var PC = new component_PC();
var OUT = new component_register();
var MAR = new component_register();
var MDR = new component_register();
var IR = new component_register();
var A = new component_register();
var B = new component_register();
var C = new component_register();
var TEMP = new component_register();

// componentes especificos
var CPU = new geral();
var CON = new component_CON();
var RAM = new component_RAM();
var ALU = new component_ALU();
var IN = new component_IN();

// 3. Função de log
// Adiciona linha ao elemento '.output-log'. Se clear=true, substitui o conteúdo.
function logOutput(message, clear = false) {
    const outputLog = document.querySelector('.output-log');
    if (!outputLog) return;
    if (clear) outputLog.textContent = '';
    outputLog.textContent += message + '\n';
    outputLog.scrollTop = outputLog.scrollHeight;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pri(texto){
    console.log(texto);
}