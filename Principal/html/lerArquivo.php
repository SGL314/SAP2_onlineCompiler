<?php
if (isset($_GET['caminho'])) {
    $caminho = $_GET['caminho'];
    $caminho = realpath($caminho);
    $dirPermitido = realpath(__DIR__.'/../data/files/');

    if ($dirPermitido && strpos($caminho, $dirPermitido) === 0 && file_exists($caminho)) {
        header('Content-Type: text/plain');
        readfile($caminho);
        exit; 
    } else {

        http_response_code(404); 
        echo "Arquivo não encontrado ou acesso negado.";
        exit; 
    }
} else {
    http_response_code(400); 
    echo "Parâmetro 'caminho' não informado.";
    exit;
}
?>