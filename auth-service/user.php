<?php
require_once 'db.php';

class User {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function login($usuario, $password) {
        try {
            $stmt = $this->conn->prepare('SELECT id, usuario, nivel FROM becl_admin WHERE usuario = ? AND password = ?');
            $hashed_password = sha1($password);
            $stmt->execute([$usuario, $hashed_password]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch();
            }
            return false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public function getUserById($id) {
        try {
            $stmt = $this->conn->prepare('SELECT id, usuario, nivel FROM becl_admin WHERE id = ?');
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch();
            }
            return false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Obtener todos los usuarios
    public function getAllUsers() {
        try {
            $stmt = $this->conn->prepare('SELECT id, usuario, nivel FROM becl_admin ORDER BY usuario ASC');
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getAllUsers: " . $e->getMessage());
            return [];
        }
    }
    
    // Crear un nuevo usuario
    public function createUser($usuario, $password, $nivel) {
        try {
            // Verificar si el usuario ya existe
            $checkStmt = $this->conn->prepare('SELECT id FROM becl_admin WHERE usuario = ?');
            $checkStmt->execute([$usuario]);
            
            if ($checkStmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'El usuario ya existe'
                ];
            }
            
            // Crear nuevo usuario
            $stmt = $this->conn->prepare('INSERT INTO becl_admin (usuario, password, nivel) VALUES (?, ?, ?)');
            $hashed_password = sha1($password);
            $stmt->execute([$usuario, $hashed_password, $nivel]);
            
            return [
                'success' => true,
                'id' => $this->conn->lastInsertId(),
                'message' => 'Usuario creado correctamente'
            ];
        } catch (PDOException $e) {
            error_log("Error en createUser: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al crear el usuario'
            ];
        }
    }
    
    // Actualizar un usuario existente
    public function updateUser($id, $usuario, $password, $nivel) {
        try {
            // Si se proporcionó una contraseña, actualizarla también
            if (!empty($password)) {
                $stmt = $this->conn->prepare('UPDATE becl_admin SET usuario = ?, password = ?, nivel = ? WHERE id = ?');
                $hashed_password = sha1($password);
                $stmt->execute([$usuario, $hashed_password, $nivel, $id]);
            } else {
                // Si no se proporcionó contraseña, actualizar solo usuario y nivel
                $stmt = $this->conn->prepare('UPDATE becl_admin SET usuario = ?, nivel = ? WHERE id = ?');
                $stmt->execute([$usuario, $nivel, $id]);
            }
            
            return [
                'success' => $stmt->rowCount() > 0,
                'message' => $stmt->rowCount() > 0 ? 'Usuario actualizado correctamente' : 'No se realizaron cambios'
            ];
        } catch (PDOException $e) {
            error_log("Error en updateUser: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al actualizar el usuario'
            ];
        }
    }
    
    // Eliminar un usuario
    public function deleteUser($id) {
        try {
            $stmt = $this->conn->prepare('DELETE FROM becl_admin WHERE id = ?');
            $stmt->execute([$id]);
            
            return [
                'success' => $stmt->rowCount() > 0,
                'message' => $stmt->rowCount() > 0 ? 'Usuario eliminado correctamente' : 'No se encontró el usuario'
            ];
        } catch (PDOException $e) {
            error_log("Error en deleteUser: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al eliminar el usuario'
            ];
        }
    }
} 