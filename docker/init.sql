-- Crear y seleccionar la base de datos becl_admin
CREATE DATABASE IF NOT EXISTS becl_admin;
USE becl_admin;

-- Importar el contenido del archivo becl_admin.sql
SOURCE /docker-entrypoint-initdb.d/becl_admin.sql;

-- Crear y seleccionar la base de datos becl_autenticacion
CREATE DATABASE IF NOT EXISTS becl_autenticacion;
USE becl_autenticacion;

-- Importar el contenido del archivo becl_autenticacion.sql
SOURCE /docker-entrypoint-initdb.d/becl_autenticacion.sql;

-- Crear y seleccionar la base de datos becl_computo
CREATE DATABASE IF NOT EXISTS becl_computo;
USE becl_computo;

-- Importar el contenido del archivo becl_computo.sql
SOURCE /docker-entrypoint-initdb.d/becl_computo.sql;