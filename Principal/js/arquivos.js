import { db } from "./firebase.js";
import { ref, set, get, child } 
  from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Salva o conteúdo do arquivo no Realtime Database
export async function salvarArquivo(nomeArquivo, conteudo) {
  if (!nomeArquivo) {
    alert("Nenhum arquivo selecionado para salvar.");
    return;
  }

  try {
    await set(ref(db, "arquivos/" + nomeArquivo), {
      conteudo: conteudo,
      data: new Date().toISOString()
    });
    console.log("Arquivo salvo com sucesso no Firebase!");
    alert("Arquivo salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
    alert("Erro ao salvar o arquivo.");
  }
}

// Lê o conteúdo de um arquivo do Realtime Database
export async function lerArquivo(nomeArquivo) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "arquivos/" + nomeArquivo));
    if (snapshot.exists()) {
      console.log("Arquivo lido do Firebase:", nomeArquivo);
      return snapshot.val().conteudo;
    } else {
      alert("Arquivo não encontrado!");
      return "";
    }
  } catch (error) {
    console.error("Erro ao ler arquivo:", error);
    return "";
  }
}
