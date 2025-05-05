<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir archivos necesarios
require_once 'computo.php';
require_once 'jwt.php';

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Obtener el endpoint (última parte de la URL)
$endpoint = end($segments);

// Procesar según el método y endpoint
$method = $_SERVER['REQUEST_METHOD'];

// Instancias de clases
$computo = new Computo();
$jwt = new JWT();

// Verificar autenticación
function verifyToken() {
    global $jwt;
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        return false;
    }
    
    $token = $matches[1];
    return $jwt->validate($token);
}

// Respuesta predeterminada
$response = [
    'status' => 'error',
    'message' => 'Endpoint no válido'
];

// Ruta para buscar estudiante por código
if ($method === 'GET' && $endpoint === 'student') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Validar parámetros requeridos
        if (!isset($_GET['code'])) {
            $response = [
                'status' => 'error',
                'message' => 'Código de estudiante es requerido'
            ];
        } else {
            // Obtener parámetros
            $code = $_GET['code'];
            
            // Buscar estudiante
            $student = $computo->findStudentByCode($code);
            
            if ($student) {
                $response = [
                    'status' => 'success',
                    'message' => 'Estudiante encontrado',
                    'student' => [
                        'nombre' => $student['firstname'] . ' ' . $student['surname'],
                        'correo' => $student['email'],
                        'codigo' => $student['cardnumber'],
                        'programa' => isset($student['programa']) ? $student['programa'] : ($student['sort2'] ?? ''),
                        'facultad' => isset($student['facultad']) ? $student['facultad'] : ($student['sort1'] ?? '')
                    ]
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Estudiante no encontrado'
                ];
            }
        }
    }
}

// Ruta para obtener equipos disponibles
elseif ($method === 'GET' && $endpoint === 'equipos-disponibles') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener equipos disponibles
        $equipos = $computo->getAvailableEquipos();
        
        $response = [
            'status' => 'success',
            'message' => 'Equipos disponibles',
            'equipos' => $equipos
        ];
    }
}

// Ruta para obtener todos los equipos
elseif ($method === 'GET' && $endpoint === 'equipos') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener todos los equipos
        $equipos = $computo->getAllEquipos();
        
        $response = [
            'status' => 'success',
            'message' => 'Todos los equipos',
            'equipos' => $equipos
        ];
    }
}

// Ruta para registrar entrada de equipo
elseif ($method === 'POST' && $endpoint === 'register') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener datos del body
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar datos requeridos
        if (!isset($data['nombre']) || !isset($data['codigo']) || !isset($data['equipo'])) {
            $response = [
                'status' => 'error',
                'message' => 'Nombre, código y equipo son requeridos'
            ];
        } else {
            // Registrar entrada
            $id = $computo->registerEntryEquipo($data);
            
            if ($id) {
                $response = [
                    'status' => 'success',
                    'message' => 'Entrada de equipo registrada exitosamente',
                    'id' => $id
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al registrar la entrada de equipo'
                ];
            }
        }
    }
}

// Ruta para registrar salida de equipo
elseif ($method === 'POST' && $endpoint === 'exit') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener datos del body
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar ID
        if (!isset($data['id'])) {
            $response = [
                'status' => 'error',
                'message' => 'ID es requerido'
            ];
        } else {
            // Registrar salida
            $result = $computo->registerExitEquipo($data['id']);
            
            if ($result) {
                $response = [
                    'status' => 'success',
                    'message' => 'Salida de equipo registrada exitosamente'
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al registrar la salida de equipo'
                ];
            }
        }
    }
}

// Ruta para obtener entradas activas de equipos
elseif ($method === 'GET' && $endpoint === 'active') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener entradas activas
        $entries = $computo->getActiveEntriesEquipo();
        
        $response = [
            'status' => 'success',
            'message' => 'Entradas activas de equipos',
            'entries' => $entries
        ];
    }
}

// Ruta para obtener historial de registros
elseif ($method === 'GET' && $endpoint === 'history') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener parámetro limit (opcional)
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        
        // Obtener historial
        $history = $computo->getHistoryEquipo($limit);
        
        $response = [
            'status' => 'success',
            'message' => 'Historial de registros de equipos',
            'history' => $history
        ];
    }
}

// Enviar respuesta
echo json_encode($response);
?>
