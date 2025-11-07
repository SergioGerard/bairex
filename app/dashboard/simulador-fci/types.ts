// Interfaz para los datos del simulador
export interface DatosSimulador {
  montosFijos: number
  montosPersonalizados: number[]
  modoInversion: 'fijo' | 'personalizado'
  tna: number
  meses: number
  reinversion: boolean
  reinversionCompuesta: boolean
}

// Interfaz para los resultados mensuales
export interface ResultadoMensual {
  mes: number
  montoInversion: number
  interesesMes: number
  reinversionesMes: number
  interesesReinversionMes: number
  saldoMes: number
  saldoAcumulado: number
}

// Interfaz para el resumen de resultados
export interface ResumenResultados {
  totalInvertido: number
  totalIntereses: number
  totalReinversiones: number
  totalInteresesReinversion: number
  saldoAcumulado: number
}

// Interfaz para los resultados completos
export interface ResultadosSimulacion {
  resultadosMensuales: ResultadoMensual[]
  resumen: ResumenResultados
}