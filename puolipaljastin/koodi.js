

const vakiot = {
    2: "kaksinkertaistamisvakio",
    3: "pii",
    4: "pienimmän alkuluvun toinen monikerta",
    5: "luku 5",
    6: "täydellinen luku",
    7: "pyhä luku 7",
    8: "pyhä luku 8",
    9: "piin neliö",
    10: "Maan putoamiskiihtyvyys",
    11: "ikä, jossa ihminen täyttää pyöreitä, kunhan lukujäjestelmän kantaluku on 11",
    13: "kansainvälinen epäonnen luku"
};

const vt = Object.keys(vakiot).map(Number);

const jatkovaihtoehdot = [
    [[..."kaksinkertaistamisvakio"].map(x => x.charCodeAt(0) - 96), 1, []]
];

const jaaOsiin = (t, n) => {
    let tulos = []
    let osatulos = [];
    t.forEach(x => {
        osatulos.push(x);
        if (osatulos.length === n) {
            tulos.push([...osatulos]);
            osatulos = [];
        }
    });
    if (osatulos.length > 0)
        tulos.push([...osatulos]);
    return tulos;
};

const summa = (p, k) => Math.abs(333 - p.reduce((a, b) => a + b, 0)) * (k + 1);

const f = () => {
    const nyt = jatkovaihtoehdot.shift();
    
    if (nyt[1] === 0 && nyt[2].length > 5)
        return nyt;
    
    // lisää vakio
    vt.forEach(x => {
        const jatko = nyt[0].map(p => p + x);
        jatkovaihtoehdot.push([
            jatko,
            summa(jatko, nyt[2].length),
            nyt[2].concat(`lisää osiin ${vakiot[x]} ([${jatko.join(", ")}])`)
        ]);
    });
    
    // vähennä vakio
    // if (nyt[2].length > 6)
        vt.forEach(x => {
            const jatko = nyt[0].map(p => p - x);
            jatkovaihtoehdot.push([
                jatko,
                summa(jatko, nyt[2].length),
                nyt[2].concat(`vähennä osista ${vakiot[x]} ([${jatko.join(", ")}])`)
            ]);
        });
    
    // kerro vakiolla
    vt.forEach(x => {
        const jatko = nyt[0].map(p => p * x);
        jatkovaihtoehdot.push([
            jatko,
            summa(jatko, nyt[2].length),
            nyt[2].concat(`kerro osat vakiolla ${vakiot[x]} ([${jatko.join(", ")}])`)
        ]);
    });
    
    
    
    
    const luvallisetJaot = [2,3,4];//.slice(0, Math.floor((nyt[0].length - 2) / 2) - 1);
    
    // jaa osiin ja kerro
    if (nyt[0].length > 1)
        luvallisetJaot.forEach(x => {
            const jatko = jaaOsiin(nyt[0], x).map(p => p.reduce((a, b) => a * b, 1));
            jatkovaihtoehdot.push([
                jatko,
                summa(jatko, nyt[2].length),
                nyt[2].concat(`jaa jono ${vakiot[x]}:n pituisiin osiin ja kerro saman osan jäsenet keskenään ([${jatko.join(", ")}])`)
            ]);
        });
    
    // jaa osiin ja lisää
    if (nyt[0].length > 1)
        luvallisetJaot.forEach(x => {
            const jatko = jaaOsiin(nyt[0], x).map(p => p.reduce((a, b) => a + b, 1));
            jatkovaihtoehdot.push([
                jatko,
                summa(jatko, nyt[2].length),
                nyt[2].concat(`jaa jono ${vakiot[x]}:n pituisiin osiin ja laske saman osan jäsenet yhteen ([${jatko.join(", ")}])`)
            ]);
        });
    
    // jaa tekijä pois
    vt.forEach(x => {
        const jatko = nyt[0].map(p => p % x === 0 ? p / x : p);
        const matka = summa(jatko, nyt[2].length);
        if (jatko.some((x, i) => x !== nyt[0][i]))
            jatkovaihtoehdot.push([
                jatko,
                matka,
                nyt[2].concat(`jaa osista tekijä ${vakiot[x]} pois ([${jatko.join(", ")}])`)
            ]);
    });
    
    // lisää ainoaan yksi
    if (nyt[0].length === 1)
        jatkovaihtoehdot.push([
            [Number(nyt[0]) + 1],
            summa([nyt[0] + 1], nyt[2].length - 1),
            nyt[2].concat(`lisää ainoaan osaan yksi ([${nyt[0] + 1}])`)
        ]);
    // vähennä ainoasta yksi
    if (nyt[0].length === 1)
        jatkovaihtoehdot.push([
            [nyt[0] - 1],
            summa([nyt[0] - 1], nyt[2].length - 1),
            nyt[2].concat(`vähennä ainoasta osasta yksi ([${nyt[0] - 1}])`)
        ]);
    
    
    
    jatkovaihtoehdot.sort((a, b) => a[1] - b[1]);
    jatkovaihtoehdot.length = 500;
    
    return null;
};

const etsi = () => {
    let sana = document.getElementById("nimi").value;
    
    jatkovaihtoehdot.length = 0;
    jatkovaihtoehdot.push([[...sana].map(x => x.charCodeAt(0) - 96), 1, []]);
    let tulos = null;
    for (let i = 0; i < 4000; i++) {
        tulos = f();
        if (tulos !== null)
            break;
    }
    console.log(tulos);
    
    const tulosruutu = document.getElementById("tulosruutu");
    
    if (tulos === null)
        tulosruutu.innerHTML = "Emme voineet varmistaa asiaa. Tämä ei kuitenkaan tarkoita, että niin ei ole."
    else
        tulosruutu.innerHTML = tulos[2].join("\n");
};