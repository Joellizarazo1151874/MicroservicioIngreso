<?php
// Extensión de la clase Statistics
require_once 'statistics.php';
require_once 'db.php';

/**
 * Clase que implementa la funcionalidad de exportación de consultas
 */
class StatisticsExtension {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    /**
     * Obtiene datos de consultas para exportar a Excel
     * @param string|null $fechaInicio Fecha de inicio (opcional)
     * @param string|null $fechaFin Fecha de fin (opcional)
     * @param string|null $sede Sede para filtrar (opcional)
     * @param string|null $searchTerm Término de búsqueda (opcional)
     * @param string|null $programa Programa específico para filtrar (opcional)
     * @return array Datos formateados para exportar a Excel
     */
    public function getConsultasExportData($fechaInicio = null, $fechaFin = null, $sede = null, $searchTerm = null, $programa = null) {
        try {
            $conn = $this->db->getConnection();
            $params = [];
            $whereClause = "";
            $conditions = [];
            
            // Construir cláusula WHERE según los filtros
            if ($fechaInicio || $fechaFin || $sede || $searchTerm || $programa) {
                $whereClause = " WHERE ";
                
                if ($fechaInicio) {
                    $conditions[] = "DATE(entrada) >= ?";
                    $params[] = $fechaInicio;
                }
                
                if ($fechaFin) {
                    $conditions[] = "DATE(entrada) <= ?";
                    $params[] = $fechaFin;
                }
                
                if ($sede) {
                    $conditions[] = "sede = ?";
                    $params[] = $sede;
                }
                
                if ($searchTerm) {
                    $conditions[] = "(nombre LIKE ? OR correo LIKE ? OR codigo LIKE ?)";
                    $params[] = "%$searchTerm%";
                    $params[] = "%$searchTerm%";
                    $params[] = "%$searchTerm%";
                }
                
                if ($programa) {
                    $conditions[] = "programa = ?";
                    $params[] = $programa;
                }
                
                $whereClause .= implode(" AND ", $conditions);
            }
            
            // Consulta SQL para obtener los registros
            $sql = "SELECT id, nombre, correo, codigo, programa as carrera, facultad as departamento, 
                   DATE_FORMAT(entrada, '%Y-%m-%d %H:%i:%s') as entrada, 
                   DATE_FORMAT(salida, '%Y-%m-%d %H:%i:%s') as salida, 
                   sede FROM becl_registro $whereClause ORDER BY entrada DESC";
            
            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare($sql);
            
            // Vincular parámetros si existen
            if (!empty($params)) {
                $stmt->execute($params);
            } else {
                $stmt->execute();
            }
            
            // Obtener resultados
            $entries = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $entries[] = [
                    $row['id'],
                    $row['nombre'],
                    $row['correo'],
                    $row['codigo'],
                    $row['carrera'] ?? 'No especificado',
                    $row['departamento'] ?? 'No especificado',
                    $row['entrada'],
                    $row['salida'] ?? 'No registrada',
                    $row['sede']
                ];
            }
            
            // Preparar datos para Excel
            $data = [
                'tipo' => 'consultas',
                'headers' => ['ID', 'Nombre', 'Correo', 'Código', 'Carrera', 'Departamento', 'Entrada', 'Salida', 'Sede'],
                'data' => $entries,
                'params' => [
                    'fecha_inicio' => $fechaInicio ?? 'Todas',
                    'fecha_fin' => $fechaFin ?? 'Todas',
                    'sede' => $sede ?? 'Todas',
                    'busqueda' => $searchTerm ?? 'Ninguna',
                    'programa' => $programa ?? 'Todas'
                ]
            ];
            
            return $data;
            
        } catch (Exception $e) {
            error_log("Error al obtener datos de consultas: " . $e->getMessage());
            return [
                'tipo' => 'consultas',
                'headers' => ['ID', 'Nombre', 'Correo', 'Código', 'Carrera', 'Departamento', 'Entrada', 'Salida', 'Sede'],
                'data' => [],
                'params' => []
            ];
        }
    }
}
