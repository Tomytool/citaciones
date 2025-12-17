import { useState } from "react";
import { useForm } from "react-hook-form";
import datos from "./assets/tipificaciones.json";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";
import {
  responsableFiltro,
  servicioFiltro,
  tipoFiscalizacion,
} from "./assets/filtros.js";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const Tablas = () => {
  const { register, handleSubmit } = useForm();
  const [dato, setDato] = useState([...datos]);

  const [filtro, setFiltro] = useState("");

  const columnas = [
    {
      accessorKey: "CODIGO",
      header: "Codigo",
    },
    {
      accessorKey: "RESPONSABLE",
      header: "Responsable",
    },
    {
      accessorKey: "SERVICIO",
      header: "Servicio",
    },
    {
      accessorKey: "TIPOFISCALIZACION",
      header: "Tipo Fiscalizacion",
    },
    { accessorKey: "TIPIFICACION", header: "Tipificacion" },
    { accessorKey: "DESCRIPCIONNORMA", header: "Descripcion Norma" },
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
      <h2 className="text-2xl font-bold text-center mb-6 text-[#25362b]">
        Tipificaciones 2025
      </h2>

      <form
        className="bg-[#25362b] p-6 rounded-lg shadow-md max-w-md mx-auto mb-8 text-white"
        onSubmit={handleSubmit((data) => {
          if (
            data.responsable === "TODOS" &&
            data.servicio === "TODOS" &&
            data.tipofiscalizacion === "TODOS"
          ) {
            setDato(datos);
          } else {
            const datosFiltrados = datos.filter((item) => {
              return (
                (data.responsable === "TODOS" ||
                  item.RESPONSABLE === data.responsable) &&
                (data.servicio === "TODOS" ||
                  item.SERVICIO === data.servicio) &&
                (data.tipofiscalizacion === "TODOS" ||
                  item.TIPOFISCALIZACION === data.tipofiscalizacion)
              );
            });
            setDato(datosFiltrados);
          }
        })}
      >
        <div className="mb-4">
          <label
            htmlFor="responsable"
            className="block text-sm font-medium text-white mb-1"
          >
            Responsable
          </label>
          <select
            id="responsable"
            {...register("responsable")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          >
            {responsableFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="servicio"
            className="block text-sm font-medium text-white mb-1"
          >
            Servicio
          </label>
          <select
            id="servicio"
            {...register("servicio")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          >
            {servicioFiltro.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="tipofiscalizacion"
            className="block text-sm font-medium text-white mb-1"
          >
            Tipo de Fiscalización
          </label>
          <select
            id="tipofiscalizacion"
            {...register("tipofiscalizacion")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          >
            {tipoFiscalizacion.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          type="submit"
        >
          Consulta
        </button>
        <div className="mb-4">
          <label
            htmlFor="filtrar"
            className="block text-sm font-medium text-white mb-1"
          >
            Filtrar
          </label>
          <input
            id="filtrar"
            type="text"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          />
        </div>
      </form>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#25362b] text-white">
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-semibold"
                >
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tabla.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  data-label={cell.column.columnDef.header}
                  className="px-4 py-3 border-b border-gray-200 text-black"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="bg-[#25362b] text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => tabla.firstPage()}
        >
          Primera página
        </button>
        <button
          className="bg-[#25362b] text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => {
            tabla.previousPage();
          }}
        >
          <AiFillCaretLeft />
        </button>
        <span className="px-4 py-2 text-gray-700">
          Página {tabla.getState().pagination.pageIndex + 1} de{" "}
          {tabla.getPageCount()}
        </span>
        <button
          className="bg-[#25362b] text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => {
            tabla.nextPage();
            console.log(tabla.getCanNextPage());
          }}
        >
          <AiFillCaretRight />
        </button>
        <button
          className="bg-[#25362b] text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => tabla.lastPage()}
        >
          Última página
        </button>
      </div>
    </>
  );
};
