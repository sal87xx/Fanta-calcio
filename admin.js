import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAkD7WyZj7aq3YXBak6cLT8kKUAAvwbSUY",
  authDomain: "calcettoapp-b00eb.firebaseapp.com",
  projectId: "calcettoapp-b00eb",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const passwordAdmin = "1234";



// LOGIN ADMIN
window.entra = function(){

let password =
document.getElementById("password").value;


if(password === passwordAdmin){

document.getElementById("login").style.display="none";

document.getElementById("pannello").style.display="block";

caricaGiocatori();


}else{

alert("Password errata");

}

};



// CARICA GIOCATORI
async function caricaGiocatori(){

const elenco = await getDocs(
query(
collection(db,"giocatori"),
orderBy("data")
)
);


let convocati =
document.getElementById("convocati");

let attesa =
document.getElementById("attesa");


convocati.innerHTML="";
attesa.innerHTML="";


elenco.forEach((g)=>{


let dati = g.data();


let li = document.createElement("li");


li.innerHTML =
`
${dati.nome}
<button onclick="elimina('${g.id}')">
❌
</button>
`;


if(dati.stato==="confermato"){

convocati.appendChild(li);

}else{

attesa.appendChild(li);

}


});


}



// ELIMINA GIOCATORE
window.elimina = async function(id){

await deleteDoc(
doc(db,"giocatori",id)
);


caricaGiocatori();

};



// SALVA O AGGIORNA PARTITA
window.salvaPartita = async function(){


let dati = {

nomePartita:"Fanta Calcetto",

data:
document.getElementById("data").value,

ora:
document.getElementById("ora").value,

campo:
document.getElementById("campo").value,

quota:
document.getElementById("quota").value

};



const elenco = await getDocs(
collection(db,"partita")
);



if(elenco.empty){


await addDoc(
collection(db,"partita"),
dati
);


}else{


let idPartita =
elenco.docs[0].id;


await updateDoc(
doc(db,"partita",idPartita),
dati
);


}


alert("✅ Partita aggiornata!");

};
