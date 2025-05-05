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
     * @return array Datos formateados para exportar a Excel
     */
    public function getConsultasExportData($fechaInicio = null, $fechaFin = null, $sede = null, $searchTerm = null) {
        try {
            $conn = $this->db->getConnection();
            $params = [];
            $whereClause = "";
            $conditions = [];
            
            // Construir cláusula WHERE según los filtros
            if ($fechaInicio || $fechaFin || $sede || $searchTerm) {
                $whereClause = " WHERE ";
                
                if ($fechaInicio) {
                    $conditions[] = "DATE(fecha_entrada) >= ?";
                    $params[] = $fechaInicio;
                }
                
                if ($fechaFin) {
                    $conditions[] = "DATE(fecha_entrada) <= ?";
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
                
                $whereClause .= implode(" AND ", $conditions);
            }
            
            // Consulta SQL para obtener los registros
            $sql = "SELECT id, nombre, correo, codigo, fecha_entrada, fecha_salida, sede FROM entradas $whereClause ORDER BY id DESC";
            
            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare($sql);
            
            // Vincular parámetros si existen
            if (!empty($params)) {
                foreach ($params as $i => $param) {
                    $paramIndex = $i + 1; // PDO usa índices basados en 1
                    $stmt->bindValue($paramIndex, $param);
                }
            }
            
            $stmt->execute();
            
            // Obtener resultados
            $entries = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $entries[] = [
                    $row['id'],
                    $row['nombre'],
                    $row['correo'],
                    $row['codigo'],
                    $row['fecha_entrada'],
                    $row['fecha_salida'] ?? 'No registrada',
                    $row['sede']
                ];
            }
            
            // Preparar datos para Excel
            $data = [
                'tipo' => 'consultas',
                'headers' => ['ID', 'Nombre', 'Correo', 'Código', 'Entrada', 'Salida', 'Sede'],
                'data' => $entries,
                'params' => [
                    'fecha_inicio' => $fechaInicio ?? 'Todas',
                    'fecha_fin' => $fechaFin ?? 'Todas',
                    'sede' => $sede ?? 'Todas',
                    'busqueda' => $searchTerm ?? 'Ninguna'
                ]
            ];
            
            return $data;
            
        } catch (Exception $e) {
            error_log("Error al obtener datos de consultas: " . $e->getMessage());
            return [
                'tipo' => 'consultas',
                'headers' => ['ID', 'Nombre', 'Correo', 'Código', 'Entrada', 'Salida', 'Sede'],
                'data' => [],
                'params' => []
            ];
        }
    }
}
