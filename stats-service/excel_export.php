<?php
require_once 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelExport {
    /**
     * Genera un archivo Excel con los datos proporcionados
     * @param array $data Datos para exportar
     * @param string $filename Nombre del archivo (sin extensión)
     * @return string Ruta al archivo generado
     */
    public function generateExcel($data, $filename = 'reporte') {
        // Crear un nuevo objeto Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Establecer el título del reporte
        $sheet->setCellValue('A1', 'Reporte BECL - ' . ucfirst($data['tipo']));
        $sheet->mergeCells('A1:' . $this->getColumnLetter(count($data['headers'])) . '1');
        
        // Dar formato al título
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        
        // Añadir información de parámetros del reporte
        $row = 2;
        if (!empty($data['params'])) {
            foreach ($data['params'] as $key => $value) {
                if ($value) {
                    $sheet->setCellValue('A' . $row, ucfirst($key) . ': ' . $value);
                    $sheet->mergeCells('A' . $row . ':' . $this->getColumnLetter(count($data['headers'])) . $row);
                    $row++;
                }
            }
        }
        
        // Añadir fecha de generación
        $sheet->setCellValue('A' . $row, 'Fecha de generación: ' . date('Y-m-d H:i:s'));
        $sheet->mergeCells('A' . $row . ':' . $this->getColumnLetter(count($data['headers'])) . $row);
        $row++;
        
        // Espacio en blanco
        $row++;
        
        // Añadir encabezados
        $col = 'A';
        foreach ($data['headers'] as $header) {
            $sheet->setCellValue($col . $row, $header);
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $col++;
        }
        
        // Dar formato a los encabezados
        $headerRange = 'A' . $row . ':' . $this->getColumnLetter(count($data['headers']) - 1) . $row;
        $sheet->getStyle($headerRange)->getFont()->setBold(true);
        $sheet->getStyle($headerRange)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID);
        $sheet->getStyle($headerRange)->getFill()->getStartColor()->setRGB('FF0000'); // Rojo
        $sheet->getStyle($headerRange)->getFont()->getColor()->setRGB('FFFFFF'); // Texto blanco
        
        // Añadir datos
        $row++;
        foreach ($data['data'] as $dataRow) {
            $col = 'A';
            foreach ($dataRow as $value) {
                $sheet->setCellValue($col . $row, $value);
                $col++;
            }
            $row++;
        }
        
        // Crear borde para toda la tabla
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
        ];
        $sheet->getStyle('A5:' . $this->getColumnLetter(count($data['headers']) - 1) . ($row - 1))->applyFromArray($styleArray);
        
        // Alternar colores de fila para mejor legibilidad
        for ($i = 6; $i < $row; $i += 2) {
            $sheet->getStyle('A' . $i . ':' . $this->getColumnLetter(count($data['headers']) - 1) . $i)
                  ->getFill()
                  ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                  ->getStartColor()
                  ->setRGB('F9F9F9');
        }
        
        // Generar nombre de archivo único
        $fullFilename = $filename . '_' . date('Ymd_His') . '.xlsx';
        
        // Usar ruta absoluta para el directorio de exportación
        $exportDir = __DIR__ . '/exports';
        $filePath = $exportDir . '/' . $fullFilename;
        
        // Asegurarse de que el directorio existe
        if (!is_dir($exportDir)) {
            mkdir($exportDir, 0777, true);
        }
        
        // Verificar permisos de escritura
        if (!is_writable($exportDir)) {
            error_log("El directorio de exportación no tiene permisos de escritura: $exportDir");
            throw new Exception("Error: No se puede escribir en el directorio de exportación");
        }
        
        // Guardar el archivo
        try {
            $writer = new Xlsx($spreadsheet);
            $writer->save($filePath);
            
            // Verificar que el archivo se haya creado correctamente
            if (!file_exists($filePath)) {
                error_log("El archivo no se creó correctamente: $filePath");
                throw new Exception("Error: No se pudo crear el archivo Excel");
            }
            
            // Devolver la ruta relativa para usar en URLs
            return 'exports/' . $fullFilename;
        } catch (Exception $e) {
            error_log("Error al guardar el archivo Excel: " . $e->getMessage());
            throw new Exception("Error al generar el archivo Excel: " . $e->getMessage());
        }
    }
    
    /**
     * Convierte un número de columna a letra (A, B, C, ..., AA, AB, etc.)
     * @param int $columnNumber Número de columna (0 para A, 1 para B, etc.)
     * @return string Letra de columna
     */
    private function getColumnLetter($columnNumber) {
        $columnLetter = '';
        while ($columnNumber >= 0) {
            $columnLetter = chr(65 + ($columnNumber % 26)) . $columnLetter;
            $columnNumber = floor($columnNumber / 26) - 1;
        }
        return $columnLetter;
    }
}
