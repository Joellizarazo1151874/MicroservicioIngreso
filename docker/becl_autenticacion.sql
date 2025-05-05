-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db:3306
-- Tiempo de generación: 05-05-2025 a las 21:57:44
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
-- Base de datos: `becl_autenticacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `becl_admin`
--

CREATE TABLE `becl_admin` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nivel` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `becl_admin`
--

INSERT INTO `becl_admin` (`id`, `usuario`, `password`, `nivel`) VALUES
(1, 'adminbecl', '268837dc8ffbb35b71dee6212d7ae1ad7f0c7149', 'admin'),
(2, 'entradabecl', '268837dc8ffbb35b71dee6212d7ae1ad7f0c7149', 'entrada'),
(3, 'entradabecle', 'c2781510b104170bf6635b6fc4886458c045c134', 'entrada'),
(4, 'computobecl', '4f0e770acf6c56bb3ce560dbce4ffa0a1b4a8bc0', 'entrada');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `becl_admin`
--
ALTER TABLE `becl_admin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `becl_admin`
--
ALTER TABLE `becl_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
