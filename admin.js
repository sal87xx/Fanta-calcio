import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
getFirestore,
collection,
addDoc
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

}else{

alert("Password errata");

}

};


// SALVA PARTITA
window.salvaPartita = async function(){

let data =
document.getElementById("data").value;

let ora =
document.getElementById("ora").value;

let campo =
document.getElementById("campo").value;

let quota =
document.getElementById("quota").value;


await addDoc(collection(db,"partita"),{

nomePartita:"Fanta Calcetto",
data:data,
ora:ora,
campo:campo,
quota:quota

});


alert("Partita salvata!");

};
