<?php
require_once 'db.php';

class Entry {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
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