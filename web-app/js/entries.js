// URL base para el microservicio de registro de entradas
const ENTRY_API_URL = 'http://localhost/microservicio/entry-service';

// Clase para manejar las operaciones de registro de entradas
class EntryService {
    constructor() {}

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
    async getEntriesByDate(fechaInicio, fechaFin, sede = null) {
        try {
            let url = `${ENTRY_API_URL}/entries/by-date?inicio=${encodeURIComponent(fechaInicio)}&fin=${encodeURIComponent(fechaFin)}`;
            if (sede) {
                url += `&sede=${encodeURIComponent(sede)}`;
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
}

// Exportar una instancia del servicio
const entryService = new EntryService();