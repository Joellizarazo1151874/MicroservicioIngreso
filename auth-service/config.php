<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'becl_admin');

// Configuración JWT
define('JWT_SECRET', 'becl_secret_key');
define('JWT_EXPIRE', 3600); // Tiempo de expiración del token en segundos (1 hora) 