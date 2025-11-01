<?php
if (isset($_POST['caminho']) && isset($_POST['conteudo'])) {
    $caminhoRelativo = $_POST['caminho']; // ex: ../data/files/file001.hex
    $conteudo = $_POST['conteudo'];

    // 1. Define o diretório permitido de forma absoluta e limpa
    $dirPermitido = realpath(__DIR__ . '/../data/files');

    // 2. Pega o NOME do arquivo que queremos criar
    $nomeArquivo = basename($caminhoRelativo);

    // 3. Pega o DIRETÓRIO onde queremos salvar
    $dirAlvoRelativo = dirname($caminhoRelativo);
    
    // 4. Converte o DIRETÓRIO ALVO para um caminho absoluto e limpo
    //    Isso funciona porque o diretório (../data/files) JÁ EXISTE
    $dirAlvoAbsoluto = realpath(__DIR__ . '/' . $dirAlvoRelativo);

    // 5. A VERIFICAÇÃO DE SEGURANÇA CORRETA:
    //    Verifica se o diretório alvo ABSOLUTO é IDÊNTICO
    //    ao diretório permitido ABSOLUTO.
    if ($dirAlvoAbsoluto === $dirPermitido && $nomeArquivo) {
        
        // 6. Se a verificação passar, cria o caminho final seguro
        $caminhoFinal = $dirAlvoAbsoluto . DIRECTORY_SEPARATOR . $nomeArquivo;

        // 7. Tenta salvar o arquivo
        if (file_put_contents($caminhoFinal, $conteudo) !== false) {
            echo "Arquivo salvo com sucesso!";
        } else {
            http_response_code(500);
            echo "Erro ao salvar o arquivo no caminho: " . $caminhoFinal;
        }
    } else {
        http_response_code(403);
        // Envia uma mensagem de depuração mais útil
        echo "Acesso negado. Caminho inválido. (Alvo: " . $dirAlvoAbsoluto . " | Permitido: " . $dirPermitido . ")";
    }
} else {
    http_response_code(400);
    echo "Parâmetros insuficientes.";
}
?>