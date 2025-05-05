-- Base de datos para el microservicio de funcionarios
-- Contiene información de los funcionarios de la biblioteca

-- Crear tabla de funcionarios
CREATE TABLE `becl_funcionario` (
  `codigo` varchar(50) NOT NULL,
  `foto` varchar(200) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;