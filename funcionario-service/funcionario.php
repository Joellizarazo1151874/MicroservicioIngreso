<?php
require_once 'db.php';
require_once 'cross_db.php';

class Funcionario {
    private $conn;        // Conexión a la base de datos de funcionarios
    private $cross_db;    // Objeto para manejar conexiones cruzadas entre bases de datos
    
    public function __construct() {
        // Inicializar la conexión principal a la base de datos de funcionarios
        $database = new Database();
        $this->conn = $database->getConnection();
        
        // Inicializar el objeto para manejar conexiones cruzadas
        $this->cross_db = new CrossDBConnection();
    }
    
    // Obtener todos los funcionarios de la biblioteca
    public function getAllFuncionarios() {
        try {
            // Obtener todos los funcionarios de la biblioteca desde becl_admin
            $funcionarios = $this->cross_db->findAllFuncionarios();
            
            // Para cada funcionario, verificar si tiene una foto en la tabla becl_funcionario
            foreach ($funcionarios as &$funcionario) {
                $codigo = $funcionario['cardnumber'];
                $query = "SELECT foto FROM becl_funcionario WHERE codigo = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$codigo]);
                
                if ($stmt->rowCount() > 0) {
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    $funcionario['foto'] = $result['foto'];
                } else {
                    $funcionario['foto'] = 'default.jpg'; // Foto por defecto
                }
            }
            
            return [
                'status' => 'success',
                'funcionarios' => $funcionarios
            ];
        } catch (PDOException $e) {
            error_log("Error en getAllFuncionarios: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al obtener los funcionarios'
            ];
        }
    }
    
    // Guardar o actualizar la foto de un funcionario
    public function saveFuncionarioFoto($codigo, $foto) {
        try {
            // Verificar primero si el funcionario existe en becl_admin
            $funcionario = $this->cross_db->findFuncionarioByCode($codigo);
            
            if (!$funcionario) {
                return [
                    'status' => 'error',
                    'message' => 'El funcionario no existe o no pertenece a la biblioteca'
                ];
            }
            
            // Verificar si ya existe en la tabla becl_funcionario
            $query = "SELECT * FROM becl_funcionario WHERE codigo = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$codigo]);
            
            if ($stmt->rowCount() > 0) {
                // Actualizar la foto
                $query = "UPDATE becl_funcionario SET foto = ? WHERE codigo = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$foto, $codigo]);
            } else {
                // Insertar nuevo registro
                $query = "INSERT INTO becl_funcionario (codigo, foto) VALUES (?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$codigo, $foto]);
            }
            
            return [
                'status' => 'success',
                'message' => 'Foto del funcionario guardada correctamente'
            ];
        } catch (PDOException $e) {
            error_log("Error en saveFuncionarioFoto: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al guardar la foto del funcionario'
            ];
        }
    }
    
    // Obtener un funcionario específico por código
    public function getFuncionarioByCode($codigo) {
        try {
            // Obtener el funcionario desde becl_admin
            $funcionario = $this->cross_db->findFuncionarioByCode($codigo);
            
            if (!$funcionario) {
                return [
                    'status' => 'error',
                    'message' => 'Funcionario no encontrado'
                ];
            }
            
            // Verificar si tiene una foto en la tabla becl_funcionario
            $query = "SELECT foto FROM becl_funcionario WHERE codigo = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$codigo]);
            
            if ($stmt->rowCount() > 0) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $funcionario['foto'] = $result['foto'];
            } else {
                $funcionario['foto'] = 'default.jpg'; // Foto por defecto
            }
            
            return [
                'status' => 'success',
                'funcionario' => $funcionario
            ];
        } catch (PDOException $e) {
            error_log("Error en getFuncionarioByCode: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Error al obtener el funcionario'
            ];
        }
    }
}
?>