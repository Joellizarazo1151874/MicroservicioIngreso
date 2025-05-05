# BECL - Sistema de Microservicios

Este proyecto consiste en tres microservicios independientes para el sistema BECL:

1. **Microservicio de Autenticación**: Gestión de usuarios y autenticación mediante JWT.
2. **Microservicio de Registro de Entradas**: Gestión de entradas y salidas de estudiantes.
3. **Microservicio de Estadísticas y Reportes**: Generación de estadísticas y exportación de datos a Excel.

Además, incluye una aplicación web para probar las funcionalidades de los microservicios.

## Estructura del Proyecto

```
microservicio/
├── auth-service/      # Microservicio de Autenticación
├── entry-service/     # Microservicio de Registro de Entradas
├── stats-service/     # Microservicio de Estadísticas y Reportes
├── web-app/           # Aplicación Web
└── docker/            # Configuración Docker para la base de datos
```

## Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache, Nginx)
- Docker y Docker Compose (para el entorno de desarrollo)

## Instrucciones de Instalación

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd microservicio
```

### 2. Configurar la base de datos

Opción 1: Utilizando Docker:
```bash
cd docker
docker-compose up -d
```

Opción 2: Configurar manualmente:
- Crear una base de datos MySQL llamada `becl_admin`
- Importar el archivo `docker/init.sql`

### 3. Configurar los microservicios

Editar los archivos `config.php` de ambos microservicios con la configuración correcta de la base de datos.

### 4. Configurar el servidor web

Configurar el servidor web para que apunte a los directorios de los microservicios y la aplicación web.

Ejemplo para Apache:

```apache
# Microservicio de Autenticación
Alias /microservicio/auth-service /ruta/a/microservicio/auth-service
<Directory /ruta/a/microservicio/auth-service>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# Microservicio de Registro de Entradas
Alias /microservicio/entry-service /ruta/a/microservicio/entry-service
<Directory /ruta/a/microservicio/entry-service>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# Microservicio de Estadísticas y Reportes
Alias /microservicio/stats-service /ruta/a/microservicio/stats-service
<Directory /ruta/a/microservicio/stats-service>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# Aplicación Web
Alias /microservicio/web-app /ruta/a/microservicio/web-app
<Directory /ruta/a/microservicio/web-app>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

## Uso

### Microservicio de Autenticación

Endpoints disponibles:
- `POST /auth/login` - Autenticación de usuarios
- `GET /auth/validate` - Validación de token
- `POST /auth/logout` - Cierre de sesión

### Microservicio de Registro de Entradas

Endpoints disponibles:
- `POST /entries/register` - Registrar entrada
- `POST /entries/exit` - Registrar salida
- `GET /entries/active` - Obtener entradas activas
- `GET /entries/by-date` - Obtener entradas por fecha
- `GET /entries/search` - Buscar entradas

### Microservicio de Estadísticas y Reportes

Endpoints disponibles:
- `GET /estadisticas/programas` - Estadísticas por programas académicos
- `GET /estadisticas/mensual` - Estadísticas mensuales
- `GET /estadisticas/semanal` - Estadísticas semanales
- `GET /reportes/excel` - Exportar datos a Excel

### Aplicación Web

Para acceder a la aplicación web:
```
http://localhost/microservicio/web-app
```

## Usuarios de Prueba

- Usuario: adminbecl / Contraseña: becl2024 / Nivel: admin
- Usuario: entradabecl / Contraseña: becl2024 / Nivel: entrada
- Usuario: entradabecle / Contraseña: becle2024 / Nivel: entrada
- Usuario: computobecl / Contraseña: computo2024 / Nivel: entrada 