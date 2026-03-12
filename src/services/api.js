import datos from "../assets/tipificaciones.json";

/**
 * Simula una llamada a API para obtener las tipificaciones.
 * Cumple con la práctica qk-array-structure al retornar los datos 
 * para ser consumidos por un query key de tipo array.
 */
export const fetchTipificaciones = async () => {
  // Simulamos un pequeño retraso para ver los estados de carga
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(datos);
    }, 500);
  });
};
