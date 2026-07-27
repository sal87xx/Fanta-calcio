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

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyAkD7WyZj7aq3YXBak6cLT8kKUAAvwbSUY",
  authDomain: "calcettoapp-b00eb.firebaseapp.com",
  projectId: "calcettoapp-b00eb"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);





// LOGIN

window.entra = async function(){

let email = document.getElementById("email").value;

let password = document.getElementById("password").value;


try{

await signInWithEmailAndPassword(
auth,
email,
password
);


document.getElementById("login").style.display="none";

document.getElementById("pannello").style.display="block";


caricaGiocatori();


}

catch(error){

console.log(error);

alert("❌ Login non riuscito");

}

};





// CONTROLLO SESSIONE

onAuthStateChanged(auth,(user)=>{

if(user){

document.getElementById("login").style.display="none";

document.getElementById("pannello").style.display="block";

caricaGiocatori();

}

});







// GIOCATORI

async function caricaGiocatori(){

const elenco = await getDocs(
query(
collection(db,"giocatori"),
orderBy("data")
)
);


let convocati=document.getElementById("convocati");

let attesa=document.getElementById("attesa");


if(!convocati || !attesa) return;


convocati.innerHTML="";

attesa.innerHTML="";



elenco.forEach((g)=>{


let dati=g.data();


let li=document.createElement("li");


li.innerHTML =
dati.nome +
` <button onclick="elimina('${g.id}')">❌</button>`;



if(dati.stato==="confermato"){

convocati.appendChild(li);

}else{

attesa.appendChild(li);

}


});


}






// ELIMINA

window.elimina = async function(id){

await deleteDoc(
doc(db,"giocatori",id)
);

caricaGiocatori();

};







// PARTITA ATTUALE

window.salvaPartita = async function(){


let dati={

nomePartita:"Fanta Calcetto",

data:document.getElementById("data").value,

ora:document.getElementById("ora").value,

campo:document.getElementById("campo").value,

quota:document.getElementById("quota").value

};



let elenco=await getDocs(
collection(db,"partita")
);



if(elenco.empty){

await addDoc(
collection(db,"partita"),
dati
);

}else{

await updateDoc(
doc(db,"partita",elenco.docs[0].id),
dati
);

}


alert("✅ Partita aggiornata");

};







// CALENDARIO

window.aggiungiCalendario = async function(){


let dati={

data:document.getElementById("calData").value,

ora:document.getElementById("calOra").value,

campo:document.getElementById("calCampo").value,

quota:document.getElementById("calQuota").value,

creata:new Date()

};



if(
dati.data==="" ||
dati.ora==="" ||
dati.campo===""
){

alert("Inserisci data, ora e campo");

return;

}



await addDoc(
collection(db,"calendario"),
dati
);


alert("✅ Partita aggiunta al calendario");


};
