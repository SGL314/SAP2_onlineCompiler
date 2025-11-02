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
}

function draw() {
    background("#ffffff");
    fill(255, 100, 0);
    const sec = document.querySelector(".files");

    mapSap2();

    activateFio("bus",0,1);
}

function activateFio(local,numFio, data) {
    for (let i = 0; i < 8; i++) {
        if (i == numFio) {
            fios[local][i] = data;
        }
    }
}

function mapSap2() {
    var rtr = 1, pady = 0; // retortion
    var mrgx = 100 / 3 * rtr, mrgy = mrgx; // margins
    var tamFio = 3;
    var gapFioComponent = 2.5;

    stroke(1);


    fill("#4d81c0");
    rect(mrgx, mrgy + 50 * rtr, 200 * rtr, 50 * rtr);// in port
    rect(mrgx, mrgy + (50 + 50) * rtr * 1 + 50 * rtr, 200 * rtr, 50 * rtr);// PC
    rect(mrgx, mrgy + (50 + 50) * rtr * 2 + 50 * rtr, 200 * rtr, 50 * rtr);// mar memory acess register
    rect(mrgx, mrgy + (50 + 50) * rtr * 3 + 50 * rtr, 200 * rtr, 50 * rtr);// ram 
    rect(mrgx, mrgy + (50 + 50) * rtr * 4 + 50 * rtr, 200 * rtr, 50 * rtr);// mdr memory data register
    rect(mrgx, mrgy + (50 + 50) * rtr * 5 + 50 * rtr, 200 * rtr, 50 * rtr);// ir instruction register
    rect(mrgx, mrgy + (50 + 50) * rtr * 6 + 50 * rtr, 200 * rtr, 50 * rtr);// con

    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 1 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// A
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// ALU
    rect(mrgx + (200 + 200 + 50 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2, 200 / 2 * rtr, 50 * rtr);// flag
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 3 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// TEMP
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 4 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// B
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 5 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// C
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 7 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// out
    // rect(mrgx+(200+50*2+(8+8-1)*tamFio+gapFioComponent)*rtr,mrgy+(50+50)*rtr*7-50*rtr*0,200*rtr,50*rtr);// PC

    // fill("#000000");
    // line(mrgx,mrgy+50/2*rtr, mrgx+200*rtr, mrgy+50/2*rtr);

    // 8 lines
    for (var unity of [0, 1, 2, 3, 4, 5]) {
        pady = unity * (50 + 50) * rtr + 50 * rtr;


        if (unity == 5) pady += 50 * rtr * 2;
        for (let i = 0; i < 8; i++) {
            fill("#4d81c0");
            noStroke();
            if (fios["bus"][i] == 1) {
                fill("#ff0000");
            }
            // to bus
            rect(mrgx + 200 * rtr + (50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr - 50 * rtr, (mrgy + gapFioComponent * rtr + i * 6 * rtr) + pady - 50 * rtr, 50 * rtr, tamFio * rtr);
            // to conection
            rect(mrgx + 200 * rtr + 50 * rtr + (tamFio + gapFioComponent + i * (tamFio * 2)) * rtr, (mrgy + gapFioComponent * rtr + i * 6 * rtr) + pady - 50 * rtr, (tamFio * 2 * 8 - tamFio) * rtr * ((8 - i) / 8), tamFio * rtr);
        }
        pady = unity * (50 + 50) * rtr + 50 * rtr;

        if (unity == 3) continue;
        for (let i = 0; i < 8; i++) {
            fill("#4d81c0");
            noStroke();
            if (fios["bus"][8 - i - 1] == 1) {
                fill("#ff0000");
            }
            // to bus
            rect(mrgx + 200 * rtr, (mrgy + gapFioComponent * rtr + i * 6 * rtr) + pady, 50 * rtr, tamFio * rtr);
            // to conection
            rect(mrgx + 200 * rtr + 50 * rtr, (mrgy + gapFioComponent * rtr + i * 6 * rtr) + pady, (tamFio * 2 * 8 - tamFio) * rtr * ((8 - i) / 8), tamFio * rtr);
        }
    }

    // between components
    for (var i = 0; i < 16; i++) {
        fill("#4d81c0");
        // mar to ram
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 3 * rtr,
            tamFio * rtr, 50 * rtr);

        if (i % 2 == 1) continue;
        //ram to mdr
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr,
            tamFio * rtr, 50 * rtr);
        // ir to con
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 6 * rtr,
            tamFio * rtr, 50 * rtr);

        // a to alu
        rect(mrgx + (200 + 50 * 2 + 8 * (tamFio * 2) - tamFio) * rtr + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr - 50 * rtr * 7,
            tamFio * rtr, 50 * rtr);
        // alu to temp
        rect(mrgx + (200 + 50 * 2 + 8 * (tamFio * 2) - tamFio) * rtr + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr - 50 * rtr * 5,
            tamFio * rtr, 50 * rtr);
    }

    for (var i = 0; i < 2; i++) {
        fill("#4d81c0");
        // flag to alu
        rect(mrgx + (200 + 200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamFio * 3 / 2) * rtr / 2 + i * tamFio * 2,
            50 * rtr, tamFio * rtr);
    }

    padx = (200 + 50) * rtr;

    // bus
    for (let i = 0; i < 8; i++) {
        fill("#4d81c0");
        noStroke();
        if (fios["bus"][i] == 1) {
            fill("#ff0000");
        }
        rect(mrgx + padx + tamFio * rtr * (i + 1) + tamFio * i * rtr, mrgy - 5, tamFio * rtr, ((50 + 50) * 7 - 50 + 5) * rtr);
        // if (i==1) break;
    }

    texts(rtr, mrgx, mrgy, gapFioComponent, tamFio);
    components(rtr, mrgx, mrgy, gapFioComponent, tamFio);
}

