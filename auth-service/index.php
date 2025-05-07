<?php
// Agregar logs para depuración
error_log("Request URI: " . $_SERVER['REQUEST_URI']);
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar solicitudes OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir archivos necesarios
require_once 'user.php';
require_once 'jwt.php';

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Registrar información para depuración
error_log("Path: " . $path);
error_log("Segments: " . implode(", ", $segments));

// Encontrar el índice del segmento 'auth' para determinar el endpoint adecuadamente
$auth_index = array_search('auth', $segments);
$endpoint = '';

// Si se encontró 'auth' en la URL
if ($auth_index !== false && isset($segments[$auth_index + 1])) {
    $endpoint = $segments[$auth_index + 1];
    error_log("Found 'auth' at index $auth_index, endpoint set to: " . $endpoint);
} else {
    // Comportamiento anterior si no se encuentra 'auth'
    $endpoint = end($segments);
    error_log("No 'auth' segment found, fallback to last segment: " . $endpoint);
}

// Detectar ID de usuario en URL del tipo /auth/users/{id}
$user_id = null;
if ($endpoint === 'users' && isset($segments[$auth_index + 2])) {
    $user_id = $segments[$auth_index + 2];
    error_log("User ID in URL detected: " . $user_id);
} 
// Para compatibilidad con el código anterior
elseif (count($segments) > 2 && $segments[count($segments) - 2] === 'users') {
    $user_id = $endpoint;
    $endpoint = 'users';
    error_log("Legacy URL pattern: User ID detected: " . $user_id . ", Endpoint changed to: " . $endpoint);
}

// Procesar según el método y endpoint
$method = $_SERVER['REQUEST_METHOD'];

// Instancias de clases
$user = new User();
$jwt = new JWT();

// Respuesta predeterminada
$response = [
    'status' => 'error',
    'message' => 'Endpoint no válido'
];

// Ruta para login
if ($method === 'POST' && $endpoint === 'login') {
    // Obtener datos del body
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validar datos requeridos
    if (!isset($data['usuario']) || !isset($data['password'])) {
        $response = [
            'status' => 'error',
            'message' => 'Usuario y contraseña son requeridos'
        ];
    } else {
        // Intentar login
        $user_data = $user->login($data['usuario'], $data['password']);
        
        if ($user_data) {
            // Generar token
            $token = $jwt->generate([
                'id' => $user_data['id'],
                'usuario' => $user_data['usuario'],
                'nivel' => $user_data['nivel']
            ]);
            
            $response = [
                'status' => 'success',
                'message' => 'Login exitoso',
                'token' => $token,
                'user' => [
                    'id' => $user_data['id'],
                    'usuario' => $user_data['usuario'],
                    'nivel' => $user_data['nivel']
                ]
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Credenciales inválidas'
            ];
        }
    }
}

// Ruta para validar token
elseif ($method === 'GET' && $endpoint === 'validate') {
    // Obtener el token del header
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $response = [
            'status' => 'error',
            'message' => 'Token no proporcionado'
        ];
    } else {
        $token = $matches[1];
        $user_data = $jwt->validate($token);
        
        if ($user_data) {
            $response = [
                'status' => 'success',
                'message' => 'Token válido',
                'user' => $user_data
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Token inválido o expirado'
            ];
        }
    }
}

// Ruta para logout (simplemente invalida el token en el cliente)
elseif ($method === 'POST' && $endpoint === 'logout') {
    $response = [
        'status' => 'success',
        'message' => 'Sesión cerrada exitosamente'
    ];
}

// === NUEVOS ENDPOINTS PARA GESTIÓN DE USUARIOS ===

// Obtener todos los usuarios (solo para admin)
elseif ($method === 'GET' && $endpoint === 'users') {
    // Obtener el token del header para verificar permisos
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $response = [
            'status' => 'error',
            'message' => 'Token no proporcionado'
        ];
    } else {
        $token = $matches[1];
        $user_data = $jwt->validate($token);
        
        // Verificar que sea un administrador
        if ($user_data && $user_data['nivel'] === 'admin') {
            $users = $user->getAllUsers();
            $response = [
                'status' => 'success',
                'users' => $users
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No tiene permisos para acceder a esta información'
            ];
        }
    }
}

// Crear un nuevo usuario (solo para admin)
elseif ($method === 'POST' && $endpoint === 'users') {
    // Obtener el token del header para verificar permisos
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $response = [
            'status' => 'error',
            'message' => 'Token no proporcionado'
        ];
    } else {
        $token = $matches[1];
        $user_data = $jwt->validate($token);
        
        // Verificar que sea un administrador
        if ($user_data && $user_data['nivel'] === 'admin') {
            // Obtener datos del body
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar datos requeridos
            if (!isset($data['usuario']) || !isset($data['password']) || !isset($data['nivel'])) {
                $response = [
                    'status' => 'error',
                    'message' => 'Usuario, contraseña y nivel son requeridos'
                ];
            } else {
                // Crear usuario
                $result = $user->createUser($data['usuario'], $data['password'], $data['nivel']);
                
                if ($result['success']) {
                    $response = [
                        'status' => 'success',
                        'message' => $result['message'],
                        'id' => $result['id']
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => $result['message']
                    ];
                }
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No tiene permisos para crear usuarios'
            ];
        }
    }
}

// Actualizar un usuario existente (solo para admin)
elseif ($method === 'PUT' && $endpoint === 'users' && $user_id) {
    // Obtener el token del header para verificar permisos
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $response = [
            'status' => 'error',
            'message' => 'Token no proporcionado'
        ];
    } else {
        $token = $matches[1];
        $user_data = $jwt->validate($token);
        
        // Verificar que sea un administrador
        if ($user_data && $user_data['nivel'] === 'admin') {
            // Obtener datos del body
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar datos requeridos
            if (!isset($data['usuario']) || !isset($data['nivel'])) {
                $response = [
                    'status' => 'error',
                    'message' => 'Usuario y nivel son requeridos'
                ];
            } else {
                // Actualizar usuario
                $result = $user->updateUser(
                    $user_id, 
                    $data['usuario'], 
                    isset($data['password']) ? $data['password'] : '', 
                    $data['nivel']
                );
                
                if ($result['success']) {
                    $response = [
                        'status' => 'success',
                        'message' => $result['message']
                    ];
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => $result['message']
                    ];
                }
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No tiene permisos para actualizar usuarios'
            ];
        }
    }
}

// Eliminar un usuario (solo para admin)
elseif ($method === 'DELETE' && $endpoint === 'users' && $user_id) {
    // Obtener el token del header para verificar permisos
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        $response = [
            'status' => 'error',
            'message' => 'Token no proporcionado'
        ];
    } else {
        $token = $matches[1];
        $user_data = $jwt->validate($token);
        
        // Verificar que sea un administrador
        if ($user_data && $user_data['nivel'] === 'admin') {
            // Eliminar usuario
            $result = $user->deleteUser($user_id);
            
            if ($result['success']) {
                $response = [
                    'status' => 'success',
                    'message' => $result['message']
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => $result['message']
                ];
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No tiene permisos para eliminar usuarios'
            ];
        }
    }
}

// Enviar respuesta
echo json_encode($response); 