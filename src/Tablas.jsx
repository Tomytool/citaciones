import { useState } from 'react';
import { useForm } from 'react-hook-form';
import datos from './assets/tipificaciones.json';
import styled from 'styled-components';
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
  // definicion del hook form
  const { register, handleSubmit } = useForm();

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
  const filtrado = handleSubmit((filtro) => {
    const responsable = filtro.responsable;
    const servicio = filtro.servicio;
    if (responsable === 'TODOS' && servicio === 'TODOS') {
      setDato([...datos]);
      return;
    }
    setDato(
      datos.filter(
        (item) =>
          (responsable === 'TODOS' || item.RESPONSABLE === responsable) &&
          (servicio === 'TODOS' || item.SERVICIO === servicio)
      )
    );
  });

  // styled components para la tabla
  const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 15px;
    row-gap: 10px;
    background-color: #bfbfbf;
    width: 280px;
    border-radius: 6px;
    margin-bottom: 20px;
  `;

  const Opciones = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    row-gap: 10px;
  `;

  const Input = styled.input`
    width: 272px;
    height: 30px;
    border-radius: 6px;
  `;

  const Select = styled.select`
    padding: 6px 12px;
    width: 280px;
    border-radius: 6px;
  `;

  const Boton = styled.button`
    background-color: #404040;
    border: none;
    color: white;
    font-size: 16px;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
      background-color: #bfbfbf;
      color: black;
    }
  `;

  const Tabla = styled.table`
    margin-bottom: 20px;
    border-collapse: collapse;
  `;

  const CabeceraTabla = styled.thead`
    background-color: #0d0d0d;
    color: white;
  `;
  const CuerpoTabla = styled.tbody`
    tr {
      background-color: lightgray;
      &:nth-child(odd) {
        background-color: white;
      }
    }
  `;

  const GrupoBotones = styled.div`
    display: flex;
    width: 300px;
    justify-content: space-between;
    column-gap: 6px;
  `;

  // renderizacion del componente

  return (
    <>
      <h2>Tipificaciones 2023</h2>
      <Formulario onSubmit={filtrado} className="formulario">
        <Opciones>
          <label htmlFor="responsable">Responsable</label>
          <Select id="responsable" {...register('responsable')}>
            {responsableFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Opciones>
        <Opciones>
          <label htmlFor="servicio">Servicio</label>
          <Select id="servicio" {...register('servicio')}>
            {servicioFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Opciones>
        <Opciones>
          <label htmlFor="filtrar">Filtrar</label>
          <Input
            id="filtrar"
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </Opciones>
        <Boton type="submit">Filtrar</Boton>
      </Formulario>
      <Tabla>
        <CabeceraTabla>
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.column.columnDef.header}</th>
              ))}
            </tr>
          ))}
        </CabeceraTabla>
        <CuerpoTabla>
          {tabla.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </CuerpoTabla>
      </Tabla>
      <GrupoBotones>
        <Boton className="boton" onClick={() => tabla.firstPage()}>
          Primera pagina
        </Boton>
        <Boton
          className="boton"
          onClick={() => {
            tabla.previousPage();
          }}
        >
          <AiFillCaretLeft />
        </Boton>
        <Boton
          className="boton"
          onClick={() => {
            tabla.nextPage();
            console.log(tabla.getCanNextPage());
          }}
        >
          <AiFillCaretRight />
        </Boton>
        <Boton className="boton" onClick={() => tabla.lastPage()}>
          ultima pagina
        </Boton>
      </GrupoBotones>
    </>
  );
};
