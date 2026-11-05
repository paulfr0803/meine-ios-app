const ANZEIGE_ID = "Anzeige";
const EINGABEFELD_ID="eingabefeld";
const RECHENWEG_ANZEIGE_ID="rechenweg-anzeige";
const RECHNEN_BUTTON_ID="rechnen-button";
const TASTE_KLASSE="taste";
const VERLAUF_ANZEIGE_ID = "taschenrechner-verlauf";

const LEERZEICHEN_ERFORDERLICH_REGEX = /(\d|\))\s*(\+|\-|\*|\/)\s*/g;
const GUELTIGE_EINGABE_REGEX = /^[\d .,\(\)\+\-\*\/]*$/;

const anzeige= document.getElementById(ANZEIGE_ID);
const eingabefeld= document.getElementById(EINGABEFELD_ID);
const rechenwegAnzeige=document.getElementById(RECHENWEG_ANZEIGE_ID);
const rechnenButton= document.getElementById(RECHNEN_BUTTON_ID);
const tasten= document.getElementsByClassName(TASTE_KLASSE);
const taschenrechnerVerlauf= document.getElementById(VERLAUF_ANZEIGE_ID);

const formatierer = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 15,
    useGrouping: false,
});


let aktuelleEingabe="";
let verlaufListe = [];

function aktualisiereVerlaufAnzeige() {
    taschenrechnerVerlauf.textContent = "";
    for (const eintrag of verlaufListe) {
        const eintragElement = document.createElement("p");
        eintragElement.textContent = eintrag;
        verlaufAnzeige.appendChild(eintragElement);
    }
}

//die Liste der Tasten durchgehen
for(const taste of tasten) {
    //jeder Taste sagen was passieren soll wenn man auf sie klickt
    taste.addEventListener("click", function (ereignis){
        //1. rechenweg anzeige leeren
        rechenwegAnzeige.textContent = "";
        
        //2. herausfinden welches zeichen auf der angeklickten Taste abgebildet ist
        const angeklicktesZeichen = ereignis.target.textContent;
        // je nachangeklickter Taste unterschiedliche Dinge tun
        switch (angeklicktesZeichen) {
            case "ENTF":
                //das letzte Zeichen aus dem eingabefeld entfernen
                eingabefeld.value = eingabefeld.value.trimEnd().slice(0, -1).trimEnd();
                aktuelleEingabe = eingabefeld.value;
                break;

            case "AC":
                //das gesamte eingabefeld leeren
                eingabefeld.value = "";
                aktuelleEingabe = "";
                
                break;

            case "=":
    // 1. Sichere dir die Rechnung, die jetzt gerade im Feld steht
    const rechnungWeg = eingabefeld.value;

    if (rechnungWeg) {
        try {
            // 2. Ergebnis berechnen (mit dem wichtigen Leerzeichen nach "return ")
            const ergebnis = new Function("return " + rechnungWeg.replaceAll(",", "."))();
            const formatiertesErgebnis = formatierer.format(ergebnis);
            
            // 3. Den alten Weg oben ins kleine Display schreiben
            rechenwegAnzeige.textContent = rechnungWeg;
            
            // 4. VERLAUF: Rechnung in die Liste eintragen
            verlaufListe.unshift(rechnungWeg + " = " + formatiertesErgebnis);
            
            // 5. VERLAUF: Die HTML-Box leeren und neu aufbauen
            taschenrechnerVerlauf.textContent = "";
            for (const eintrag of verlaufListe) {
                const eintragElement = document.createElement("p");
                eintragElement.textContent = eintrag;
                taschenrechnerVerlauf.appendChild(eintragElement);
            }

            // 6. Das Ergebnis ins Hauptfeld schreiben
            eingabefeld.value = formatiertesErgebnis;
            aktuelleEingabe = formatiertesErgebnis;
        } catch {
            rechenwegAnzeige.textContent = "Error";
        }
    }
    break;


           
          
           
               
         default:
        //3. das Zeichen der angeklickten Taste an die Eingabe anhängen 
        eingabefeld.value += angeklicktesZeichen;
        eingabefeld.value = eingabefeld.value.replaceAll(LEERZEICHEN_ERFORDERLICH_REGEX,"$1 $2 ");
        //4. Wert der aktuellenEingabe-Variablen aktualisieren
        aktuelleEingabe = eingabefeld.value;
         break;   
    }
    });
}

eingabefeld.addEventListener("input", function(ereignis){
    if (GUELTIGE_EINGABE_REGEX.test(eingabefeld.value)){
        aktuelleEingabe = eingabefeld.value;
}else{
    eingabefeld.value = aktuelleEingabe;
}

});

eingabefeld.addEventListener("keydown", function(ereignis){
    if(ereignis.key === "Enter"){
        rechnenButton.click();

    }
});





