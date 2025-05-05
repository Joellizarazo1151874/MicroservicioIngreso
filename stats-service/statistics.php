<?php
require_once 'db.php';

class Statistics {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    /**
     * Obtiene estadísticas por programa académico
     * @param string|null $sede Sede para filtrar (opcional)
     * @param string|null $fechaInicio Fecha de inicio (opcional)
     * @param string|null $fechaFin Fecha de fin (opcional)
     * @return array Estadísticas por programa
     */
    public function getStatsByProgram($sede = null, $fechaInicio = null, $fechaFin = null) {
        try {
            $params = [];
            $whereClause = "";
            
            // Construir cláusula WHERE según los filtros
            if ($sede || $fechaInicio || $fechaFin) {
                $whereClause = " WHERE ";
                $conditions = [];
                
                if ($sede) {
                    $conditions[] = "sede = ?";
                    $params[] = $sede;
                }
                
                if ($fechaInicio && $fechaFin) {
                    $conditions[] = "entrada BETWEEN ? AND ?";
                    $params[] = $fechaInicio . " 00:00:00";
                    $params[] = $fechaFin . " 23:59:59";
                } else if ($fechaInicio) {
                    $conditions[] = "entrada >= ?";
                    $params[] = $fechaInicio . " 00:00:00";
                } else if ($fechaFin) {
                    $conditions[] = "entrada <= ?";
                    $params[] = $fechaFin . " 23:59:59";
                }
                
                $whereClause .= implode(" AND ", $conditions);
            }
            
            // Consulta para obtener estadísticas por programa
            $query = "SELECT programa, COUNT(*) as total 
                     FROM becl_registro" . $whereClause . " 
                     GROUP BY programa 
                     ORDER BY total DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            $result = $stmt->fetchAll();
            
            // Formatear los resultados para Chart.js
            $labels = [];
            $data = [];
            
            foreach ($result as $row) {
                $labels[] = $row['programa'] ? $row['programa'] : 'No especificado';
                $data[] = (int)$row['total'];
            }
            
            return [
                'labels' => $labels,
                'data' => $data,
                'raw' => $result
            ];
        } catch (PDOException $e) {
            error_log("Error en getStatsByProgram: " . $e->getMessage());
            return [
                'labels' => [],
                'data' => [],
                'raw' => [],
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtiene estadísticas mensuales
     * @param int|null $year Año para filtrar (opcional, por defecto el año actual)
     * @param string|null $sede Sede para filtrar (opcional)
     * @return array Estadísticas mensuales
     */
    public function getMonthlyStats($year = null, $sede = null) {
        try {
            if (!$year) {
                $year = date('Y');
            }
            
            $params = [$year];
            $sedeFilter = "";
            
            if ($sede) {
                $sedeFilter = " AND sede = ?";
                $params[] = $sede;
            }
            
            // Consulta para obtener estadísticas mensuales
            $query = "SELECT 
                        MONTH(entrada) as mes, 
                        COUNT(*) as total 
                     FROM becl_registro 
                     WHERE YEAR(entrada) = ?" . $sedeFilter . " 
                     GROUP BY MONTH(entrada) 
                     ORDER BY mes ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            $result = $stmt->fetchAll();
            
            // Formatear los resultados para Chart.js
            $monthNames = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];
            
            $labels = [];
            $data = [];
            $monthlyData = array_fill(1, 12, 0); // Inicializar con ceros
            
            foreach ($result as $row) {
                $monthlyData[$row['mes']] = (int)$row['total'];
            }
            
            // Crear arrays para Chart.js
            foreach ($monthlyData as $month => $count) {
                $labels[] = $monthNames[$month];
                $data[] = $count;
            }
            
            return [
                'labels' => $labels,
                'data' => $data,
                'raw' => $result,
                'year' => $year
            ];
        } catch (PDOException $e) {
            error_log("Error en getMonthlyStats: " . $e->getMessage());
            return [
                'labels' => [],
                'data' => [],
                'raw' => [],
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtiene estadísticas semanales
     * @param string|null $fechaInicio Fecha de inicio (opcional, por defecto 4 semanas atrás)
     * @param string|null $fechaFin Fecha de fin (opcional, por defecto hoy)
     * @param string|null $sede Sede para filtrar (opcional)
     * @return array Estadísticas semanales
     */
    public function getWeeklyStats($fechaInicio = null, $fechaFin = null, $sede = null) {
        try {
            // Si no se especifican fechas, usar las últimas 4 semanas
            if (!$fechaInicio) {
                $fechaInicio = date('Y-m-d', strtotime('-4 weeks'));
            }
            
            if (!$fechaFin) {
                $fechaFin = date('Y-m-d');
            }
            
            $params = [$fechaInicio, $fechaFin];
            $sedeFilter = "";
            
            if ($sede) {
                $sedeFilter = " AND sede = ?";
                $params[] = $sede;
            }
            
            // Consulta para obtener estadísticas semanales
            $query = "SELECT 
                        YEARWEEK(entrada, 1) as semana, 
                        MIN(DATE(entrada)) as inicio_semana,
                        COUNT(*) as total 
                     FROM becl_registro 
                     WHERE DATE(entrada) BETWEEN ? AND ?" . $sedeFilter . " 
                     GROUP BY YEARWEEK(entrada, 1) 
                     ORDER BY semana ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            $result = $stmt->fetchAll();
            
            // Formatear los resultados para Chart.js
            $labels = [];
            $data = [];
            
            foreach ($result as $row) {
                $weekStart = new DateTime($row['inicio_semana']);
                $weekEnd = clone $weekStart;
                $weekEnd->modify('+6 days');
                
                $labels[] = 'Semana ' . $weekStart->format('d/m') . ' - ' . $weekEnd->format('d/m');
                $data[] = (int)$row['total'];
            }
            
            return [
                'labels' => $labels,
                'data' => $data,
                'raw' => $result,
                'fechaInicio' => $fechaInicio,
                'fechaFin' => $fechaFin
            ];
        } catch (PDOException $e) {
            error_log("Error en getWeeklyStats: " . $e->getMessage());
            return [
                'labels' => [],
                'data' => [],
                'raw' => [],
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Genera datos para exportar a Excel
     * @param string|null $tipo Tipo de reporte (programas, mensual, semanal)
     * @param array $params Parámetros adicionales para el reporte
     * @return array Datos para exportar
     */
    public function getExportData($tipo = 'completo', $params = []) {
        try {
            $data = [];
            $headers = [];
            
            switch ($tipo) {
                case 'programas':
                    $result = $this->getStatsByProgram(
                        $params['sede'] ?? null,
                        $params['fechaInicio'] ?? null,
                        $params['fechaFin'] ?? null
                    );
                    $headers = ['Programa', 'Total de Entradas'];
                    $data = $result['raw'];
                    break;
                    
                case 'mensual':
                    $result = $this->getMonthlyStats(
                        $params['year'] ?? null,
                        $params['sede'] ?? null
                    );
                    $headers = ['Mes', 'Total de Entradas'];
                    $data = $result['raw'];
                    break;
                    
                case 'semanal':
                    $result = $this->getWeeklyStats(
                        $params['fechaInicio'] ?? null,
                        $params['fechaFin'] ?? null,
                        $params['sede'] ?? null
                    );
                    $headers = ['Semana', 'Inicio de Semana', 'Total de Entradas'];
                    $data = $result['raw'];
                    break;
                    
                case 'completo':
                default:
                    // Obtener todos los registros para exportación completa
                    $whereClause = "";
                    $sqlParams = [];
                    
                    if (isset($params['sede'])) {
                        $whereClause = " WHERE sede = ?";
                        $sqlParams[] = $params['sede'];
                    }
                    
                    if (isset($params['fechaInicio']) && isset($params['fechaFin'])) {
                        $whereClause = $whereClause ? $whereClause . " AND " : " WHERE ";
                        $whereClause .= "entrada BETWEEN ? AND ?";
                        $sqlParams[] = $params['fechaInicio'] . " 00:00:00";
                        $sqlParams[] = $params['fechaFin'] . " 23:59:59";
                    }
                    
                    $query = "SELECT id, nombre, correo, codigo, programa, facultad, 
                             DATE_FORMAT(entrada, '%Y-%m-%d %H:%i:%s') as entrada, 
                             DATE_FORMAT(salida, '%Y-%m-%d %H:%i:%s') as salida, 
                             sede 
                             FROM becl_registro" . $whereClause . " 
                             ORDER BY entrada DESC";
                    
                    $stmt = $this->conn->prepare($query);
                    $stmt->execute($sqlParams);
                    
                    $data = $stmt->fetchAll();
                    $headers = ['ID', 'Nombre', 'Correo', 'Código', 'Programa', 'Facultad', 'Entrada', 'Salida', 'Sede'];
                    break;
            }
            
            return [
                'headers' => $headers,
                'data' => $data,
                'tipo' => $tipo,
                'params' => $params
            ];
        } catch (PDOException $e) {
            error_log("Error en getExportData: " . $e->getMessage());
            return [
                'headers' => [],
                'data' => [],
                'error' => $e->getMessage()
            ];
        }
    }
}
