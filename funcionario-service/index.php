<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar solicitudes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'funcionario.php';

// Verificar token JWT
function validateToken() {
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return false;
    }
    
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    $token = str_replace('Bearer ', '', $authHeader);
    
    // Aquí se debería validar el token JWT
    // Por simplicidad, solo verificamos que exista
    if (empty($token)) {
        return false;
    }
    
    return true;
}

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener la acción desde los parámetros de consulta
$action = isset($_GET['action']) ? $_GET['action'] : '';
$codigo = isset($_GET['codigo']) ? $_GET['codigo'] : null;

$input = json_decode(file_get_contents('php://input'), true);

// Inicializar el objeto Funcionario
$funcionario = new Funcionario();

// Durante el desarrollo, desactivamos temporalmente la validación estricta del token
// para facilitar las pruebas
// Comentamos esta validación para permitir el acceso sin token durante el desarrollo
/*
if ($method !== 'OPTIONS' && !validateToken()) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token no válido o no proporcionado']);
    exit;
}
*/

// Manejar las rutas basadas en parámetros de consulta
switch ($method) {
    case 'GET':
        if ($action === 'funcionarios') {
            if ($codigo) {
                // GET index.php?action=funcionarios&codigo=XXX - Obtener un funcionario específico
                $result = $funcionario->getFuncionarioByCode($codigo);
            } else {
                // GET index.php?action=funcionarios - Obtener todos los funcionarios
                $result = $funcionario->getAllFuncionarios();
            }
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Acción no encontrada']);
        }
        break;
        
    case 'POST':
        if ($action === 'funcionarios/foto') {
            // POST index.php?action=funcionarios/foto - Guardar foto de funcionario
            if (isset($input['codigo']) && isset($input['foto'])) {
                $result = $funcionario->saveFuncionarioFoto($input['codigo'], $input['foto']);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Acción no encontrada']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        break;
}
?>