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
    this.hz = 25;

    // porta in
    this.IN= 0;

    // components
    
    
    // Ponteiro de instrução e flags (0 ou 1)
    this.PC= 0;
    
    // Memória= array de bytes (usado pelo simulador/assembler)
    this.memoria= [];
    
    // Estado de execução
    this.estaRodando= false;
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
    this.IRgive = 0;
    this.IRreceive = 0;
    this.MDRgive= 0;
    this.MDRreceive= 0;
    this.RAMgive= 0;
    this.RAMreceive= 0;
    this.MARgive= 0;
    this.MARreceive= 0;
    this.PCgive= 0;
    this.PCreceive= 0;

    this.Agive = 0;
    this.AgiveInner = 0;
    this.Areceive = 0;
    this.Bgive = 0;
    this.Breceive = 0;
    this.Cgive = 0;
    this.Creceive = 0;
    this.TEMPgive = 0;
    this.TEMPgiveInner = 0;
    this.TEMPreceive = 0;
    this.getIR = 0;

    this.ALUreceiveA = 0;
    this.ALUreceiveTEMP = 0;
    this.ALUgive = 0;
    this.ALUactivate = 0;
    this.ALUlogic = 0; // 1 som 0 subtração
    
    this.nextCounter = 0;
    this.levelBytePC= 0; // 0 baixo (0-7); 1 alto (8-15)
    // this.

  }
  run(){
    // receiving
    var values = [this.MARreceive,this.RAMreceive,this.MDRreceive,this.IRreceive,this.Areceive,this.Breceive,this.Creceive,this.TEMPreceive];
    var targets = [MAR,RAM,MDR,IR,A,B,C,TEMP];
    for (var i = 0; i < values.length; i++) {
      targets[i].receive = values[i];
    }

    // giving
    var values = [this.PCgive,this.MDRgive,this.IRgive,this.Agive,this.Bgive,this.Cgive,this.TEMPgive,this.ALUgive];
    var targets = [PC,MDR,IR,A,B,C,TEMP,ALU];
    for (var i = 0; i < values.length; i++) {
      targets[i].give = values[i];
    }
    var values = [this.AgiveInner,this.TEMPgiveInner];
    var targets = [A,TEMP];
    for (var i = 0; i < values.length; i++) {
      targets[i].giveInner = values[i];
    }

    // PC
    PC.next = this.nextCounter;
    if (this.nextCounter) this.nextCounter = 0;
    PC.level = this.levelBytePC;
    MAR.level = this.levelBytePC;

    //ir
    if (this.getIR) this.#getFromIR();

    //alu 
    ALU.logic = CON.ALUlogic;
    ALU.receiveA = CON.ALUreceiveA;
    ALU.receiveTEMP = CON.ALUreceiveTEMP;
    ALU.activate = CON.ALUactivate;

  }
  #getFromIR(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["ir"][i];
    }
    // pri(str);
    str = int(str,2);
    // pri(str);
    if (str == 0){
      this.value = "0"+str.toString(16).toUpperCase();
    }else if (int(this.value) == 0){
      this.value = ""+str.toString(16).toUpperCase();
    }else this.value = str.toString(16).toUpperCase();
  }
}


// }
class component_ALU extends component{
  constructor(){
    super();
    this.receiveA = 0;
    this.receiveTEMP = 0;
    this.give = 0;
    this.activate = 0;
    this.logic = 0;
    this.Avalue = 0;
    this.TEMPvalue = 0;

  }
  run(){
    if (this.receiveA){
      var str = "";
      for (var i=0;i<8;i++){
        str += fios["a"][i];
      }
      // pri(str);
      str = int(str,2);
      console.log(this.value,str);
      this.Avalue = str.toString(16).toUpperCase();
    }
    if (this.receiveTEMP){
      var str = "";
      for (var i=0;i<8;i++){
        str += fios["temp"][i];
      }
      // pri(str);
      str = int(str,2);
      console.log(this.value,str);
      this.TEMPvalue = str.toString(16).toUpperCase();
    }
    if (this.activate){
      if (this.logic){
        this.value = int(int(this.Avalue,16) + int(this.TEMPvalue,16),16);
      }else{
        this.value = int(int(this.Avalue,16) - int(this.TEMPvalue,16),16);
      }
    }
    if (this.give) this._putOnBus();
  }
  _putOnBus(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0];
    for (var i =7;i>=8-pc.length;i--){
      onBus[i] = int(pc[i-(8-pc.length)]);
    }
    for (var i = 0;i<=7;i++){
      activateFio("bus",i,onBus[i]);
    }
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
  constructor(whereALU = ""){
    super();
    this.receive = 0;
    this.give = 0;
    this.level = 0;
    this.giveInner = 0;
    this.whereALU = whereALU;
  }
  run(){
    if (this.receive) this.#getFromBus();
    if (this.give) this._putOnBus();
    if (this.giveInner) this.#putOnALU();
    this._especs();
  }
  _especs(){
    // if (this.value.length==4) this.value = this.value.toString()[3]+this.value.toString()[4];
  } // função vazia para ser sobrescrita
  #getFromBus(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["bus"][i];
    }
    // pri(str);
    str = int(str,2);
    console.log(this.value,str);
    this.value = str.toString(16).toUpperCase();    
  }
  _putOnBus(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0];
    for (var i =7;i>=8-pc.length;i--){
      onBus[i] = int(pc[i-(8-pc.length)]);
    }
    for (var i = 0;i<=7;i++){
      activateFio("bus",i,onBus[i]);
    }
    if (this.whereALU=="a"){
      console.log(onBus);
    console.log(fios["bus"]);
    }
  }
  #putOnALU(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0];
    for (var i =7;i>=8-pc.length;i--){
      onBus[i] = int(pc[i-(8-pc.length)]);
    }
    // console.log(onBus);
    for (var i = 0;i<=7;i++){
      activateFio(this.whereALU,i,onBus[i]);
    }
  }
}

