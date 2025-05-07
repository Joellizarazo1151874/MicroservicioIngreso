<?php
// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Si es una solicitud OPTIONS, responder inmediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir archivos necesarios
require_once '../jwt.php';
require_once '../statistics.php';
require_once '../statistics_extension.php';
require_once '../excel_export.php';

// Verificar el token JWT
$jwt = new JWT();
$headers = getallheaders();
$token = null;

if (isset($headers['Authorization'])) {
    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'No se proporcionó token de autenticación']);
    exit;
}

$userData = $jwt->validate($token);

if (!$userData) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token inválido o expirado']);
    exit;
}

// Verificar si el usuario es administrador
if ($userData['nivel'] !== 'admin' && $userData['nivel'] !== 'administrativo' && $userData['nivel'] !== 'entrada') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado. Se requieren permisos de administrador o administrativo']);
    exit;
}

// Obtener la ruta de la solicitud
$request_uri = $_SERVER['REQUEST_URI'];

// Detectar la ruta base de forma más robusta
$uri_parts = explode('?', $request_uri);
$request_path = $uri_parts[0];

// Extraer la parte final de la ruta (después del último /)
$path_parts = explode('/', trim($request_path, '/'));
$endpoint = end($path_parts);

// Determinar la ruta completa
if (strpos($request_path, 'estadisticas/programas') !== false) {
    $path = '/estadisticas/programas';
} elseif (strpos($request_path, 'estadisticas/mensual') !== false) {
    $path = '/estadisticas/mensual';
} elseif (strpos($request_path, 'estadisticas/semanal') !== false) {
    $path = '/estadisticas/semanal';
} elseif (strpos($request_path, 'reportes/excel') !== false) {
    $path = '/reportes/excel';
} elseif (strpos($request_path, 'programas') !== false) {
    $path = '/programas';
} else {
    $path = '/' . $endpoint;
}

// Instanciar el servicio de estadísticas
$statistics = new Statistics();
$statsExtension = new StatisticsExtension();

// Procesar la solicitud según la ruta
switch ($path) {
    case '/programas':
        // Obtener lista de programas académicos
        $result = $statistics->getAllPrograms();
        
        echo json_encode($result);
        break;
        
    case '/estadisticas/programas':
        // Obtener parámetros
        $sede = $_GET['sede'] ?? null;
        $fechaInicio = $_GET['fechaInicio'] ?? null;
        $fechaFin = $_GET['fechaFin'] ?? null;
        $programa = $_GET['programa'] ?? null;
        
        // Obtener estadísticas por programa
        $result = $statistics->getStatsByProgram($sede, $fechaInicio, $fechaFin, $programa);
        
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
        break;
        
    case '/estadisticas/mensual':
        // Obtener parámetros
        $year = $_GET['year'] ?? null;
        $sede = $_GET['sede'] ?? null;
        
        // Obtener estadísticas mensuales
        $result = $statistics->getMonthlyStats($year, $sede);
        
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
        break;
        
    case '/estadisticas/semanal':
        // Obtener parámetros
        $fechaInicio = $_GET['fechaInicio'] ?? null;
        $fechaFin = $_GET['fechaFin'] ?? null;
        $sede = $_GET['sede'] ?? null;
        
        // Obtener estadísticas semanales
        $result = $statistics->getWeeklyStats($fechaInicio, $fechaFin, $sede);
        
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
        break;
        
    case '/reportes/excel':
        // Obtener parámetros
        $tipo = $_GET['tipo'] ?? 'completo';
        $params = [
            'sede' => $_GET['sede'] ?? null,
            'fechaInicio' => $_GET['fechaInicio'] ?? null,
            'fechaFin' => $_GET['fechaFin'] ?? null,
            'year' => $_GET['year'] ?? null,
            'programa' => $_GET['programa'] ?? null
        ];
        
        // Obtener datos para exportar
        $exportData = $statistics->getExportData($tipo, $params);
        
        // Verificar si hay datos para exportar
        if (empty($exportData['data'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'No hay datos para exportar con los filtros seleccionados'
            ]);
            break;
        }
        
        try {
            // Instanciar el exportador de Excel
            $excelExport = new ExcelExport();
            
            // Generar el archivo Excel
            $filename = 'reporte_' . $tipo;
            $filePath = $excelExport->generateExcel($exportData, $filename);
            
            // Obtener el nombre del archivo (sin la ruta)
            $fileBasename = basename($filePath);
            
            // Generar la URL de descarga
            $downloadUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/microservicio/stats-service/download.php?file=' . $fileBasename;
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Archivo Excel generado correctamente',
                'file_url' => $downloadUrl,
                'filename' => $fileBasename
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al generar el archivo Excel: ' . $e->getMessage()
            ]);
        }
        break;
        
    case '/reportes/consultas':
        // Obtener parámetros
        $fechaInicio = $_GET['fechaInicio'] ?? null;
        $fechaFin = $_GET['fechaFin'] ?? null;
        $sede = $_GET['sede'] ?? null;
        $searchTerm = $_GET['searchTerm'] ?? null;
        $programa = $_GET['programa'] ?? null;
        
        // Obtener datos para exportar usando la instancia de StatisticsExtension
        $exportData = $statsExtension->getConsultasExportData($fechaInicio, $fechaFin, $sede, $searchTerm, $programa);
        
        // Verificar si hay datos para exportar
        if (empty($exportData['data'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'No hay datos para exportar con los filtros seleccionados'
            ]);
            break;
        }
        
        try {
            // Instanciar el exportador de Excel
            $excelExport = new ExcelExport();
            
            // Generar el archivo Excel
            $filename = 'reporte_consultas';
            $filePath = $excelExport->generateExcel($exportData, $filename);
            
            // Obtener el nombre del archivo (sin la ruta)
            $fileBasename = basename($filePath);
            
            // Generar la URL de descarga
            $downloadUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/microservicio/stats-service/download.php?file=' . $fileBasename;
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Archivo Excel generado correctamente',
                'file_url' => $downloadUrl,
                'filename' => $fileBasename
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al generar el archivo Excel: ' . $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Endpoint no encontrado']);
        break;
}
