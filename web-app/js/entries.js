// URL base para el microservicio de registro de entradas
const ENTRY_API_URL = 'http://localhost/microservicio/entry-service';

// Clase para manejar las operaciones de registro de entradas
class EntryService {
    constructor() {}

    // Buscar estudiante por código
    async findStudentByCode(code) {
        try {
            // Asegurarnos que la URL esté bien formada
            const url = `${ENTRY_API_URL}/entries/student?code=${encodeURIComponent(code)}`;
            console.log("Consultando URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            const jsonResponse = await response.json();
            console.log("Respuesta del servidor:", jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }
    
    // Alias para findStudentByCode para mantener compatibilidad
    async searchStudent(code) {
        return this.findStudentByCode(code);
    }

    // Registrar una nueva entrada
    async registerEntry(entryData) {
        try {
            const response = await fetch(`${ENTRY_API_URL}/entries/register`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(entryData)
            });

            return await response.json();
        } catch (error) {
            console.error('Error al registrar entrada:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Registrar salida
    async registerExit(id) {
        try {
            const response = await fetch(`${ENTRY_API_URL}/entries/exit`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ id })
            });

            return await response.json();
        } catch (error) {
            console.error('Error al registrar salida:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Obtener entradas activas
    async getActiveEntries(sede = null) {
        try {
            let url = `${ENTRY_API_URL}/entries/active`;
            if (sede) {
                url += `?sede=${encodeURIComponent(sede)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener entradas activas:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                entries: []
            };
        }
    }

    // Obtener entradas por fecha
    async getEntriesByDate(fechaInicio, fechaFin, sede = null, programa = null) {
        try {
            let url = `${ENTRY_API_URL}/entries/by-date?inicio=${encodeURIComponent(fechaInicio)}&fin=${encodeURIComponent(fechaFin)}`;
            
            if (sede) {
                url += `&sede=${encodeURIComponent(sede)}`;
            }
            
            if (programa) {
                url += `&programa=${encodeURIComponent(programa)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener entradas por fecha:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                entries: []
            };
        }
    }

    // Buscar entrada
    async searchEntry(term) {
        try {
            const url = `${ENTRY_API_URL}/entries/search?q=${encodeURIComponent(term)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al buscar entrada:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                entries: []
            };
        }
    }
    
    // Obtener todos los registros
    async getAllEntries() {
        try {
            // Usamos la función de búsqueda por fecha con un rango muy amplio para obtener todos los registros
            // Desde 2000-01-01 hasta la fecha actual + 1 día (para asegurar que incluya hoy)
            const today = new Date();
            today.setDate(today.getDate() + 1);
            
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            const startDate = '2000-01-01';
            const endDate = formatDate(today);
            
            const url = `${ENTRY_API_URL}/entries/by-date?inicio=${startDate}&fin=${endDate}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener todos los registros:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                entries: []
            };
        }
    }
}

// Exportar una instancia del servicio
const entryService = new EntryService();