import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function ExcelFormat(data, config, filename = 'data.xlsx') {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('El argumento "data" debe ser un arreglo no vacío.');
    return;
  }

  if (!config || !config.headers || !Array.isArray(config.headers) || config.headers.length === 0) {
    console.error('El objeto de configuración debe contener una propiedad "headers" que sea un arreglo no vacío.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  // Agrega el encabezado personalizado a la hoja de cálculo
  const headerStyle = {
    font: { bold: true },
    alignment: { vertical: 'middle', horizontal: 'center' },
  };

  const headerRow = worksheet.addRow(config.headers);
  headerRow.font = headerStyle.font;
  headerRow.alignment = headerStyle.alignment;

  // Obtener el color de fondo para el encabezado
  const headerFillColor = config.theme?.header || 'FF93c47d';
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerFillColor },
    };
  });

  data.forEach((item, rowIndex) => {
    const rowValues = config.headers.map((header, index) => {
      const value = item[config.key[index]];

      if (config.tipeOf[index] === 'numero') {
        return { value: value != null && value !== '' ? parseFloat(value) : null, alignment: { horizontal: 'right' } };
      } else if (config.tipeOf[index] === 'fecha') {
        // Formatear fecha a "dd/mm/yyyy"
        const date = value && new Date(value);
        if (date instanceof Date && !isNaN(date)) {
            return { value: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`, alignment: { horizontal: 'left' } };
        } else {
            return { value: value, alignment: { horizontal: 'left' } };
        }
    } else {
        return { value: value, alignment: { horizontal: 'left' } };
      }
    });

    const row = worksheet.addRow(rowValues.map((item) => item.value));

    // Ajustar el ancho de la columna al contenido
    worksheet.columns.forEach((column, index) => {
      column.width = config.size[index] || 12; // Ancho predeterminado de 12 si no se proporciona el valor
    });

    // Ajustar la altura de la celda al contenido si es demasiado largo
    row.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'middle', ...rowValues[cell.col - 1].alignment };
      const rowHeight = Math.ceil(cell.value.toString().length / 6); // Estimar el número de líneas (aprox. 6 caracteres por línea)
      const maxHeight = 100; // Altura máxima en puntos (ajustar según sea necesario)
      if (rowHeight > 1) {
        cell.alignment.vertical = 'top'; // Alinear hacia arriba si hay más de una línea
        cell.height = Math.min(rowHeight * 15, maxHeight); // Ajustar altura (aprox. 15 puntos por línea)
      }
    });

    // Obtener el color de fondo para el contenido (fila intercalada si es necesario)
    const contentFillColor = config.theme?.interspersed && rowIndex % 2 !== 0 ? (config.theme?.line || 'FFd9ead3') : 'FFFFFFFF';
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: contentFillColor },
      };
    });
  });

  // Aplicar el filtro después de agregar los datos
  worksheet.autoFilter = {
    from: {
      row: 1, // Fila del encabezado (1 es la primera fila)
      column: 1, // Columna inicial (1 es la primera columna)
    },
    to: {
      row: data.length + 1, // Fila final (considerando el encabezado)
      column: config.headers.length, // Columna final
    },
  };

  // Aplicar bordes a todas las celdas
  const borderStyle = {
    style: 'thin',
    color: { argb: 'FF000000' }, // Color negro
  };

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle,
      };
    });
  });

  // Guardar el archivo Excel y descargarlo
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
  });
}
