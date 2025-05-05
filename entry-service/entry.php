<?php
require_once 'db.php';

class Entry {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    // Buscar estudiante por código (cardnumber) en vista_borrowers
    public function findStudentByCode($code) {
        try {
            error_log("Ejecutando consulta para código: $code");
            
            // Vamos a listar las tablas primero para verificar que existen
            $tables_query = "SHOW TABLES";
            $tables_stmt = $this->conn->prepare($tables_query);
            $tables_stmt->execute();
            $tables = $tables_stmt->fetchAll(PDO::FETCH_COLUMN);
            error_log("Tablas disponibles: " . implode(', ', $tables));
            
            // Verificamos si la tabla vista_borrowers existe
            if (!in_array('vista_borrowers', $tables)) {
                error_log("\u00a1ERROR: La tabla vista_borrowers no existe!");
                return false;
            }
            
            // Intentamos buscar el estudiante
            $query = "SELECT * FROM vista_borrowers WHERE cardnumber = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$code]);
            
            $rows = $stmt->rowCount();
            error_log("Filas encontradas: $rows");
            
            if ($rows > 0) {
                $student = $stmt->fetch();
                error_log("Datos del estudiante: " . json_encode($student));
                return $student;
            }
            
            // Si no encontramos nada, intentamos con LIKE por si acaso
            $query = "SELECT * FROM vista_borrowers WHERE cardnumber LIKE ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute(["%$code%"]);
            
            $rows = $stmt->rowCount();
            error_log("Filas encontradas con LIKE: $rows");
            
            if ($rows > 0) {
                return $stmt->fetch();
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Error en findStudentByCode: " . $e->getMessage());
            return false;
        }
    }
    
    // Registrar una nueva entrada
    public function registerEntry($data) {
        try {
            $query = "INSERT INTO becl_registro (nombre, correo, codigo, programa, facultad, entrada, sede) 
                      VALUES (?, ?, ?, ?, ?, NOW(), ?)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['nombre'],
                $data['correo'],
                $data['codigo'] ?? null,
                $data['programa'] ?? null,
                $data['facultad'] ?? null,
                $data['sede']
            ]);
            
            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Registrar la salida de un estudiante
    public function registerExit($id) {
        try {
            $query = "UPDATE becl_registro SET salida = NOW() WHERE id = ? AND salida IS NULL";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Obtener todas las entradas activas (sin salida)
    public function getActiveEntries($sede = null) {
        try {
            $query = "SELECT * FROM becl_registro WHERE salida IS NULL";
            $params = [];
            
            if ($sede) {
                $query .= " AND sede = ?";
                $params[] = $sede;
            }
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Obtener todas las entradas filtradas por fecha
    public function getEntriesByDate($fecha_inicio, $fecha_fin, $sede = null) {
        try {
            $query = "SELECT * FROM becl_registro WHERE entrada BETWEEN ? AND ?";
            $params = [$fecha_inicio, $fecha_fin];
            
            if ($sede) {
                $query .= " AND sede = ?";
                $params[] = $sede;
            }
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
    
    // Buscar entrada por correo o código
    public function searchEntry($search) {
        try {
            $query = "SELECT * FROM becl_registro WHERE correo LIKE ? OR codigo LIKE ? ORDER BY entrada DESC";
            $stmt = $this->conn->prepare($query);
            $search_term = "%{$search}%";
            $stmt->execute([$search_term, $search_term]);
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    }
} 