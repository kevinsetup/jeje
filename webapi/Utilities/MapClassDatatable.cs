using System.Collections.Generic;
using System.Data;

namespace backendpedidofigueri.Utilities
{
    public class MapClassDatatable
    {

      public DataTable MapClassToDataTable<T>(IEnumerable<T> listClass)
      {
          DataTable dataTable = new DataTable();

          // Obtener las propiedades de la clase T
          var properties = typeof(T).GetProperties();

          // Agregar las columnas al DataTable basado en las propiedades de la clase T
          foreach (var prop in properties)
          {
            dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
          }

          // Llenar el DataTable con los datos de la lista
          foreach (var item in listClass)
          {
            var row = dataTable.NewRow();
            foreach (var prop in properties)
            {
              row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
            }
            dataTable.Rows.Add(row);
          }

          return dataTable;
    }
  }
}
