<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir archivos necesarios
require_once 'user.php';
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

// Enviar respuesta
echo json_encode($response); 