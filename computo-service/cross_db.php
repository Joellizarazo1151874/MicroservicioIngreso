<?php
// Archivo para manejar conexiones cruzadas entre bases de datos
require_once 'config.php';

class CrossDBConnection {
    private $computo_conn; // Conexión a la base de datos de cómputo
    private $admin_conn;   // Conexión a la base de datos administrativa (donde están los estudiantes)
    
    public function __construct() {
        try {
            // Conexión a la base de datos de cómputo
            $this->computo_conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
            $this->computo_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->computo_conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            // Conexión a la base de datos administrativa (donde están los estudiantes)
            $this->admin_conn = new PDO("mysql:host=".DB_HOST.";dbname=becl_admin", DB_USER, DB_PASS);
            $this->admin_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->admin_conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            error_log("Error de conexión: " . $e->getMessage());
            die("Error de conexión a la base de datos");
        }
    }
    
    // Obtener conexión a la base de datos de cómputo
    public function getComputoConnection() {
        return $this->computo_conn;
    }
    
    // Obtener conexión a la base de datos administrativa
    public function getAdminConnection() {
        return $this->admin_conn;
    }
    
    // Buscar estudiante por código en la base de datos administrativa
    public function findStudentByCode($code) {
        try {
            // Verificar si la tabla vista_borrowers existe en la base de datos administrativa
            $tables_query = "SHOW TABLES LIKE 'vista_borrowers'";
            $tables_stmt = $this->admin_conn->prepare($tables_query);
            $tables_stmt->execute();
            
            if ($tables_stmt->rowCount() == 0) {
                error_log("La tabla vista_borrowers no existe en la base de datos administrativa");
                return false;
            }
            
            // Verificar si la tabla vista_authorised_values existe
            $values_query = "SHOW TABLES LIKE 'vista_authorised_values'";
            $values_stmt = $this->admin_conn->prepare($values_query);
            $values_stmt->execute();
            
            if ($values_stmt->rowCount() == 0) {
                // Si no existe la tabla de valores autorizados, usamos la consulta básica
                error_log("La tabla vista_authorised_values no existe, usando consulta básica");
                $query = "SELECT * FROM vista_borrowers WHERE cardnumber = ?";
                $stmt = $this->admin_conn->prepare($query);
                $stmt->execute([$code]);
                
                if ($stmt->rowCount() > 0) {
                    return $stmt->fetch();
                }
                
                // Intentar con LIKE
                $query = "SELECT * FROM vista_borrowers WHERE cardnumber LIKE ?";
                $stmt = $this->admin_conn->prepare($query);
                $stmt->execute(["%$code%"]);
                
                if ($stmt->rowCount() > 0) {
                    return $stmt->fetch();
                }
                
                return false;
            }
            
            // Consulta mejorada que incluye facultad y programa desde vista_authorised_values
            $query = "SELECT vb.*, 
                     S.lib AS programa, 
                     vav.lib AS facultad 
                     FROM vista_borrowers vb 
                     LEFT JOIN vista_authorised_values S ON vb.sort2 = S.authorised_value 
                     LEFT JOIN vista_authorised_values vav ON vb.sort1 = vav.authorised_value 
                     WHERE vb.cardnumber = ?";
            
            $stmt = $this->admin_conn->prepare($query);
            $stmt->execute([$code]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch();
            }
            
            // Si no encontramos nada, intentamos con LIKE por si acaso
            $query = "SELECT vb.*, 
                     S.lib AS programa, 
                     vav.lib AS facultad 
                     FROM vista_borrowers vb 
                     LEFT JOIN vista_authorised_values S ON vb.sort2 = S.authorised_value 
                     LEFT JOIN vista_authorised_values vav ON vb.sort1 = vav.authorised_value 
                     WHERE vb.cardnumber LIKE ?";
            
            $stmt = $this->admin_conn->prepare($query);
            $stmt->execute(["%$code%"]);
            
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch();
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Error en findStudentByCode: " . $e->getMessage());
            return false;
        }
    }
}
?>
