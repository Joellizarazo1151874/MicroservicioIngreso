// URL base para el microservicio de gestión de equipos de cómputo
const COMPUTO_API_URL = 'http://localhost/microservicio/computo-service';

// Clase para manejar las operaciones de equipos de cómputo
class ComputoService {
    constructor() {}

    // Buscar estudiante por código
    async findStudentByCode(code) {
        try {
            const url = `${COMPUTO_API_URL}/computo/student?code=${encodeURIComponent(code)}`;
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

    // Obtener equipos disponibles
    async getAvailableEquipos() {
        try {
            const url = `${COMPUTO_API_URL}/computo/equipos-disponibles`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener equipos disponibles:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                equipos: []
            };
        }
    }

    // Obtener todos los equipos
    async getAllEquipos() {
        try {
            const url = `${COMPUTO_API_URL}/computo/equipos`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener todos los equipos:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                equipos: []
            };
        }
    }

    // Registrar entrada de equipo
    async registerEntryEquipo(data) {
        try {
            const response = await fetch(`${COMPUTO_API_URL}/computo/register`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            console.error('Error al registrar entrada de equipo:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Registrar salida de equipo
    async registerExitEquipo(id) {
        try {
            const response = await fetch(`${COMPUTO_API_URL}/computo/exit`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ id })
            });

            return await response.json();
        } catch (error) {
            console.error('Error al registrar salida de equipo:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Obtener entradas activas de equipos
    async getActiveEntriesEquipo() {
        try {
            const url = `${COMPUTO_API_URL}/computo/active`;

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener entradas activas de equipos:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                entries: []
            };
        }
    }

    // Obtener historial de registros
    async getHistoryEquipo(limit = 50) {
        try {
            const url = `${COMPUTO_API_URL}/computo/history?limit=${limit}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: auth.getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Error al obtener historial de equipos:', error);
            return {
                status: 'error',
                message: 'Error de conexión con el servidor',
                history: []
            };
        }
    }
}

// Exportar una instancia del servicio
const computoService = new ComputoService();
