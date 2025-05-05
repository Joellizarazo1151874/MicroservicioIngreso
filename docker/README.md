# Microservicios BECL - Entorno Docker

Este directorio contiene la configuración de Docker para el entorno de desarrollo de los microservicios BECL, con soporte para múltiples bases de datos.

## Requisitos

- Docker
- Docker Compose

## Estructura de Bases de Datos

El sistema utiliza cuatro bases de datos independientes:

1. **becl_admin**: Base de datos principal que contiene:
   - Tabla `becl_registro`: Registros de entrada/salida de estudiantes
   - Tabla `vista_borrowers`: Información de estudiantes
   - Tabla `vista_authorised_value`: Valores autorizados del sistema

2. **becl_autenticacion**: Base de datos para el servicio de autenticación
   - Contiene las tablas relacionadas con usuarios y autenticación

3. **becl_computo**: Base de datos para el servicio de cómputo
   - Tabla `becl_equipo`: Información de equipos de cómputo
   - Tabla `becl_registro_computo`: Registros de uso de equipos

4. **becl_funcionario**: Base de datos para el servicio de funcionarios
   - Tabla `becl_funcionario`: Información de fotos de funcionarios

## Instrucciones de uso

### 1. Iniciar los servicios

```bash
cd docker
docker-compose up -d
```

Esto iniciará los siguientes servicios:
- MySQL (puerto 3306) con las cuatro bases de datos
- phpMyAdmin (puerto 8080)

### 2. Acceder a la aplicación y phpMyAdmin

- Aplicación web: http://localhost/microservicio/web-app
- phpMyAdmin: http://localhost:8080
  - Usuario: root
  - Contraseña: root

### 3. Configuración de los microservicios

Los archivos `config.php` de cada microservicio ya están configurados para apuntar a su respectiva base de datos:

**Microservicio de autenticación** (`auth-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_autenticacion');
```

**Microservicio de registro de entradas** (`entry-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_admin');
```

**Microservicio de cómputo** (`computo-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_computo');
```

**Microservicio de funcionarios** (`funcionario-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_funcionario');
```

### 4. Detener los servicios

```bash
docker-compose down
```

### 5. Reinciar los servicios

```bash
docker restart becl_mysql
```

## Datos de prueba

### Usuarios disponibles

- Usuario: adminbecl / Contraseña: abc123456 / Nivel: admin
- Usuario: entradabecl / Contraseña: abc123456 / Nivel: entrada
- Usuario: entradabecle / Contraseña: abc123 / Nivel: entrada
- Usuario: computobecl / Contraseña: abc1234 / Nivel: entrada