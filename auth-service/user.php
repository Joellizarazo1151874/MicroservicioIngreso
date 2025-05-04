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
} 