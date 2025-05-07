// Clase para manejar la gestión de usuarios
class UserService {
    constructor() {
        // Instancia de autenticación compartida
        this.auth = auth;
    }

    // Obtener todos los usuarios
    async getAllUsers() {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/users`, {
                method: 'GET',
                headers: this.auth.getAuthHeaders()
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, users: data.users };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    // Crear un nuevo usuario
    async createUser(userData) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/users`, {
                method: 'POST',
                headers: this.auth.getAuthHeaders(),
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message, id: data.id };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    // Actualizar un usuario existente
    async updateUser(id, userData) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/users/${id}`, {
                method: 'PUT',
                headers: this.auth.getAuthHeaders(),
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    // Eliminar un usuario
    async deleteUser(id) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/users/${id}`, {
                method: 'DELETE',
                headers: this.auth.getAuthHeaders()
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }
}

// Exportar una instancia de UserService
const userService = new UserService(); 