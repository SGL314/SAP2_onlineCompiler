var rtr = 1.25, pady = 0; // retortion
var mrgx = 75/1.5*rtr, mrgy = mrgx; // margins
var tamFio = 3;
var gapFioComponent = 2.5;

function mapSap2() {
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
    rect(mrgx + (200 + 200 + 50*2 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2, 200 / 2 * rtr, 50 * rtr);// flag
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 3 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// TEMP
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 4 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// B
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 5 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// C
    rect(mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 7 - 50 * rtr * 2, 200 * rtr, 50 * rtr);// out
    // rect(mrgx+(200+50*2+(8+8-1)*tamFio+gapFioComponent)*rtr,mrgy+(50+50)*rtr*7-50*rtr*0,200*rtr,50*rtr);// PC

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
    // 16
    for (var i = 0; i < 16; i++) {
        if (fios["mar"][i]==1) fill("#ff0000");
        else fill("#4d81c0");
        // mar to ram
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 3 * rtr,
            tamFio * rtr, 50 * rtr);

        if (i % 2 == 1) continue;
        //ram to mdr
        if (fios["ram"][i/2]==1) fill("#ff0000");
        else fill("#4d81c0");
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr,
            tamFio * rtr, 50 * rtr);
        // ir to con
        if (fios["ir"][i/2]==1) fill("#ff0000");
        else fill("#4d81c0");
        rect(mrgx + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 6 * rtr,
            tamFio * rtr, 50 * rtr);

        // a to alu
        if (fios["a"][i/2]==1) fill("#ff0000");
        else fill("#4d81c0");
        rect(mrgx + (200 + 50 * 2 + 8 * (tamFio * 2) - tamFio) * rtr + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr - 50 * rtr * 7,
            tamFio * rtr, 50 * rtr);
        // alu to temp
        if (fios["temp"][i/2]==1) fill("#ff0000");
        else fill("#4d81c0");
        rect(mrgx + (200 + 50 * 2 + 8 * (tamFio * 2) - tamFio) * rtr + (200 / 2 - 8 * (tamFio * 2)) * rtr + i * (tamFio * 2) * rtr, mrgy + (50 + 50) * 4 * rtr - 50 * rtr * 5,
            tamFio * rtr, 50 * rtr);
    }

    dados = [Flag.zero,Flag.signal];
    for (var i = 0; i < 2; i++) {
        if (dados[i]) fill("#ff0000");
        else fill("#4d81c0");
        // flag to alu
        rect(mrgx + (200 + 200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamFio * 3 / 2) * rtr / 2 + i * tamFio * 2,
            50 *2* rtr, tamFio * rtr);
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

    // fios saindo do CON
    fiosCON();
    //

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
    text("Flag", (200 + 50) * rtr + mrgx + (200 / 2 / 2) * rtr - textWidth("Flag") + (200 + 50 * 3 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + 50 * rtr / 2 + (textAscent() - textDescent()) / 2 + (50 + 50) * rtr);
}

function components(rtr, mrgx, mrgy, gapFioComponent, tamFio) {
    var tamyArea = 20;
    var tamxArea = 40;
    var gapInner = 5;
    var texto = "";
    fill("#ffffff");

    // left
    var dados = [IN,PC,MAR,RAM,MDR,IR,CON];
    for (var i of [1, 2, 3, 4, 5, 6, 7]) {
        fill("#ffffff");
        rect((200 - tamxArea - gapInner) * rtr + mrgx, mrgy + 50 * rtr * i * 2 - 50 * rtr + (50 - tamyArea) / 2 * rtr, tamxArea * rtr, tamyArea * rtr);
        texto = dados[i-1].value.toString(16).toUpperCase()+"h";
        textSize(12);
        fill("#000000");
        text(texto,
            (200 - tamxArea - gapInner) * rtr + mrgx+tamxArea-textWidth(texto),
             mrgy + 50 * rtr * i * 2 - 50 * rtr + (50 - tamyArea) / 2 * rtr + tamyArea/2*rtr + (textAscent()-textDescent())/2);
            
        if (!(dados[i-1] instanceof component_register)) continue;
        if (dados[i-1].receive) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr,
        tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

        if (!(dados[i-1] instanceof component_register)) continue;
        if (dados[i-1].give) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr*3,
        tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
        
        if ((dados[i-1] instanceof component_PC)){
            if (dados[i-1].next) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr*5,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
        }

        if (!(dados[i-1] instanceof component_PC || dados[i-1] instanceof component_MAR)) continue;
        if (dados[i-1].level) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr*7,
        tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

    }

    // right
    var j = 0;
    dados = [A,ALU,TEMP,B,C,OUT];
    for (var i of [1, 2, 3, 4, 5, 7]) {
        fill("#ffffff");
        rect((200 - tamxArea - gapInner) * rtr + mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr, mrgy + (50 + 50) * rtr * i - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr,
            tamxArea * rtr, tamyArea * rtr);
        texto = dados[j].value.toString(16).toUpperCase()+"h";
        textSize(12);
        fill("#000000");
        text(texto,(200 - tamxArea - gapInner) * rtr + mrgx + (200 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr+tamxArea-gapInner-textWidth(texto),
         mrgy + (50 + 50) * rtr * i - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr+ tamyArea/2*rtr + (textAscent()-textDescent())/2
             );

        if ((dados[j] instanceof component_register)){
            if (dados[j].receive) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

            if (dados[j].give) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*3,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
            if (i==1||i==3){
                if (dados[j].giveInner) fill("#00ff00");
                else fill("#ff0000");
                rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
                mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*5,
                tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
            }
        }else if  ((dados[j] instanceof component_ALU)){
            if (dados[j].receiveA) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*1,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

            if (dados[j].receiveTEMP) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*3,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

            if (dados[j].give) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*5,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

            if (dados[j].logic) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*7,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);

            if (dados[j].activate) fill("#00ff00");
            else fill("#ff0000");
            rect(mrgx + (200*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr-tamFio/2*rtr,
            mrgy + (50 + 50) * rtr * (i-1) +50*rtr - gapFioComponent*rtr-tamFio/2*rtr*9,
            tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
        }
        
        // if ((dados[i-1] instanceof component_PC)){
        //     if (dados[i-1].next) fill("#00ff00");
        //     else fill("#ff0000");
        //     rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr*5,
        //     tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);
        // }

        // if (!(dados[i-1] instanceof component_PC || dados[i-1] instanceof component_MAR)) continue;
        // if (dados[i-1].level) fill("#00ff00");
        // else fill("#ff0000");
        // rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio/2*rtr*7,
        // tamFio*rtr/2*1.75,tamFio*rtr/2*1.75);



        j++;
    }

    // flag
    fill("#ffffff");
    rect((200 / 2 - tamxArea - gapInner) * rtr + mrgx + (200 + 200 + 50*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr,
        mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr,
        tamxArea * rtr, tamyArea * rtr);

    texto = Flag.zero.toString(16).toUpperCase() + "b "+Flag.signal.toString(16).toUpperCase()+"b";
    textSize(12);
    fill("#000000");
    text(texto,(200 / 2 - tamxArea - gapInner) * rtr + mrgx + (200 + 200 + 50*2 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr+tamxArea-gapInner-textWidth(texto),
        mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr+ tamyArea/2*rtr + (textAscent()-textDescent())/2,
            );
}

function fiosCON(){
    tamFio /= 2;
    var pcoms = [0,1,0,1,0,1, 0,1,3, 0,1,2,3,   0,1];
    var pcons = [0,1,2,3,4,5, 6,7,11, 8,9,10,11, 12,13, 14,15,16,17,18,19,20];
    var coms =  [6,6,5,5,4,4, 3,3,3, 2,2,2,2,   1,1];
    var verys = [CON.IRreceive==1,CON.IRgive==1,
        CON.MDRreceive==1,CON.MDRgive==1,
        CON.RAMreceive==1,CON.RAMgive==1,
        CON.MARreceive==1,CON.MARgive==1,CON.levelBytePC==1,
        CON.PCreceive==1,CON.PCgive==1,
        PC.next==1,CON.levelBytePC==1,
        CON.INreceive==1,CON.INgive==1
    ];
    // console.log(PC.level+" "+PC.give);
    for (var i=0;i<pcoms.length;i++){
        var pcom = pcoms[i];    
        var pcon = pcons[i];
        var com = coms[i];
        
        if (verys[i]) fill("#ff0000");
        else fill("#4d81c0");

        var tx = (5+pcon*tamFio*2)*rtr,tx2;
        var ty = tamFio*rtr,ty2;
        rect(mrgx-tx
            ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
            tx,ty);
        tx2 = tamFio*rtr;
        ty2 = (50*2)*rtr*(0.5+6-com)+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr;
        rect(mrgx-tx
            ,mrgy+(50+50)*rtr*com-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
            tx2,ty2);
        rect(mrgx-tx
            ,mrgy+(50+50)*rtr*com-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
            tx,ty);   
    }

    pcoms = [0,1, 0,1 ,0,1, 0,1,2 ,0,1,2,3,4    ,0,1,2]; // ,0,1,0,1,0,1  
    pcons = [0,1, 2,3, 4,5, 6,7,8 ,9,10,11,12 ,13,14,15,16,17,18,19,20];
    coms =  [6,6, 4,4, 3,3, 2,2,2, 1,1,1,1,1,    0,0,0];
    verys = [CON.OUTreceive==1,CON.OUTgive==1,
        CON.Creceive==1,CON.Cgive==1,
        CON.Breceive==1,CON.Bgive==1,
        CON.TEMPreceive==1,CON.TEMPgive==1,CON.TEMPgiveInner==1,
        CON.ALUreceiveA==1,CON.ALUreceiveTEMP==1,CON.ALUgive==1,CON.ALUlogic==1,CON.ALUactivate==1,
        CON.Areceive==1,CON.Agive==1,CON.AgiveInner==1
        // CON.Flagreceive==1,CON.Flaggive==1,
        // PC.next==1,CON.levelBytePC==1
    ];
    // console.log(PC.level+" "+PC.give);
    for (var i=0;i<pcoms.length;i++){
        var pcom = pcoms[i];    
        var pcon = pcons[i];
        var com = coms[i];
        
        if (verys[i]) fill("#ff0000");
        else fill("#4d81c0");
        var tx = ((8*2-1)*tamFio*2+50*2+200+gapFioComponent+5+tamFio*pcon*2)*rtr,tx2;
        var ty = tamFio*rtr,ty2;
        rect(mrgx+200*rtr
            ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
            tx,ty); 
        tx2 = tamFio*rtr;
        ty2 = gapFioComponent*2*rtr+tamFio*rtr*(pcon)*2+(6-com)*rtr*(50*2)+2*tamFio*rtr*pcom; // +(50*2)*rtr*(0.5+6-com)+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr
         
        rect(mrgx+200*rtr+tx-tamFio*rtr
            ,mrgy+(50+50)*rtr*(com+0.5)-gapFioComponent-(tamFio*2)*pcom*rtr-ty+tamFio*rtr,
            tx2,ty2);
        tx3 = (5)*rtr+tamFio*rtr*2*pcon;
        ty3 = tamFio*rtr;
        rect(mrgx+tx+(200-5)*rtr-tamFio*2*rtr*pcom-tamFio*rtr*2*(pcon-pcom)
            ,mrgy+(50+50)*rtr*(com+0.5)-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
            tx3,ty3);   
    }

    tamFio *= 2;
}
function fiostoPC(){
    // levelBytePC
    

    // PCnext
    if (PC.receive==1) fill("#ff0000");
    else fill("#4d81c0");
    var pcom = 0;
    var pcon = 5;

    var tx = (10+pcon*5)*rtr,tx2;
    var ty = tamFio*rtr,ty2;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
        tx,ty);
    tx2 = tamFio*rtr;
    ty2 = (50*2)*rtr*4.5+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx2,ty2);
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx,ty);

    if (PC.give==1) fill("#ff0000");
    else fill("#4d81c0");
    var pcom = 1;
    var pcon = 6;

    var tx = (10+pcon*5)*rtr,tx2;
    var ty = tamFio*rtr,ty2;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
        tx,ty);
    tx2 = tamFio*rtr;
    ty2 = (50*2)*rtr*4.5+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx2,ty2);
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx,ty);

    // PCgive
    if (PC.next==1) fill("#ff0000");
    else fill("#4d81c0");
    var pcom = 2;
    var pcon = 7;

    var tx = (10+pcon*5)*rtr,tx2;
    var ty = tamFio*rtr,ty2;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
        tx,ty);
    tx2 = tamFio*rtr;
    ty2 = (50*2)*rtr*4.5+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx2,ty2);
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx,ty);

    if (CON.levelBytePC==1) fill("#ff0000");
    else fill("#4d81c0");
    var pcom = 3;
    var pcon = 8;

    var tx = (10+pcon*5)*rtr,tx2;
    var ty = tamFio*rtr,ty2;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*pcon*rtr,
        tx,ty);
    tx2 = tamFio*rtr;
    ty2 = (50*2)*rtr*4.5+gapFioComponent*2+ty+tamFio*2*(pcon+pcom)*rtr;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx2,ty2);
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*2-gapFioComponent-(tamFio*2)*pcom*rtr-ty,
        tx,ty);
}
