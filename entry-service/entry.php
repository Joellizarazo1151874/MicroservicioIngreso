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
            
            // Consulta para verificar el código con información más detallada
            $query = "SELECT vista_borrowers.cardnumber, vista_borrowers.surname, vista_borrowers.firstname, vista_borrowers.email, 
                      S.lib AS carrera, vista_authorised_values.lib AS departamento 
                      FROM vista_borrowers 
                      LEFT JOIN vista_authorised_values S ON vista_borrowers.sort2 = S.authorised_value 
                      LEFT JOIN vista_authorised_values ON vista_borrowers.sort1 = vista_authorised_values.authorised_value 
                      WHERE vista_borrowers.cardnumber = ?";
            
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
            $query = "SELECT vista_borrowers.cardnumber, vista_borrowers.surname, vista_borrowers.firstname, vista_borrowers.email, 
                      S.lib AS carrera, vista_authorised_values.lib AS departamento 
                      FROM vista_borrowers 
                      LEFT JOIN vista_authorised_values S ON vista_borrowers.sort2 = S.authorised_value 
                      LEFT JOIN vista_authorised_values ON vista_borrowers.sort1 = vista_authorised_values.authorised_value 
                      WHERE vista_borrowers.cardnumber LIKE ?";
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
    
    // Obtener entradas por rango de fechas
    public function getEntriesByDate($fechaInicio, $fechaFin, $sede = null, $programa = null) {
        try {
            // Construir la consulta base
            $query = "SELECT * FROM becl_registro WHERE DATE(entrada) BETWEEN :inicio AND :fin";
            $params = [
                ':inicio' => $fechaInicio,
                ':fin' => $fechaFin
            ];
            
            // Filtrar por sede si se especifica
            if ($sede) {
                $query .= " AND sede = :sede";
                $params[':sede'] = $sede;
            }
            
            // Filtrar por programa si se especifica
            if ($programa) {
                $query .= " AND programa = :programa";
                $params[':programa'] = $programa;
            }
            
            // Ordenar por fecha de entrada descendente
            $query .= " ORDER BY entrada DESC";
            
            // Preparar y ejecutar la consulta
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