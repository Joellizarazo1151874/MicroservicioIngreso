# BECL - Sistema de Microservicios

Este proyecto implementa una arquitectura de microservicios para el sistema BECL, con cinco servicios independientes:

1. **Microservicio de Autenticación** (`auth-service`): Gestión de usuarios y autenticación mediante JWT.
2. **Microservicio de Registro de Entradas** (`entry-service`): Gestión de entradas y salidas de estudiantes en la biblioteca.
3. **Microservicio de Cómputo** (`computo-service`): Gestión de préstamos de equipos de cómputo a estudiantes.
4. **Microservicio de Estadísticas** (`stats-service`): Generación de estadísticas y exportación de datos a Excel.
5. **Microservicio de Funcionarios** (`funcionario-service`): Gestión de funcionarios de la biblioteca y sus fotos.

Además, incluye una aplicación web unificada para interactuar con todos los microservicios.

## Arquitectura del Sistema

### Microservicios

Cada microservicio es independiente y tiene su propia responsabilidad:

- **auth-service**: Maneja la autenticación de usuarios con diferentes roles (adminbecl, entradabecl, entradabecle, computobecl).
- **entry-service**: Gestiona los registros de entrada/salida de estudiantes a la biblioteca.
- **computo-service**: Administra la asignación y liberación de equipos de cómputo a estudiantes.
- **stats-service**: Genera reportes y estadísticas basados en los datos de los demás servicios.
- **funcionario-service**: Gestiona la información de los funcionarios de la biblioteca y sus fotos.

### Bases de Datos

El sistema utiliza cuatro bases de datos independientes:

1. **becl_admin**: Base de datos principal
   - Contiene información de estudiantes y registros de entrada/salida
   - Tablas: `becl_registro`, `vista_borrowers`, `vista_authorised_value`

2. **becl_autenticacion**: Base de datos para autenticación
   - Gestiona usuarios y sus roles en el sistema

3. **becl_computo**: Base de datos para el servicio de cómputo
   - Gestiona equipos y sus préstamos
   - Tablas: `becl_equipo`, `becl_registro_computo`

4. **becl_funcionario**: Base de datos para el servicio de funcionarios
   - Gestiona información de funcionarios y sus fotos
   - Tablas: `becl_funcionario`

## Estructura del Proyecto

```
microservicio/
├── auth-service/      # Microservicio de Autenticación
├── entry-service/     # Microservicio de Registro de Entradas
├── computo-service/   # Microservicio de Gestión de Equipos
├── stats-service/     # Microservicio de Estadísticas y Reportes
├── funcionario-service/ # Microservicio de Gestión de Funcionarios
├── web-app/           # Aplicación Web unificada
└── docker/            # Configuración Docker y archivos SQL
```

## Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache, Nginx)
- Docker y Docker Compose (opcional, para entorno de desarrollo)

## Instrucciones de Instalación

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd microservicio
```

### 2. Configurar las bases de datos

**Opción 1**: Utilizando Docker (recomendado):
```bash
cd docker
docker-compose up -d
```
Esto creará automáticamente las cuatro bases de datos necesarias con todos sus datos.

**Opción 2**: Configuración manual:
- Crear las bases de datos: `becl_admin`, `becl_autenticacion`, `becl_computo` y `becl_funcionario`
- Importar los archivos SQL correspondientes desde la carpeta `docker`:
  - `becl_admin.sql` para la base de datos `becl_admin`
  - `becl_autenticacion.sql` para la base de datos `becl_autenticacion`
  - `becl_computo.sql` para la base de datos `becl_computo`
  - `becl_funcionario.sql` para la base de datos `becl_funcionario`

### 3. Configurar el servidor web

Editar los archivos `config.php` de todos los microservicios con la configuración correcta de la base de datos.

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

# Microservicio de Funcionarios
Alias /microservicio/funcionario-service /ruta/a/microservicio/funcionario-service
<Directory /ruta/a/microservicio/funcionario-service>
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

### Microservicio de Funcionarios

Endpoints disponibles:
- `GET /funcionarios` - Obtener todos los funcionarios
- `GET /funcionarios/{codigo}` - Obtener un funcionario específico
- `POST /funcionarios/foto` - Guardar o actualizar la foto de un funcionario

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