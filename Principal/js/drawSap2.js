var rtr = 1, pady = 0; // retortion
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
    rect(mrgx + (200 + 200 + 50 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2, 200 / 2 * rtr, 50 * rtr);// flag
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
    text("Flag", (200 + 50) * rtr + mrgx + (200 / 2 / 2) * rtr - textWidth("Flag") + (200 + 50 * 2 + (8 + 8 - 1) * tamFio + gapFioComponent) * rtr, mrgy + 50 * rtr / 2 + (textAscent() - textDescent()) / 2 + (50 + 50) * rtr);
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
            (200 - tamxArea - gapInner) * rtr + mrgx+tamxArea-gapInner-textWidth(texto),
             mrgy + 50 * rtr * i * 2 - 50 * rtr + (50 - tamyArea) / 2 * rtr + tamyArea/2*rtr + (textAscent()-textDescent())/2);
            
        if (!(dados[i-1] instanceof component_register)) continue;
        if (dados[i-1].receive) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio*rtr,
        tamFio*rtr*1.5,tamFio*rtr*1.5);

        if (!(dados[i-1] instanceof component_register)) continue;
        if (dados[i-1].give) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio*rtr*3,
        tamFio*rtr*1.5,tamFio*rtr*1.5);
        
        if (!(dados[i-1] instanceof component_PC)) continue;
        if (dados[i-1].next) fill("#00ff00");
        else fill("#ff0000");
        rect(mrgx+tamFio*rtr,mrgy + 50 * rtr * i * 2 - 50 * rtr+50*rtr-gapFioComponent-tamFio*rtr*5,
        tamFio*rtr*1.5,tamFio*rtr*1.5);

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
        j++;
    }

    fill("#ffffff");
    rect((200 / 2 - tamxArea - gapInner) * rtr + mrgx + (200 + 200 + 50 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr,
        mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr,
        tamxArea * rtr, tamyArea * rtr);// flag

    texto = CPU.flagZero.toString(16).toUpperCase() + "b "+CPU.flagSignal.toString(16).toUpperCase()+"b";
    textSize(12);
    fill("#000000");
    text(texto,(200 / 2 - tamxArea - gapInner) * rtr + mrgx + (200 + 200 + 50 + 50 * 2 + (8 + 8 - 1) * tamFio) * rtr+tamxArea-gapInner-textWidth(texto),
        mrgy + (50 + 50) * rtr * 2 - 50 * rtr * 2 + (50 - tamyArea) / 2 * rtr+ tamyArea/2*rtr + (textAscent()-textDescent())/2,
            );
}

function fiosCON(){
    tamFio /= 2;
    var pcoms = [0,1];
    var pcons = [0,1];
    var coms = [6,6];
    var verys = [CON.IRreceive==1,CON.IRgive==1,CON.MARreceive==1];
    for (var i=0;i<pcoms.length;i++){
        var pcom = pcoms[i];
        var pcon = pcons[i];
        var com = coms[i];
        
        if (verys[i]) fill("#00ff00");
        else fill("#ff0000");

        var tx = (tamFio*3.33333+pcon*5)*rtr,tx2;
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
    fiostoPC();

    // RAMreceive
    if (CON.RAMreceive==1) fill("#ff0000");
    else fill("#4d81c0");
    var tx = 25*rtr,tx2;
    var ty = tamFio*rtr,ty2;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*3*rtr,
        tx,ty);
     tx2 = tamFio*rtr;
    ty2 = (50*2)*rtr*2.5+gapFioComponent*2+ty+tamFio*2*3*rtr;
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*4-gapFioComponent-(tamFio*2)*0*rtr-ty,
        tx2,ty2);
    rect(mrgx-tx
        ,mrgy+(50+50)*rtr*4-gapFioComponent-(tamFio*2)*0*rtr-ty,
        tx,ty);

    

    //     if (CON.MARreceive==1) fill("#ff0000");
    // else fill("#4d81c0");
    // var tx = 25*rtr,tx2;
    // var ty = tamFio*rtr,ty2;
    // rect(mrgx-tx
    //     ,mrgy+(50+50)*rtr*7-50*rtr+gapFioComponent+(tamFio*2)*3*rtr,
    //     tx,ty);
    //  tx2 = tamFio*rtr;
    // ty2 = (50*2)*rtr*2.5+gapFioComponent*2+ty+tamFio*2*3*rtr;
    // rect(mrgx-tx
    //     ,mrgy+(50+50)*rtr*4-gapFioComponent-(tamFio*2)*0*rtr-ty,
    //     tx2,ty2);
    // rect(mrgx-tx
    //     ,mrgy+(50+50)*rtr*4-gapFioComponent-(tamFio*2)*0*rtr-ty,
    //     tx,ty);

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
