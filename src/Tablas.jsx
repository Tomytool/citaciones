import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";
import { fetchTipificaciones } from "./services/api";
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
  // Estado local para los filtros de la "Consulta"
  const [params, setParams] = useState({
    responsable: "TODOS",
    servicio: "TODOS",
    tipofiscalizacion: "TODOS",
  });

  // react-hook-form para el formulario
  const { register, handleSubmit, reset } = useForm({
    defaultValues: params,
  });

  // Filtro global de la tabla
  const [filtroGlobal, setFiltroGlobal] = useState("");

  // TanStack Query: Gestión de datos del servidor
  // qk-hierarchical-organization: ['tipificaciones']
  // qk-include-dependencies: no aplica aquí ya que filtramos localmente los datos estáticos,
  // pero si fuera una API real, incluiríamos params en la key.
  const {
    data: todosLosDatos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tipificaciones"],
    queryFn: fetchTipificaciones,
  });

  // Lógica de filtrado (Memoizada para rendimiento)
  // perf-select-transform: Podríamos usar select en useQuery, pero como el filtrado
  // depende de un estado local 'params', lo hacemos aquí con useMemo.
  const datosFiltrados = useMemo(() => {
    if (
      params.responsable === "TODOS" &&
      params.servicio === "TODOS" &&
      params.tipofiscalizacion === "TODOS"
    ) {
      return todosLosDatos;
    }

    return todosLosDatos.filter((item) => {
      return (
        (params.responsable === "TODOS" ||
          item.RESPONSABLE === params.responsable) &&
        (params.servicio === "TODOS" || item.SERVICIO === params.servicio) &&
        (params.tipofiscalizacion === "TODOS" ||
          item.TIPOFISCALIZACION === params.tipofiscalizacion)
      );
    });
  }, [todosLosDatos, params]);

  const columnas = [
    { accessorKey: "CODIGO", header: "Codigo" },
    { accessorKey: "RESPONSABLE", header: "Responsable" },
    { accessorKey: "SERVICIO", header: "Servicio" },
    { accessorKey: "TIPOFISCALIZACION", header: "Tipo Fiscalizacion" },
    { accessorKey: "TIPIFICACION", header: "Tipificacion" },
    { accessorKey: "DESCRIPCIONNORMA", header: "Descripcion Norma" },
  ];

  const tabla = useReactTable({
    columns: columnas,
    data: datosFiltrados,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtroGlobal,
    },
    onGlobalFilterChange: setFiltroGlobal,
  });

  const onSubmit = (data) => {
    setParams(data);
  };

  const handleReset = () => {
    const defaultParams = {
      responsable: "TODOS",
      servicio: "TODOS",
      tipofiscalizacion: "TODOS",
    };
    reset(defaultParams);
    setParams(defaultParams);
    setFiltroGlobal("");
  };

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600 font-bold">
        Error al cargar los datos. Por favor, intente de nuevo.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-gray-300 min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[#25362b] to-slate-500 tracking-tight mb-3">
          Tipificaciones 2025
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto px-4">
          Tipificaciones de la División de Fiscalización de Transporte
        </p>
      </div>

      <form
        className="bg-gray-400 p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto mb-12 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Adorno decorativo superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#25362b] to-[#405c4a]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div>
            <label
              htmlFor="responsable"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Responsable
            </label>
            <select
              id="responsable"
              {...register("responsable")}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#25362b]/20 focus:border-[#25362b] text-slate-800 bg-slate-50 hover:bg-white transition-all outline-none"
            >
              {responsableFiltro.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="servicio"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Servicio
            </label>
            <select
              id="servicio"
              {...register("servicio")}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#25362b]/20 focus:border-[#25362b] text-slate-800 bg-slate-50 hover:bg-white transition-all outline-none"
            >
              {servicioFiltro.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tipofiscalizacion"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Tipo de Fiscalización
            </label>
            <select
              id="tipofiscalizacion"
              {...register("tipofiscalizacion")}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#25362b]/20 focus:border-[#25362b] text-slate-800 bg-slate-50 hover:bg-white transition-all outline-none"
            >
              {tipoFiscalizacion.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filtrar"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Búsqueda rápida
            </label>
            <input
              id="filtrar"
              type="text"
              placeholder="Ej. Cuidado infantil, Racion..."
              value={filtroGlobal}
              onChange={(e) => setFiltroGlobal(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#25362b]/20 focus:border-[#25362b] text-slate-800 bg-slate-50 hover:bg-white transition-all outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <button
            className="flex-1 bg-[#25362b] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[#1a261e] transition-all shadow-md hover:shadow-lg active:scale-[0.98] min-h-[44px]"
            type="submit"
          >
            Aplicar Filtros
          </button>
          <button
            className="flex-1 bg-white text-slate-600 border border-slate-200 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-[0.98] min-h-[44px]"
            type="button"
            onClick={handleReset}
          >
            Reiniciar
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25362b]"></div>
          <p className="mt-4 text-[#25362b] font-medium">
            Cargando tipificaciones...
          </p>
        </div>
      ) : (
        <div className="w-full pl-[5%] md:pl-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tabla.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={`px-5 py-3.5 border-b border-slate-50 last:border-b-0 flex flex-col sm:flex-row sm:justify-between items-start gap-1.5 sm:gap-4 ${cell.column.id === "CODIGO" ? "bg-slate-50/50 sm:items-center" : ""}`}
                  >
                    <span className="font-bold text-slate-400 text-xs uppercase tracking-wider shrink-0 text-left sm:pt-0.5">
                      {cell.column.columnDef.header}
                    </span>

                    <div
                      className={`text-left sm:text-right flex-1 wrap-break-word flex flex-col justify-start items-start sm:justify-end sm:items-end w-full sm:w-auto ${cell.column.id === "CODIGO" ? "mt-1 sm:mt-0" : "text-slate-700 font-bold sm:font-medium text-sm"}`}
                    >
                      {cell.column.id === "CODIGO" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-[#25362b] font-bold tracking-wide text-base sm:text-sm z-10 w-fit">
                          #
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      ) : (
                        <span>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase tracking-tighter shadow-sm active:scale-[0.98]"
              onClick={() => tabla.firstPage()}
              disabled={!tabla.getCanPreviousPage()}
            >
              Inicio
            </button>
            <button
              className="flex-1 sm:flex-none flex justify-center items-center bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
              onClick={() => tabla.previousPage()}
              disabled={!tabla.getCanPreviousPage()}
            >
              <AiFillCaretLeft size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100">
            <span className="text-sm text-slate-500 font-medium">
              Página{" "}
              <span className="text-slate-800 font-bold mx-1">
                {tabla.getState().pagination.pageIndex + 1}
              </span>{" "}
              de{" "}
              <span className="text-slate-800 font-bold ml-1">
                {tabla.getPageCount()}
              </span>
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none flex justify-center items-center bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
              onClick={() => tabla.nextPage()}
              disabled={!tabla.getCanNextPage()}
            >
              <AiFillCaretRight size={16} />
            </button>
            <button
              className="flex-1 sm:flex-none bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase tracking-tighter shadow-sm active:scale-[0.98]"
              onClick={() => tabla.lastPage()}
              disabled={!tabla.getCanNextPage()}
            >
              Fin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
