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



const giocatori = collection(db,"giocatori");





// LOGIN ADMIN

window.entra = async function(){


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;



try{


await signInWithEmailAndPassword(
auth,
email,
password
);


mostraAdmin();


}

catch(error){

console.log(error);

alert("❌ Email o password errati");

}


};






onAuthStateChanged(auth,(user)=>{


if(user){

mostraAdmin();

}


});






function mostraAdmin(){


document.getElementById("login").style.display="none";


document.getElementById("pannello").style.display="block";


caricaGiocatori();


}







// CARICA GIOCATORI

async function caricaGiocatori(){


const elenco = await getDocs(
query(
giocatori,
orderBy("data")
)
);



const convocati =
document.getElementById("convocati");


const attesa =
document.getElementById("attesa");



if(!convocati || !attesa)
return;



convocati.innerHTML="";

attesa.innerHTML="";



elenco.forEach((g)=>{


let dati=g.data();


let li=document.createElement("li");


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







// SALVA PARTITA ATTUALE

window.salvaPartita = async function(){


const partita = {


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



const elenco =
await getDocs(
collection(db,"partita")
);



if(elenco.empty){


await addDoc(
collection(db,"partita"),
partita
);


}else{


await updateDoc(
doc(db,"partita",elenco.docs[0].id),
partita
);


}



alert("✅ Partita aggiornata");


};







// AGGIUNGI AL CALENDARIO

window.aggiungiCalendario = async function(){



const nuova = {


data:
document.getElementById("calData").value,


ora:
document.getElementById("calOra").value,


campo:
document.getElementById("calCampo").value,


quota:
document.getElementById("calQuota").value,


creata:
new Date()


};




if(
nuova.data==="" ||
nuova.ora==="" ||
nuova.campo===""
){


alert("⚠️ Inserisci data, ora e campo");

return;

}



await addDoc(
collection(db,"calendario"),
nuova
);



alert("✅ Partita aggiunta al calendario");


};
