import { useState } from 'react';
import datos from './assets/tipificaciones.json';
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
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

  // renderizacion del componente

  return (
    <>
      <h2>Tipificaciones 2023</h2>
      <form className="formulario">
        <div className="opciones">
          <label htmlFor="responsable">Responsable</label>
          <select id="responsable">
            {responsableFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="opciones">
          <label htmlFor="servicio">Servicio</label>
          <select id="servicio">
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
        <button type="submit">Filtrar</button>
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
      <div className="grupoBotones">
        <button className="boton" onClick={() => tabla.firstPage()}>
          Primera pagina
        </button>
        <button
          className="boton"
          onClick={() => {
            tabla.previousPage();
          }}
        >
          <AiFillCaretLeft />
        </button>
        <button
          className="boton"
          onClick={() => {
            tabla.nextPage();
            console.log(tabla.getCanNextPage());
          }}
        >
          <AiFillCaretRight />
        </button>
        <button className="boton" onClick={() => tabla.lastPage()}>
          ultima pagina
        </button>
      </div>
    </>
  );
};
