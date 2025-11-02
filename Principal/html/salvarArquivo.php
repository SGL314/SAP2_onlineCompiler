<?php
if (isset($_POST['caminho']) && isset($_POST['conteudo'])) {
    $caminhoRelativo = $_POST['caminho']; 
    $conteudo = $_POST['conteudo'];

    $dirPermitido = realpath(__DIR__ . '/../data/files');
    $nomeArquivo = basename($caminhoRelativo);
    $dirAlvoRelativo = dirname($caminhoRelativo);
    $dirAlvoAbsoluto = realpath(__DIR__ . '/' . $dirAlvoRelativo);

    if ($dirAlvoAbsoluto === $dirPermitido && $nomeArquivo) {
        
        $caminhoFinal = $dirAlvoAbsoluto . DIRECTORY_SEPARATOR . $nomeArquivo;

        if (file_put_contents($caminhoFinal, $conteudo) !== false) {
            echo "Arquivo salvo com sucesso!";
        } else {
            http_response_code(500);
            echo "Erro ao salvar o arquivo no caminho: " . $caminhoFinal;
        }
    } else {
        http_response_code(403);
        echo "Acesso negado. Caminho inválido. (Alvo: " . $dirAlvoAbsoluto . " | Permitido: " . $dirPermitido . ")";
    }
} else {
    http_response_code(400);
    echo "Parâmetros insuficientes.";
}
?>