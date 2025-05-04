# Microservicios BECL - Entorno Docker

Este directorio contiene la configuración de Docker para el entorno de desarrollo de los microservicios BECL.

## Requisitos

- Docker
- Docker Compose

## Instrucciones de uso

### 1. Iniciar los servicios

```bash
cd docker
docker-compose up -d
```

Esto iniciará los siguientes servicios:
- MySQL (puerto 3306)
- phpMyAdmin (puerto 8080)

### 2. Acceder a phpMyAdmin

- URL: http://localhost/microservicio/web-app
- Usuario: root
- Contraseña: root

### 3. Configurar los microservicios

Editar los archivos `config.php` de los microservicios para que apunten a la base de datos en Docker:

Para el microservicio de autenticación (`auth-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_admin');
```

Para el microservicio de registro de entradas (`entry-service/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_admin');
```

### 4. Detener los servicios

```bash
docker-compose down
```

## Datos de prueba

### Usuarios disponibles

- Usuario: adminbecl / Contraseña: abc123456 / Nivel: admin
- Usuario: entradabecl / Contraseña: abc123456 / Nivel: entrada
- Usuario: entradabecle / Contraseña: abc123 / Nivel: entrada
- Usuario: computobecl / Contraseña: abc1234 / Nivel: entrada 