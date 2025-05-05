<?php
// Script de prueba para verificar la generación de archivos Excel
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluir archivos necesarios
require_once 'vendor/autoload.php';
require_once 'excel_export.php';

// Datos de prueba
$testData = [
    'tipo' => 'prueba',
    'headers' => ['ID', 'Nombre', 'Valor'],
    'data' => [
        [1, 'Elemento 1', 100],
        [2, 'Elemento 2', 200],
        [3, 'Elemento 3', 300],
    ],
    'params' => [
        'fecha_inicio' => '2025-01-01',
        'fecha_fin' => '2025-12-31',
        'sede' => 'Principal'
    ]
];

// Crear directorio de exportación si no existe
$exportDir = __DIR__ . '/exports';
if (!is_dir($exportDir)) {
    mkdir($exportDir, 0777, true);
    echo "Directorio de exportación creado: $exportDir<br>";
}

// Verificar permisos del directorio
echo "Permisos del directorio: " . substr(sprintf('%o', fileperms($exportDir)), -4) . "<br>";
echo "¿Es escribible?: " . (is_writable($exportDir) ? 'Sí' : 'No') . "<br>";

try {
    // Instanciar el exportador de Excel
    $excelExport = new ExcelExport();
    
    // Generar el archivo Excel
    $filename = 'test_excel';
    $filePath = $excelExport->generateExcel($testData, $filename);
    
    echo "Archivo Excel generado correctamente: $filePath<br>";
    
    // Verificar que el archivo existe
    $fullPath = __DIR__ . '/' . $filePath;
    echo "Ruta completa: $fullPath<br>";
    echo "¿Existe el archivo?: " . (file_exists($fullPath) ? 'Sí' : 'No') . "<br>";
    
    if (file_exists($fullPath)) {
        echo "Tamaño del archivo: " . filesize($fullPath) . " bytes<br>";
        echo "Permisos del archivo: " . substr(sprintf('%o', fileperms($fullPath)), -4) . "<br>";
        echo "¿Es legible?: " . (is_readable($fullPath) ? 'Sí' : 'No') . "<br>";
    }
    
    // Generar URL de descarga
    $baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/microservicio/stats-service';
    $downloadUrl = $baseUrl . '/download.php?file=' . basename($filePath);
    
    echo "<p>URL de descarga: <a href='$downloadUrl' target='_blank'>$downloadUrl</a></p>";
    
    // Listar archivos en el directorio de exportación
    echo "<h3>Archivos en el directorio de exportación:</h3>";
    $files = scandir($exportDir);
    echo "<ul>";
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $fileUrl = $baseUrl . '/download.php?file=' . $file;
            echo "<li><a href='$fileUrl' target='_blank'>$file</a> (" . filesize($exportDir . '/' . $file) . " bytes)</li>";
        }
    }
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}
