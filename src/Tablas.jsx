import { useState } from 'react';
import datos from './assets/tipificaciones.json';
import { responsableFiltro, servicioFiltro } from './assets/filtros.js';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

export const Tablas = () => {
  const [dato, setDato] = useState([...datos]);
  const [filter, setFilter] = useState('');

  console.log(dato);

  const columnas = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'CODIGO',
      header: 'Codigo',
    },
    {
      accessorKey: 'RESPONSABLE',
      header: 'Responsable',
    },
    {
      accessorKey: 'SERVICIO',
      header: 'Servicio',
    },
    { accessorKey: 'TIPIFICACION', header: 'Tipificacion' },
    { accessorKey: 'DESCRIPCIONNORMA', header: 'Descripcion Norma' },
  ];

  // definicion del hook de table
  const tabla = useReactTable({
    columns: columnas,
    data: dato,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
  });

  // funciones de filtrado denarchivo

  const filtradoRespnsable = (filtro) => {
    if (filtro === 'TODOS') {
      setDato([...datos]);
      return;
    }
    setDato(dato.filter((item) => item.RESPONSABLE === filtro));
  };
  const filtradoServicio = (filtro) => {
    if (filtro === 'TODOS') {
      setDato([...datos]);
      return;
    }
    setDato(dato.filter((item) => item.SERVICIO === filtro));
  };

  // renderizacion del componente

  return (
    <>
      <h2>Tipificaciones</h2>
      <form action="">
        <div className="opciones">
          <label htmlFor="responsable">Responsable</label>
          <select
            id="responsable"
            onChange={(event) => filtradoRespnsable(event.target.value)}
          >
            {responsableFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="opciones">
          <label htmlFor="servicio">Servicio</label>
          <select
            id="servicio"
            onChange={(event) => {
              filtradoServicio(event.target.value);
            }}
          >
            {servicioFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="opciones">
          <label htmlFor="filtrar">Filtrar</label>
          <input
            id="filtrar"
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </form>
      <table>
        <thead>
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.column.columnDef.header}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tabla.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => tabla.firstPage()}>Primera pagina</button>
      <button onClick={() => tabla.previousPage()}>anterior</button>
      <button onClick={() => tabla.nextPage()}>siguiente</button>
      <button onClick={() => tabla.lastPage()}>ultima pagina</button>
    </>
  );
};
