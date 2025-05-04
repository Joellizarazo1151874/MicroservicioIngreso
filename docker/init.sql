-- Seleccionar base de datos
USE becl_admin;

-- Crear tabla de administradores
CREATE TABLE `becl_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nivel` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar usuarios de prueba
INSERT INTO `becl_admin` (`id`, `usuario`, `password`, `nivel`) VALUES
(1, 'adminbecl', '268837dc8ffbb35b71dee6212d7ae1ad7f0c7149', 'admin'),
(2, 'entradabecl', '268837dc8ffbb35b71dee6212d7ae1ad7f0c7149', 'entrada'),
(3, 'entradabecle', 'c2781510b104170bf6635b6fc4886458c045c134', 'entrada'),
(4, 'computobecl', '4f0e770acf6c56bb3ce560dbce4ffa0a1b4a8bc0', 'entrada');

-- Crear tabla de registro de entradas
CREATE TABLE `becl_registro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `programa` varchar(100) DEFAULT NULL,
  `facultad` varchar(100) DEFAULT NULL,
  `entrada` datetime NOT NULL,
  `salida` datetime DEFAULT NULL,
  `sede` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `correo_idx` (`correo`),
  KEY `codigo_idx` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 