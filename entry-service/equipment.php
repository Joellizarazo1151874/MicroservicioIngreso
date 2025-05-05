<?php
// Incluir configuración y conexión a la base de datos
require_once 'config.php';
require_once 'db.php';

// Inicializar conexión a la base de datos
$database = new Database();
$conn = $database->getConnection();

// Habilitar CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Si es una petición OPTIONS, terminar aquí (pre-flight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para obtener equipos disponibles (estado = 'libre')
function getAvailableEquipment() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM becl_equipo WHERE estado = 'libre'";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'equipos' => $equipos
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error al obtener equipos disponibles: ' . $e->getMessage()
        ];
    }
}

// Función para registrar entrada de equipo
function registerEquipmentEntry($data) {
    global $conn;
    
    try {
        // Iniciar transacción
        $conn->beginTransaction();
        
        // Verificar si el equipo está disponible
        $sqlCheck = "SELECT * FROM becl_equipo WHERE id = :equipo_id AND estado = 'libre'";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bindParam(':equipo_id', $data['equipo_id']);
        $stmtCheck->execute();
        
        if ($stmtCheck->rowCount() === 0) {
            $conn->rollBack();
            return [
                'success' => false,
                'message' => 'El equipo seleccionado no está disponible'
            ];
        }
        
        // Registrar entrada en becl_registro_computo
        $sqlInsert = "INSERT INTO becl_registro_computo (nombre, correo, codigo, programa, facultad, equipo_id, fecha_entrada) 
                      VALUES (:nombre, :correo, :codigo, :programa, :facultad, :equipo_id, NOW())";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bindParam(':nombre', $data['nombre']);
        $stmtInsert->bindParam(':correo', $data['correo']);
        $stmtInsert->bindParam(':codigo', $data['codigo']);
        $stmtInsert->bindParam(':programa', $data['programa']);
        $stmtInsert->bindParam(':facultad', $data['facultad']);
        $stmtInsert->bindParam(':equipo_id', $data['equipo_id']);
        $stmtInsert->execute();
        
        // Actualizar estado del equipo a 'ocupado'
        $sqlUpdate = "UPDATE becl_equipo SET estado = 'ocupado' WHERE id = :equipo_id";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bindParam(':equipo_id', $data['equipo_id']);
        $stmtUpdate->execute();
        
        // Confirmar transacción
        $conn->commit();
        
        return [
            'success' => true,
            'message' => 'Entrada registrada correctamente'
        ];
    } catch (PDOException $e) {
        // Revertir transacción en caso de error
        $conn->rollBack();
        
        return [
            'success' => false,
            'message' => 'Error al registrar entrada: ' . $e->getMessage()
        ];
    }
}

// Función para obtener entradas activas (sin fecha_salida)
function getActiveEntries() {
    global $conn;
    
    try {
        $sql = "SELECT r.*, e.nombre as equipo_nombre 
                FROM becl_registro_computo r 
                JOIN becl_equipo e ON r.equipo_id = e.id 
                WHERE r.fecha_salida IS NULL";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'entries' => $entries
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error al obtener entradas activas: ' . $e->getMessage()
        ];
    }
}

// Función para registrar salida de equipo
function registerEquipmentExit($id) {
    global $conn;
    
    try {
        // Iniciar transacción
        $conn->beginTransaction();
        
        // Verificar si la entrada existe y no tiene salida registrada
        $sqlCheck = "SELECT r.*, e.id as equipo_id 
                     FROM becl_registro_computo r 
                     JOIN becl_equipo e ON r.equipo_id = e.id 
                     WHERE r.id = :id AND r.fecha_salida IS NULL";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bindParam(':id', $id);
        $stmtCheck->execute();
        
        if ($stmtCheck->rowCount() === 0) {
            $conn->rollBack();
            return [
                'success' => false,
                'message' => 'No se encontró el registro o ya tiene salida registrada'
            ];
        }
        
        $registro = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        
        // Actualizar fecha de salida
        $sqlUpdate = "UPDATE becl_registro_computo SET fecha_salida = NOW() WHERE id = :id";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bindParam(':id', $id);
        $stmtUpdate->execute();
        
        // Actualizar estado del equipo a 'libre'
        $sqlUpdateEquipo = "UPDATE becl_equipo SET estado = 'libre' WHERE id = :equipo_id";
        $stmtUpdateEquipo = $conn->prepare($sqlUpdateEquipo);
        $stmtUpdateEquipo->bindParam(':equipo_id', $registro['equipo_id']);
        $stmtUpdateEquipo->execute();
        
        // Confirmar transacción
        $conn->commit();
        
        return [
            'success' => true,
            'message' => 'Salida registrada correctamente'
        ];
    } catch (PDOException $e) {
        // Revertir transacción en caso de error
        $conn->rollBack();
        
        return [
            'success' => false,
            'message' => 'Error al registrar salida: ' . $e->getMessage()
        ];
    }
}

// Procesar solicitudes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Procesar solicitudes GET
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    switch ($action) {
        case 'getAvailable':
            echo json_encode(getAvailableEquipment());
            break;
        
        case 'getActive':
            echo json_encode(getActiveEntries());
            break;
        
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Acción no válida'
            ]);
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Procesar solicitudes POST
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    switch ($action) {
        case 'registerEntry':
            // Validar datos requeridos
            if (
                isset($_POST['nombre']) && 
                isset($_POST['correo']) && 
                isset($_POST['codigo']) && 
                isset($_POST['programa']) && 
                isset($_POST['facultad']) && 
                isset($_POST['equipo_id'])
            ) {
                $data = [
                    'nombre' => $_POST['nombre'],
                    'correo' => $_POST['correo'],
                    'codigo' => $_POST['codigo'],
                    'programa' => $_POST['programa'],
                    'facultad' => $_POST['facultad'],
                    'equipo_id' => $_POST['equipo_id']
                ];
                
                echo json_encode(registerEquipmentEntry($data));
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Faltan datos requeridos'
                ]);
            }
            break;
        
        case 'registerExit':
            // Validar ID requerido
            if (isset($_POST['id'])) {
                echo json_encode(registerEquipmentExit($_POST['id']));
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Falta el ID del registro'
                ]);
            }
            break;
        
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Acción no válida'
            ]);
            break;
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
