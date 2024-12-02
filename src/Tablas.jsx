import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const { register, handleSubmit } = useForm();
  const [dato, setDato] = useState([...datos]);

  const [filtro, setFiltro] = useState('');

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
      globalFilter: filtro,
    },
    onGlobalFilterChange: setFiltro,
  });

  // renderizacion del componente

  return (
    <>
      <h2>Tipificaciones 2023</h2>

      <form
        className="formulario"
        onSubmit={handleSubmit((data) => {
          setDato([...datos]);
          console.log(data);
          if (data.responsable === 'TODOS' && data.servicio === 'TODOS') {
            setDato([...datos]);
          } else if (data.responsable === 'TODOS') {
            setDato(datos.filter((item) => item.SERVICIO === data.servicio));
          } else if (data.servicio === 'TODOS') {
            setDato(
              datos.filter((item) => item.RESPONSABLE === data.responsable)
            );
          } else {
            setDato(
              datos.filter(
                (item) =>
                  item.RESPONSABLE === data.responsable &&
                  item.SERVICIO === data.servicio
              )
            );
          }
        })}
      >
        <div className="opciones">
          <label htmlFor="responsable">Responsable</label>
          <select id="responsable" {...register('responsable')}>
            {responsableFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="opciones">
          <label htmlFor="servicio">Servicio</label>
          <select id="servicio" {...register('servicio')}>
            {servicioFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button className="boton-consulta" type="submit">
          Consulta
        </button>

        <div className="opciones">
          <label htmlFor="filtrar">Filtrar</label>
          <input
            id="filtrar"
            type="text"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
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
