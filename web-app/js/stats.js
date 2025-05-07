// URL base del microservicio de estadísticas
const STATS_API_URL = 'http://localhost/microservicio/stats-service/api';

// Función para manejar errores de fetch
const handleFetchError = (error, errorType) => {
    console.error(`Error al obtener ${errorType}:`, error);
    return {
        status: 'error',
        message: 'Error de conexión con el servidor'
    };
};

class StatsService {
    constructor() {
        // Inicializar gráficos
        this.chartProgramas = null;
        this.chartMensual = null;
        this.chartSemanal = null;
    }

    /**
     * Obtiene estadísticas por programa académico
     * @param {string|null} fechaInicio - Fecha de inicio (opcional)
     * @param {string|null} fechaFin - Fecha de fin (opcional)
     * @param {string|null} sede - Sede para filtrar (opcional)
     * @param {string|null} programa - Programa académico para filtrar (opcional)
     * @returns {Promise} - Promesa con los datos de estadísticas
     */
    async getStatsByProgram(fechaInicio = null, fechaFin = null, sede = null, programa = null) {
        try {
            let url = `${STATS_API_URL}/estadisticas/programas`;
            const params = new URLSearchParams();
            
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            if (sede) params.append('sede', sede);
            if (programa) params.append('programa', programa);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            console.log('Solicitando estadísticas por programa a:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                return {
                    status: 'error',
                    message: `Error del servidor: ${response.status} ${response.statusText}`
                };
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('La respuesta no es JSON válido');
                const text = await response.text();
                console.log('Contenido de la respuesta:', text.substring(0, 100) + '...');
                return {
                    status: 'error',
                    message: 'Formato de respuesta inválido'
                };
            }
            
            return await response.json();
        } catch (error) {
            return handleFetchError(error, 'estadísticas por programa');
        }
    }
    
    /**
     * Obtiene estadísticas mensuales
     * @param {number|null} year - Año para filtrar (opcional)
     * @param {string|null} sede - Sede para filtrar (opcional)
     * @returns {Promise} - Promesa con los datos de estadísticas
     */
    async getMonthlyStats(year = null, sede = null) {
        try {
            let url = `${STATS_API_URL}/estadisticas/mensual`;
            const params = new URLSearchParams();
            
            if (year) params.append('year', year);
            if (sede) params.append('sede', sede);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            console.log('Solicitando estadísticas mensuales a:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                return {
                    status: 'error',
                    message: `Error del servidor: ${response.status} ${response.statusText}`
                };
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('La respuesta no es JSON válido');
                const text = await response.text();
                console.log('Contenido de la respuesta:', text.substring(0, 100) + '...');
                return {
                    status: 'error',
                    message: 'Formato de respuesta inválido'
                };
            }
            
            return await response.json();
        } catch (error) {
            return handleFetchError(error, 'estadísticas mensuales');
        }
    }
    
    /**
     * Obtiene estadísticas semanales
     * @param {string|null} fechaInicio - Fecha de inicio (opcional)
     * @param {string|null} fechaFin - Fecha de fin (opcional)
     * @param {string|null} sede - Sede para filtrar (opcional)
     * @returns {Promise} - Promesa con los datos de estadísticas
     */
    async getWeeklyStats(fechaInicio = null, fechaFin = null, sede = null) {
        try {
            let url = `${STATS_API_URL}/estadisticas/semanal`;
            const params = new URLSearchParams();
            
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            if (sede) params.append('sede', sede);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            console.log('Solicitando estadísticas semanales a:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                return {
                    status: 'error',
                    message: `Error del servidor: ${response.status} ${response.statusText}`
                };
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('La respuesta no es JSON válido');
                const text = await response.text();
                console.log('Contenido de la respuesta:', text.substring(0, 100) + '...');
                return {
                    status: 'error',
                    message: 'Formato de respuesta inválido'
                };
            }
            
            return await response.json();
        } catch (error) {
            return handleFetchError(error, 'estadísticas semanales');
        }
    }
    
    /**
     * Obtiene la lista de todos los programas académicos
     * @returns {Promise} - Promesa con la lista de programas
     */
    async getAllPrograms() {
        try {
            const url = `${STATS_API_URL}/programas`;
            console.log('Solicitando lista de programas a:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                return {
                    status: 'error',
                    message: `Error del servidor: ${response.status} ${response.statusText}`
                };
            }
            
            return await response.json();
        } catch (error) {
            return handleFetchError(error, 'lista de programas');
        }
    }
    
    /**
     * Prueba la conexión con el microservicio de estadísticas
     * @returns {Promise<boolean>} - Verdadero si la conexión es exitosa
     */
    async testConnection() {
        try {
            const url = `${STATS_API_URL}/estadisticas/programas?test=1`;
            console.log('Probando conexión con:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            console.log('Respuesta de prueba:', response.status, response.statusText);
            if (!response.ok) {
                const text = await response.text();
                console.log('Contenido de error:', text.substring(0, 200));
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error al probar conexión:', error);
            return false;
        }
    }
    
    /**
     * Exporta datos a Excel
     * @param {string} tipo - Tipo de reporte (programas, mensual, semanal, completo)
     * @param {Object} params - Parámetros adicionales (fechaInicio, fechaFin, sede, year, programa)
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    async exportToExcel(tipo, params = {}) {
        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Generando archivo Excel',
                text: 'Por favor espere mientras se genera el archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Construir URL con los parámetros
            let url = `${STATS_API_URL}/reportes/excel?tipo=${tipo}`;
            
            // Añadir parámetros adicionales
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    url += `&${key}=${params[key]}`;
                }
            });
            
            console.log('Solicitando exportación a Excel:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) {
                console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
                Swal.fire('Error', `Error del servidor: ${response.status} ${response.statusText}`, 'error');
                return {
                    status: 'error',
                    message: `Error del servidor: ${response.status} ${response.statusText}`
                };
            }
            
            const result = await response.json();
            console.log('Respuesta de exportación:', result);
            
            if (result.status === 'success' && result.file_url) {
                // Cerrar el indicador de carga
                Swal.close();
                
                // Crear un enlace temporal para descargar el archivo
                const downloadLink = document.createElement('a');
                downloadLink.href = result.file_url;
                downloadLink.download = result.file_url.split('/').pop(); // Extraer el nombre del archivo de la URL
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Mostrar mensaje de éxito
                Swal.fire('Éxito', 'Archivo Excel generado correctamente', 'success');
                
                return result;
            } else {
                Swal.fire('Error', result.message || 'Error al generar el archivo Excel', 'error');
                return result;
            }
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }
    
    /**
     * Renderiza el gráfico de estadísticas por programa
     * @param {Object} data - Datos para el gráfico
     */
    renderProgramChart(data) {
        const ctx = document.getElementById('chartProgramas').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.chartProgramas) {
            this.chartProgramas.destroy();
        }
        
        // Crear nuevo gráfico
        this.chartProgramas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Entradas por Programa',
                    data: data.data,
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Entradas por Programa Académico',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
    
    /**
     * Renderiza el gráfico de estadísticas mensuales
     * @param {Object} data - Datos para el gráfico
     */
    renderMonthlyChart(data) {
        const ctx = document.getElementById('chartMensual').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.chartMensual) {
            this.chartMensual.destroy();
        }
        
        // Crear nuevo gráfico
        this.chartMensual = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: `Entradas Mensuales ${data.year}`,
                    data: data.data,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Estadísticas Mensuales ${data.year}`,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
    
    /**
     * Renderiza el gráfico de estadísticas semanales
     * @param {Object} data - Datos para el gráfico
     */
    renderWeeklyChart(data) {
        const ctx = document.getElementById('chartSemanal').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.chartSemanal) {
            this.chartSemanal.destroy();
        }
        
        // Crear nuevo gráfico
        this.chartSemanal = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Entradas Semanales',
                    data: data.data,
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Estadísticas Semanales (${data.fechaInicio} - ${data.fechaFin})`,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Instanciar el servicio de estadísticas
const statsService = new StatsService();
