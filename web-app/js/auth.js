// URL base para el microservicio de autenticación
const AUTH_API_URL = 'http://localhost/microservicio/auth-service';

// Clase para manejar la autenticación
class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.token;
    }

    // Obtener el token
    getToken() {
        return this.token;
    }

    // Obtener el usuario actual
    getUser() {
        return this.user;
    }

    // Obtener las cabeceras de autorización
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Iniciar sesión
    async login(username, password) {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.token = data.token;
                this.user = data.user;

                // Guardar en localStorage
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            // Llamar al endpoint de logout
            await fetch(`${AUTH_API_URL}/auth/logout`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // Limpiar localStorage y variables
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    // Validar token
    async validateToken() {
        try {
            const response = await fetch(`${AUTH_API_URL}/auth/validate`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (data.status === 'success') {
                return true;
            } else {
                // Token inválido, limpiar datos
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return false;
            }
        } catch (error) {
            console.error('Error al validar token:', error);
            return false;
        }
    }
}

// Exportar una instancia de Auth
const auth = new Auth(); 