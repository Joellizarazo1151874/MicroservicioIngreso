# Microservicio de Estadísticas y Reportes - BECL

Este microservicio proporciona funcionalidades para la generación de estadísticas y exportación de datos a Excel para el sistema BECL (Biblioteca).

## Funcionalidades

El microservicio ofrece las siguientes funcionalidades:

1. **Estadísticas por Programas Académicos**
   - Visualización de la distribución de entradas por programa académico
   - Filtrado por sede y rango de fechas
   - Exportación a Excel

2. **Estadísticas Mensuales**
   - Visualización de la cantidad de entradas por mes para un año específico
   - Filtrado por sede
   - Exportación a Excel

3. **Estadísticas Semanales**
   - Visualización de la cantidad de entradas por semana para un rango de fechas
   - Filtrado por sede
   - Exportación a Excel

4. **Exportación de Datos**
   - Generación de archivos Excel con datos detallados
   - Múltiples formatos de reporte (programas, mensual, semanal, completo)
   - Personalización de filtros

## Endpoints de la API

El microservicio expone los siguientes endpoints:

- `GET /estadisticas/programas` - Estadísticas por programas académicos
  - Parámetros: `sede`, `fechaInicio`, `fechaFin`

- `GET /estadisticas/mensual` - Estadísticas mensuales
  - Parámetros: `year`, `sede`

- `GET /estadisticas/semanal` - Estadísticas semanales
  - Parámetros: `fechaInicio`, `fechaFin`, `sede`

- `GET /reportes/excel` - Exportar datos a Excel
  - Parámetros: `tipo`, `sede`, `fechaInicio`, `fechaFin`, `year`

## Requisitos

- PHP 7.2 o superior
- Biblioteca PhpSpreadsheet para la generación de archivos Excel
- Acceso a la base de datos MySQL del sistema BECL

## Instalación

1. Asegúrese de tener Composer instalado
2. Ejecute `composer install` en el directorio del microservicio para instalar las dependencias
3. Configure los parámetros de conexión a la base de datos en `config.php`

## Integración con el Frontend

El microservicio se integra con la interfaz web a través de JavaScript, utilizando Chart.js para la visualización de gráficos y SweetAlert2 para las notificaciones.

## Seguridad

El acceso a los endpoints está protegido mediante autenticación JWT. Solo los usuarios con rol de administrador pueden acceder a las funcionalidades de estadísticas y reportes.
