<?php
require_once 'config.php';

class CrossDBConnection {
    private $admin_conn; // Conexión a la base de datos becl_admin
    
    public function __construct() {
        try {
            // Conexión a la base de datos becl_admin para acceder a vista_borrowers
            $this->admin_conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=becl_admin",
                DB_USER,
                DB_PASS
            );
            $this->admin_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->admin_conn->exec("set names utf8");
            error_log("Conexión cruzada a becl_admin establecida correctamente");
        } catch(PDOException $e) {
            error_log("Error en conexión cruzada a becl_admin: " . $e->getMessage());
        }
    }
    
    // Buscar todos los funcionarios de la biblioteca (sort1 = '25Y')
    public function findAllFuncionarios() {
        try {
            // Usamos DISTINCT en cardnumber para evitar duplicados
            $query = "SELECT DISTINCT cardnumber, firstname, surname, email, sort1 FROM vista_borrowers WHERE sort1 = '25Y' ORDER BY surname, firstname";
            $stmt = $this->admin_conn->prepare($query);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            return [];
        } catch (PDOException $e) {
            error_log("Error al buscar funcionarios: " . $e->getMessage());
            return [];
        }
    }
    
    // Buscar un funcionario específico por código
    public function findFuncionarioByCode($code) {
        try {
            $query = "SELECT * FROM vista_borrowers WHERE sort1 = '25Y' AND cardnumber = ?";
            $stmt = $this->admin_conn->prepare($query);
            $stmt->execute([$code]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            return null;
        } catch (PDOException $e) {
            error_log("Error al buscar funcionario por código: " . $e->getMessage());
            return null;
        }
    }
}
?>