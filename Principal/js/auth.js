// auth.js
import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

// Elementos HTML
const loginBtn = document.getElementById("loginGoogle");
const signOutBtn = document.getElementById("signOutBtn");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");
const signInButtons = document.getElementById("signInButtons");

// LOGIN COM GOOGLE
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      console.log("Tentando login com Google...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado:", user.displayName, user.email);

      userName.textContent = `Olá, ${user.displayName}`;
      userInfo.style.display = "block";
      signInButtons.style.display = "none";
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login: " + error.message);
    }
  });
}

// LOGOUT
if (signOutBtn) {
  signOutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado");
      userInfo.style.display = "none";
      signInButtons.style.display = "block";
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
}

// MONITORA ESTADO DE LOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário autenticado:", user.email);
    userName.textContent = `Olá, ${user.displayName}`;
    userInfo.style.display = "block";
    signInButtons.style.display = "none";

    // Opcional: restringe para contas institucionais
    if (!user.email.endsWith("@teiacoltec.org")) {
      alert("Acesso negado. Use um email institucional (@teiacoltec.org).");
      signOut(auth);
    }
  } else {
    console.log("Nenhum usuário logado");
    userInfo.style.display = "none";
    signInButtons.style.display = "block";
  }
});
