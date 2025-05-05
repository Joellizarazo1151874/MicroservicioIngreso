-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db:3306
-- Tiempo de generación: 05-05-2025 a las 21:57:52
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `becl_computo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `becl_equipo`
--

CREATE TABLE `becl_equipo` (
  `id` int(11) NOT NULL,
  `equipo` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `becl_equipo`
--

INSERT INTO `becl_equipo` (`id`, `equipo`, `estado`) VALUES
(1, 1, 'ocupado'),
(2, 2, 'ocupado'),
(3, 3, 'libre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `becl_registro_computo`
--

CREATE TABLE `becl_registro_computo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `codigo` varchar(50) NOT NULL,
  `programa` varchar(100) DEFAULT NULL,
  `facultad` varchar(100) DEFAULT NULL,
  `entrada` datetime NOT NULL,
  `salida` datetime DEFAULT NULL,
  `equipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `becl_registro_computo`
--

INSERT INTO `becl_registro_computo` (`id`, `nombre`, `correo`, `codigo`, `programa`, `facultad`, `entrada`, `salida`, `equipo`) VALUES
(1, 'ENDERSON JOEL LIZARAZO GUTIERREZ', 'endersonjoellg@ufps.edu.co', '1151874', '6Y', 'BECL', '2025-05-05 05:11:25', '2025-05-05 05:11:58', 1),
(2, 'SAMIR ENRIQUE ORTEGA FLOREZ', 'samirenr68@gmail.com', '1151873', '6Y', 'BECL', '2025-05-05 05:11:45', '2025-05-05 19:46:50', 3),
(3, 'SAMIR ENRIQUE ORTEGA FLOREZ', 'samirenr68@gmail.com', '1151873', 'INGENIERIA DE SISTEMAS', 'FACULTAD DE INGENIERIA', '2025-05-05 19:44:07', '2025-05-05 19:46:47', 1),
(4, 'ANGELY VANESSA GELVEZ MENDOZA', 'vanessagm-06@hotmail.com', '1151899', 'INGENIERIA DE SISTEMAS', 'FACULTAD DE INGENIERIA', '2025-05-05 19:53:22', NULL, 1),
(5, 'STIVEN SEBASTIAN AMAYA MARQUEZ', 'stivensebastianamma@ufps.edu.co', '1161873', 'INGENIERIA ELECTRONICA', 'FACULTAD DE INGENIERIA', '2025-05-05 21:31:45', NULL, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `becl_equipo`
--
ALTER TABLE `becl_equipo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `becl_registro_computo`
--
ALTER TABLE `becl_registro_computo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `becl_equipo`
--
ALTER TABLE `becl_equipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `becl_registro_computo`
--
ALTER TABLE `becl_registro_computo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