function texts(rtr, mrgx, mrgy, gapFioComponent, tamFio) {
    stroke(1);
    fill("#000000");
    textSize(20);
    var textos = ["IN Port", "PC", "MAR", "RAM", "MDR", "IR", "CON"];
    for (let i = 0; i < textos.length; i++) {
        text(textos[i], mrgx + (200 / 2) * rtr - textWidth(textos[i]) / 2, mrgy + 50 * rtr / 2 + (textAscent() - textDescent()) / 2 + (50 + 50) * rtr * (i) + 50 * rtr);
    }

    textos = ["A", "ALU", "TEMP", "B", "C", "", "OUT"];
    for (let i = 0; i < textos.length; i++) {
        text(textos[i], mrgx + (200 / 2) * rtr - textWidth(textos[i]) / 2 + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + 50 * rtr / 2 + (textAscent() - textDescent()) / 2 + (50 + 50) * rtr * (i));
    }

    textSize(20);
    text("Flag", (200 + 50) * rtr + mrgx + (200 / 2 / 2) * rtr - textWidth("Flag") + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + 50 * rtr / 2 + (textAscent() - textDescent()) / 2 + (50 + 50) * rtr);
}

function components(rtr, mrgx, mrgy, gapFioComponent, tamFio) {
    var tamyArea = 20;
    var tamxArea = 40;
    var gapInner = 5;
    fill("#ffffff");

    for (var i of [1, 2, 3, 4, 5, 6, 7]) {
        rect((200 - tamxArea - gapInner) * rtr + mrgx, mrgy + 50 * rtr * i * 2 - 50 * rtr + (50 - tamyArea) / 2 * rtr, tamxArea * rtr, tamyArea * rtr);
    }

    for (var i of [1, 2, 3, 4, 5, 7]) {
        rect((200 - tamxArea - gapInner) * rtr + mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr, mrgy + (50 + 50) * rtr * i - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr,
            tamxArea * rtr, tamyArea * rtr);
    }

    rect((200 / 2 - tamxArea - gapInner) * rtr + mrgx + (200 + 200 + 50 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr,
        mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr,
        tamxArea * rtr, tamyArea * rtr);// flag
}