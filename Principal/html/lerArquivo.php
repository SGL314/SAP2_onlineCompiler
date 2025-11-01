<?php
if (isset($_GET['caminho'])) {
    $caminho = $_GET['caminho'];

    // Segurança: sanitize o caminho
    $caminho = realpath($caminho);

    // Verifica se o arquivo existe e está dentro do diretório permitido
    $dirPermitido = realpath(__DIR__.'/../data/files/');
    
    // A VERIFICAÇÃO DE SEGURANÇA
    // Verifica se o caminho real do arquivo COMEÇA COM o caminho do diretório permitido
    if ($dirPermitido && strpos($caminho, $dirPermitido) === 0 && file_exists($caminho)) {
        // SUCESSO: O arquivo é válido e existe
        header('Content-Type: text/plain');
        readfile($caminho);
        exit; // Para a execução aqui
    } else {
        // FALHA: Arquivo não encontrado ou acesso negado
        
        // ### A CORREÇÃO ESTÁ AQUI ###
        // Define o código de erro ANTES de qualquer 'echo'.
        http_response_code(404); // 404 (Not Found) é mais preciso que 403
        echo "Arquivo não encontrado ou acesso negado.";
        exit; // Para a execução aqui
    }
} else {
    // FALHA: Parâmetro faltando
    http_response_code(400); // 400 (Bad Request)
    echo "Parâmetro 'caminho' não informado.";
    exit;
}
?>