<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir archivos necesarios
require_once 'entry.php';
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
$entry = new Entry();
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
    error_log("Solicitando estudiante con método: $method y endpoint: $endpoint");
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
            error_log("Buscando estudiante con código: $code");
            
            // Buscar estudiante
            $student = $entry->findStudentByCode($code);
            
            if ($student) {
                error_log("Estudiante encontrado: " . json_encode($student));
                $response = [
                    'status' => 'success',
                    'message' => 'Estudiante encontrado',
                    'student' => [
                        'nombre' => $student['firstname'] . ' ' . $student['surname'],
                        'correo' => $student['email'],
                        'codigo' => $student['cardnumber'],
                        'programa' => $student['carrera'] ?? '',
                        'facultad' => $student['departamento'] ?? ''
                    ]
                ];
            } else {
                error_log("Estudiante no encontrado para código: $code");
                $response = [
                    'status' => 'error',
                    'message' => 'Estudiante no encontrado'
                ];
            }
        }
    }
}

// Ruta para registrar entrada
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
        if (!isset($data['nombre']) || !isset($data['correo']) || !isset($data['sede'])) {
            $response = [
                'status' => 'error',
                'message' => 'Nombre, correo y sede son requeridos'
            ];
        } else {
            // Registrar entrada
            $id = $entry->registerEntry($data);
            
            if ($id) {
                $response = [
                    'status' => 'success',
                    'message' => 'Entrada registrada exitosamente',
                    'id' => $id
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al registrar la entrada'
                ];
            }
        }
    }
}

// Ruta para registrar salida
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
            $result = $entry->registerExit($data['id']);
            
            if ($result) {
                $response = [
                    'status' => 'success',
                    'message' => 'Salida registrada exitosamente'
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => 'Error al registrar la salida'
                ];
            }
        }
    }
}

// Ruta para obtener entradas activas
elseif ($method === 'GET' && $endpoint === 'active') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Obtener parámetro sede (opcional)
        $sede = isset($_GET['sede']) ? $_GET['sede'] : null;
        
        // Obtener entradas activas
        $entries = $entry->getActiveEntries($sede);
        
        $response = [
            'status' => 'success',
            'message' => 'Entradas activas',
            'entries' => $entries
        ];
    }
}

// Ruta para obtener entradas por fecha
elseif ($method === 'GET' && $endpoint === 'by-date') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Extraer parámetros de la URL
        $inicio = $_GET['inicio'] ?? null;
        $fin = $_GET['fin'] ?? null;
        $sede = $_GET['sede'] ?? null;
        $programa = $_GET['programa'] ?? null;
        
        if (!$inicio || !$fin) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Se requieren los parámetros de fecha inicio y fin'
            ]);
            exit;
        }
        
        try {
            // Buscar entradas por fecha
            $entries = $entry->getEntriesByDate($inicio, $fin, $sede, $programa);
            
            $response = [
                'status' => 'success',
                'entries' => $entries
            ];
        } catch (Exception $e) {
            $response = [
                'status' => 'error',
                'message' => 'Error al obtener entradas por fecha: ' . $e->getMessage()
            ];
        }
    }
}

// Ruta para buscar entradas
elseif ($method === 'GET' && $endpoint === 'search') {
    $user_data = verifyToken();
    
    if (!$user_data) {
        $response = [
            'status' => 'error',
            'message' => 'No autorizado'
        ];
    } else {
        // Validar parámetros requeridos
        if (!isset($_GET['q'])) {
            $response = [
                'status' => 'error',
                'message' => 'Término de búsqueda es requerido'
            ];
        } else {
            // Obtener parámetros
            $search = $_GET['q'];
            
            // Buscar entradas
            $entries = $entry->searchEntry($search);
            
            $response = [
                'status' => 'success',
                'message' => 'Resultados de búsqueda',
                'entries' => $entries
            ];
        }
    }
}

// Enviar respuesta
echo json_encode($response); 