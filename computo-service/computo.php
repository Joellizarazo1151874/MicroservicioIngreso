<?php
require_once 'db.php';
require_once 'cross_db.php';

class Computo {
    private $conn;       // Conexión a la base de datos de cómputo
    private $cross_db;   // Objeto para manejar conexiones cruzadas entre bases de datos
    
    public function __construct() {
        // Inicializar la conexión principal a la base de datos de cómputo
        $database = new Database();
        $this->conn = $database->getConnection();
        
        // Inicializar el objeto para manejar conexiones cruzadas
        $this->cross_db = new CrossDBConnection();
    }
    
    // Buscar estudiante por código (cardnumber) en vista_borrowers con información de facultad y programa
    public function findStudentByCode($code) {
        try {
            // Usar la conexión cruzada para buscar estudiantes en la base de datos original
            $student = $this->cross_db->findStudentByCode($code);
            
            // Registrar el resultado en el log para depuración
            if ($student) {
                error_log("Estudiante encontrado en la base de datos original: " . $student['firstname'] . ' ' . $student['surname']);
            } else {
                error_log("No se encontró el estudiante con código: $code en la base de datos original");
            }
            
            return $student;
        } catch (PDOException $e) {
            error_log("Error en findStudentByCode: " . $e->getMessage());
            return false;
        }
    }
    
    // Obtener equipos disponibles (estado = 'libre')
    public function getAvailableEquipos() {
        try {
            $query = "SELECT * FROM becl_equipo WHERE estado = 'libre' ORDER BY equipo ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getAvailableEquipos: " . $e->getMessage());
            return [];
        }
    }
    
    // Obtener todos los equipos
    public function getAllEquipos() {
        try {
            $query = "SELECT * FROM becl_equipo ORDER BY equipo ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getAllEquipos: " . $e->getMessage());
            return [];
        }
    }
    
    // Registrar entrada de equipo
    public function registerEntryEquipo($data) {
        try {
            // Iniciar transacción
            $this->conn->beginTransaction();
            
            // 1. Registrar en becl_registro_computo
            $query = "INSERT INTO becl_registro_computo (nombre, correo, codigo, programa, facultad, entrada, equipo) 
                      VALUES (?, ?, ?, ?, ?, NOW(), ?)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['nombre'],
                $data['correo'],
                $data['codigo'] ?? null,
                $data['programa'] ?? null,
                $data['facultad'] ?? null,
                $data['equipo']
            ]);
            
            $registro_id = $this->conn->lastInsertId();
            
            // 2. Actualizar estado del equipo a 'ocupado'
            $query = "UPDATE becl_equipo SET estado = 'ocupado' WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$data['equipo']]);
            
            // Confirmar transacción
            $this->conn->commit();
            
            return $registro_id;
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            $this->conn->rollBack();
            error_log("Error en registerEntryEquipo: " . $e->getMessage());
            return false;
        }
    }
    
    // Registrar salida de equipo
    public function registerExitEquipo($id) {
        try {
            // Iniciar transacción
            $this->conn->beginTransaction();
            
            // 1. Obtener el ID del equipo
            $query = "SELECT equipo FROM becl_registro_computo WHERE id = ? AND salida IS NULL";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() == 0) {
                // No se encontró registro o ya tiene salida
                $this->conn->rollBack();
                return false;
            }
            
            $equipo_id = $stmt->fetch(PDO::FETCH_ASSOC)['equipo'];
            
            // 2. Registrar salida
            $query = "UPDATE becl_registro_computo SET salida = NOW() WHERE id = ? AND salida IS NULL";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            // 3. Actualizar estado del equipo a 'libre'
            $query = "UPDATE becl_equipo SET estado = 'libre' WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$equipo_id]);
            
            // Confirmar transacción
            $this->conn->commit();
            
            return true;
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            $this->conn->rollBack();
            error_log("Error en registerExitEquipo: " . $e->getMessage());
            return false;
        }
    }
    
    // Obtener entradas activas de equipos (sin salida)
    public function getActiveEntriesEquipo() {
        try {
            $query = "SELECT r.*, e.equipo as numero_equipo 
                      FROM becl_registro_computo r 
                      JOIN becl_equipo e ON r.equipo = e.id 
                      WHERE r.salida IS NULL 
                      ORDER BY r.entrada DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getActiveEntriesEquipo: " . $e->getMessage());
            return [];
        }
    }
    
    // Obtener historial de registros
    public function getHistoryEquipo($limit = 50) {
        try {
            $query = "SELECT r.*, e.equipo as numero_equipo 
                      FROM becl_registro_computo r 
                      JOIN becl_equipo e ON r.equipo = e.id 
                      ORDER BY r.entrada DESC 
                      LIMIT ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$limit]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getHistoryEquipo: " . $e->getMessage());
            return [];
        }
    }
}
?>
