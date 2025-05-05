<?php
// Script para descargar archivos Excel
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Habilitar registro de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Modo de depuración (establecer en false en producción)
$debug = true;

// Función para mostrar errores en modo depuración
function debug_response($status, $message, $data = []) {
    global $debug;
    header('Content-Type: application/json');
    if ($status !== 'success') {
        if ($status === 'error') {
            header("HTTP/1.1 404 Not Found");
        } else {
            header("HTTP/1.1 400 Bad Request");
        }
    }
    
    $response = ['status' => $status, 'message' => $message];
    if ($debug && !empty($data)) {
        $response['debug'] = $data;
    }
    
    echo json_encode($response);
    exit;
}

// Obtener el nombre del archivo de la URL
$filename = isset($_GET['file']) ? $_GET['file'] : '';

// Verificar que el nombre del archivo sea válido y tenga extensión .xlsx
if (empty($filename)) {
    debug_response('invalid', 'Nombre de archivo no proporcionado');
}

// Permitir cualquier nombre de archivo Excel para pruebas
if (!preg_match('/\.xlsx$/', $filename)) {
    debug_response('invalid', 'El archivo debe tener extensión .xlsx');
}

// Ruta completa al archivo
$filePath = __DIR__ . '/exports/' . $filename;
$exportDir = __DIR__ . '/exports';

// Verificar que el directorio existe
if (!is_dir($exportDir)) {
    debug_response('error', 'El directorio de exportación no existe', [
        'export_dir' => $exportDir,
        'exists' => file_exists($exportDir),
        'is_dir' => is_dir($exportDir)
    ]);
}

// Listar archivos en el directorio para depuración
$files = scandir($exportDir);
$excelFiles = array_filter($files, function($file) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'xlsx';
});

// Verificar que el archivo exista
if (!file_exists($filePath)) {
    debug_response('error', 'Archivo no encontrado', [
        'requested_file' => $filename,
        'full_path' => $filePath,
        'exists' => file_exists($filePath),
        'is_readable' => is_readable($filePath),
        'available_files' => $excelFiles
    ]);
}

// Verificar que el archivo sea legible
if (!is_readable($filePath)) {
    debug_response('error', 'El archivo no es legible', [
        'file' => $filePath,
        'permissions' => substr(sprintf('%o', fileperms($filePath)), -4)
    ]);
}

// Si llegamos aquí, el archivo existe y es legible
// Configurar las cabeceras para la descarga
header('Content-Description: File Transfer');
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filePath));

// Limpiar el buffer de salida
ob_clean();
flush();

// Leer el archivo y enviarlo al cliente
readfile($filePath);
exit;
