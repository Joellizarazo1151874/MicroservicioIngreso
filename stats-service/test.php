<?php
// Archivo de prueba para verificar que el microservicio de estadísticas está funcionando correctamente
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Incluir archivos necesarios
require_once 'db.php';
require_once 'statistics.php';

// Verificar la conexión a la base de datos
$database = new Database();
$conn = $database->getConnection();

$response = [
    'status' => 'success',
    'message' => 'El microservicio de estadísticas está funcionando correctamente',
    'database_connection' => ($conn ? 'OK' : 'ERROR'),
    'php_version' => PHP_VERSION,
    'server_info' => $_SERVER['SERVER_SOFTWARE'],
    'timestamp' => date('Y-m-d H:i:s')
];

// Verificar si podemos instanciar la clase Statistics
try {
    $stats = new Statistics();
    $response['statistics_class'] = 'OK';
} catch (Exception $e) {
    $response['statistics_class'] = 'ERROR: ' . $e->getMessage();
}

// Mostrar la respuesta
echo json_encode($response);
