import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAkD7WyZj7aq3YXBak6cLT8kKUAAvwbSUY",
  authDomain: "calcettoapp-b00eb.firebaseapp.com",
  projectId: "calcettoapp-b00eb",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const giocatori = collection(db,"giocatori");


// ISCRIZIONE
window.iscriviti = async function(){

  let nome = document.getElementById("nome").value.trim();

  if(nome === ""){
    alert("Inserisci il nome");
    return;
  }


  const elenco = await getDocs(giocatori);

  let confermati = 0;


  elenco.forEach((g)=>{
    if(g.data().stato === "confermato"){
      confermati++;
    }
  });


  let stato = confermati < 10 ? "confermato" : "attesa";


  await addDoc(giocatori,{
    nome:nome,
    stato:stato,
    data:new Date()
  });


  document.getElementById("nome").value="";


  mostraGiocatori();

};



// CANCELLA
window.cancella = async function(id){

  await deleteDoc(doc(db,"giocatori",id));

  await promuoviAttesa();

};



// PROMOZIONE LISTA ATTESA
async function promuoviAttesa(){

  const elenco = await getDocs(
    query(giocatori,orderBy("data"))
  );


  let confermati = 0;


  elenco.forEach((g)=>{

    if(g.data().stato==="confermato"){
      confermati++;
    }

  });


  for(let g of elenco.docs){

    if(confermati >= 10){
      break;
    }


    if(g.data().stato==="attesa"){

      await updateDoc(
        doc(db,"giocatori",g.id),
        {
          stato:"confermato"
        }
      );

      confermati++;

    }

  }


  mostraGiocatori();

};



// MOSTRA LISTE
async function mostraGiocatori(){

  const elenco = await getDocs(
    query(giocatori,orderBy("data"))
  );


  let convocati =
  document.getElementById("convocati");

  let attesa =
  document.getElementById("attesa");


  convocati.innerHTML="";
  attesa.innerHTML="";


  let confermati = 0;


  elenco.forEach((g)=>{

    let dati = g.data();

    let li = document.createElement("li");


    if(dati.stato==="confermato"){

      confermati++;

      li.innerHTML =
      "✅ " + dati.nome;

      convocati.appendChild(li);

    }else{

      li.innerHTML =
      "⏳ " + dati.nome;

      attesa.appendChild(li);

    }


    li.innerHTML +=
    ` <button onclick="cancella('${g.id}')">❌</button>`;

  });


  document.getElementById("posti").textContent =
  confermati + "/10";


  if(confermati >= 10){

    document.getElementById("infoCompleta").innerHTML =
    "⚽ Partita completa - Lista d'attesa aperta";

  }else{

    document.getElementById("infoCompleta").innerHTML =
    "";

  }

};



// CARICA PARTITA
async function caricaPartita(){

  const elenco = await getDocs(
    collection(db,"partita")
  );


  elenco.forEach((p)=>{

    let partita = p.data();


    document.getElementById("infoPartita").innerHTML =
    `
    <h3>⚽ ${partita.nomePartita || "Fanta Calcetto"}</h3>
    📅 ${partita.data || "-"}<br>
    🕘 ${partita.ora || "-"}<br>
    🏟️ ${partita.campo || "-"}<br>
    💰 Quota: ${partita.quota || "-"}
    `;

  });

};



// CONDIVIDI WHATSAPP
window.condividiWhatsApp = async function(){

  let nomePartita = "Fanta Calcetto";
  let data = "";
  let ora = "";
  let campo = "";
  let quota = "";

  let posti =
  document.getElementById("posti").textContent;


  const elenco = await getDocs(
    collection(db,"partita")
  );


  elenco.forEach((p)=>{

    let dati = p.data();

    nomePartita = dati.nomePartita || nomePartita;
    data = dati.data || "";
    ora = dati.ora || "";
    campo = dati.campo || "";
    quota = dati.quota || "";

  });



  let messaggio =
`⚽ ${nomePartita}

📅 Data: ${data}
🕘 Ora: ${ora}
🏟️ Campo: ${campo}
💰 Quota: ${quota}

👥 Posti occupati: ${posti}

Prenota qui:
${window.location.href}`;



  let url =
  "https://wa.me/?text=" +
  encodeURIComponent(messaggio);



  window.location.href = url;

};



// AVVIO
mostraGiocatori();
caricaPartita();