class component_PC extends component_register{
  constructor(){
    super();
    this.next = 0;
    this.level = 0;
  }
  run(){
    if (this.next) this.value += 1;
    if (this.give) this._putOnBus();
  }
  _putOnBus(){
    // pri("l:"+this.level);
    var pc = this.value.toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i =15;i>=16-pc.length;i--){
      onBus[i] = int(pc[i-(16-pc.length)]);
    }
    // pri(onBus);
    // console.log(onBus);
    if (this.level==0){
        for (var i = 15;i>=8;i--){
          activateFio("bus",i%8,onBus[i]);
        }
    }else{
        for (var i = 7;i>=0;i--){
          activateFio("bus",i,onBus[i]);
        }
    }
    // pri(fios["bus"]);
  }
}

class component_MAR extends component_register{
  constructor(){
    super();
  }
  run(){
    if (this.receive) this.#getFromBus();
    if (this.give) this._putOnBus();
    this._especs();
  }
  _especs(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i =15;i>=16-pc.length;i--){
      onBus[i] = int(pc[i-(16-pc.length)]);
    }
    // console.log(onBus);
    for (var i = 0;i<=15;i++){
      activateFio("mar",i,onBus[i]);
    }
    // console.log(fios["mar"]);
  }
  #getFromBus(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["bus"][i];
    }
    // pri(str);
    str = int(str,2);
    // console.log(this.value,str);
    if (this.level==0){
      if (str == 0 || str.toString(16).toUpperCase().length<2){
        this.value = "000"+str.toString(16).toUpperCase();
      }else if (int(this.value) == 0){
        this.value = "0"+str.toString(16).toUpperCase();
      }else this.value = this.value[0]+this.value[1]+str.toString(16).toUpperCase();
    }else{
      this.value = str.toString(16).toUpperCase()+this.value[2]+this.value[3];
    }
  }
}

class component_RAM extends component_register{
  constructor(){
    super();
    this.address = "";
    this.memoria = new Array(0xFFFF).fill(0);
  }
  #getFromMAR(){
    var str = "";
    for (var i=0;i<16;i++){
      str += fios["mar"][i];
    }
    // pri(str);
    str = int(str,2);
    // pri(str);
    this.address = str.toString(16).toUpperCase();
    
  }
  _especs(){
    this.#getFromMAR();
    this.value = this.memoria[int(this.address,16)]
    this.#putOnMDR(); // mdr memory data register
  }
  #putOnMDR(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0];
    for (var i =7;i>=8-pc.length;i--){
      onBus[i] = int(pc[i-(8-pc.length)]);
    }
    // pri(onBus);
    // console.log(onBus);
    for (var i = 0;i<8;i++){
      activateFio("ram",i,onBus[i]);
    }
    // console.log(onBus,fios["ram"]);
  }
}

class component_MDR extends component_register{
  constructor(){
    super();
  }
  run(){
    if (this.receive) this.#getFromRAM();
    if (this.give) this._putOnBus();
    this._especs();
  }
  _especs(){

  }
  #getFromRAM(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["ram"][i];
    }
    // pri(str);
    str = int(str,2);
    console.log(str);
    this.value = str.toString(16).toUpperCase();
  }
}

class component_IR extends component_register{
  constructor(){
    super();
    this.receive = 0;
    this.give = 0;
    this.level = 0;
  }
  run(){
    if (this.receive) this.#getFromBus();
    if (this.give) this.#putOnCON();
    this._especs();
  }
  _especs(){} // função vazia para ser sobrescrita
  #getFromBus(){
    var str = "";
    for (var i=0;i<8;i++){
      str += fios["bus"][i];
    }
    // pri(str);
    str = int(str,2);
    // pri(str);
    if (str == 0){
      this.value = "0"+str.toString(16).toUpperCase();
    }else if (int(this.value) == 0){
      this.value = ""+str.toString(16).toUpperCase();
    }else this.value = str.toString(16).toUpperCase();
  }
  _putOnBus(){
    var str = int(this.value,16).toString(2);

    for (var i=7;i>=8-str.length;i--){
      fios["bus"][i] = int(str[i-(8-str.length)]);
    }
    // this.give = 0;
  }
  #putOnCON(){
    var pc = int(this.value,16).toString(2).toUpperCase();
    var onBus = [0,0,0,0,0,0,0,0];
    for (var i =7;i>=8-pc.length;i--){
      onBus[i] = int(pc[i-(8-pc.length)]);
    }
    // pri(onBus);
    // console.log(onBus);
    for (var i = 0;i<8;i++){
      activateFio("ir",i,onBus[i]);
    }
    // console.log(onBus,fios["ram"]);
  }
}

class component_Flag extends component{
  constructor(){
    super();
    this.zero = 0;
    this.signal = 0;
  }
}

// registradores
var PC, 
MAR,
OUT,
MDR,
IR,
A,
B,
C,
TEMP,
CPU,
CON,
RAM,
ALU,
IN,Flag;

newAll();
// componentes especificos


function newAll(){
  // registradores
  OUT = new component_register();
  A = new component_register("a");
  B = new component_register();
  C = new component_register();
  TEMP = new component_register("temp");
  Flag = new component_Flag();
  
  // componentes especificos
  CPU = new geral();
  IR = new component_IR();
  MDR = new component_MDR();
  MAR = new component_MAR();
  PC = new component_PC();
  RAM = new component_RAM();
  CON = new component_CON();
  ALU = new component_ALU();
  IN = new component_IN();
}



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
  // while(CPU.estaRodando == false){}
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pri(texto){
  console.log(texto);
}