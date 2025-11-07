"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, AlertCircle, DollarSign, Calendar, Settings, TrendingUp } from "lucide-react"
// import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { DatosSimulador } from "../types"

interface SimuladorFCIFormProps {
  onCalcular: (datos: DatosSimulador) => void
  shouldUsePersonalizado?: boolean
}

export default function SimuladorFCIForm({ onCalcular, shouldUsePersonalizado }: SimuladorFCIFormProps) {
  const [modo, setModo] = useState<string | null>(null)
  
  // Estado para el modo de inversión (fijo o personalizado)
  const [modoInversion, setModoInversion] = useState<'fijo' | 'personalizado'>('fijo')
  
  // Estado para el monto fijo (modo fijo)
  const [montoFijo, setMontoFijo] = useState<string>('')
  
  // Estado para los montos personalizados (modo personalizado)
  const [montosPersonalizados, setMontosPersonalizados] = useState<string[]>(Array(36).fill(''))
  
  // Estado para la TNA
  const [tna, setTna] = useState<string>('')
  
  // Estado para la cantidad de meses - inicializar desde localStorage si existe
  const [meses, setMeses] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedPeriod = localStorage.getItem('simulador_period')
      if (savedPeriod && (savedPeriod === '12' || savedPeriod === '24' || savedPeriod === '36')) {
        return savedPeriod
      }
    }
    return '24' // fallback por defecto
  })
  
  // Estado para las opciones de reinversión
  const [reinversion, setReinversion] = useState<boolean>(false)
  const [reinversionCompuesta, setReinversionCompuesta] = useState<boolean>(false)
  
  // Estado para mostrar alerta de datos cargados
  const [mostrarAlerta, setMostrarAlerta] = useState<boolean>(false)
  
  // Función para cargar datos mensuales desde localStorage
  const loadMonthlyData = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const modo = urlParams.get('modo') || urlParams.get('mode')
    
    if (modo === 'monthly') {
       const monthlyAmounts = localStorage.getItem('simulador_monthly_amounts')
       const savedPeriod = localStorage.getItem('simulador_period')
       
       if (monthlyAmounts) {
         try {
           const amounts = JSON.parse(monthlyAmounts)
           if (Array.isArray(amounts)) {
             // Crear array de 36 meses inicializado en '0'
             const completedAmounts = Array(36).fill('0')
             
             // Llenar solo los meses necesarios según el período
             const periodLength = savedPeriod ? parseInt(savedPeriod) : amounts.length
             for (let i = 0; i < Math.min(periodLength, amounts.length, 36); i++) {
               completedAmounts[i] = amounts[i] || '0'
             }
             
             setMontosPersonalizados(completedAmounts)
             setModoInversion('personalizado')
             
             // Establecer el período según el período guardado
             if (savedPeriod) {
               const period = parseInt(savedPeriod)
               if (period <= 12) {
                 setMeses('12')
               } else if (period <= 24) {
                 setMeses('24')
               } else {
                 setMeses('36')
               }
             } else {
               // Fallback al comportamiento anterior
               const monthsWithData = amounts.filter(amount => parseFloat(amount) > 0).length
               if (monthsWithData <= 12) {
                 setMeses('12')
               } else if (monthsWithData <= 24) {
                 setMeses('24')
               } else {
                 setMeses('36')
               }
             }
             
             setMostrarAlerta(true)
           }
         } catch (error) {
           console.error('Error al cargar montos mensuales:', error)
         }
       }
     }
  }
  


  // Guardar período en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulador_period', meses)
    }
  }, [meses])

  // Obtener parámetros desde URL en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const modo = urlParams.get('modo') || urlParams.get('mode')
      setModo(modo)
      
      // Manejar parámetro 'amount' para establecer monto en modo personalizado
      const amount = urlParams.get('amount')
      if (amount) {
        // Crear array con el monto en el primer mes y ceros en el resto
        const nuevosMontos = Array(36).fill('0')
        nuevosMontos[0] = amount
        setMontosPersonalizados(nuevosMontos)
        setModoInversion('personalizado')
      }
      
      // Manejar modo monthly - cargar datos mensuales desde localStorage
      if (modo === 'monthly') {
        loadMonthlyData()
      }
    }
  }, [])
  
  // Escuchar cambios en localStorage para actualizar cuando se presionen los botones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Escuchar eventos de storage
      window.addEventListener('storage', loadMonthlyData)
      
      // También escuchar eventos personalizados para cambios en la misma pestaña
      window.addEventListener('localStorageUpdate', loadMonthlyData)
      
      return () => {
        window.removeEventListener('storage', loadMonthlyData)
        window.removeEventListener('localStorageUpdate', loadMonthlyData)
      }
    }
  }, [])
  
  // Cambiar a modo personalizado si se indica desde el componente padre
  useEffect(() => {
    if (shouldUsePersonalizado) {
      setModoInversion('personalizado')
    }
  }, [shouldUsePersonalizado])
  

  
  // Cargar valores guardados de localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTna = localStorage.getItem('simulador_tna')
      const savedMontos = localStorage.getItem('simulador_montos')
      const savedMeses = localStorage.getItem('simulador_meses')
      
      if (savedTna) {
        setTna(savedTna)
      }
      
      if (savedMeses) {
        setMeses(savedMeses)
      }
      
      if (savedMontos) {
        try {
          const montosGuardados = JSON.parse(savedMontos)
          setMontosPersonalizados(montosGuardados)
        } catch (error) {
          console.error('Error al cargar montos guardados:', error)
        }
      }
    }
  }, [])
  
  // Cargar datos de proyección si viene desde la tarjeta de potencial de inversión
  useEffect(() => {
    if (typeof window !== 'undefined' && (modo === 'porcentaje' || modo === 'completo')) {
      // Obtener proyecciones guardadas
      const proyeccionesStr = localStorage.getItem('proyecciones')
      
      if (proyeccionesStr) {
        try {
          const proyecciones = JSON.parse(proyeccionesStr)
          
          if (Array.isArray(proyecciones) && proyecciones.length > 0) {
            // Cambiar a modo personalizado
            setModoInversion('personalizado')
            
            // Obtener el porcentaje de inversión si es modo porcentaje
            let porcentaje = 100
            if (modo === 'porcentaje') {
              const metricsStr = localStorage.getItem('metrics')
              if (metricsStr) {
                try {
                  const metrics = JSON.parse(metricsStr)
                  if (metrics && metrics.potencialInversion) {
                    // Extraer solo los números del string, eliminando el símbolo '%'
                    const porcentajeStr = metrics.potencialInversion.replace('%', '').trim()
                    porcentaje = parseFloat(porcentajeStr)
                    
                    // Verificar que el porcentaje sea un número válido
                    if (isNaN(porcentaje)) {
                      console.error('El porcentaje de inversión no es un número válido:', metrics.potencialInversion)
                      porcentaje = 0
                    }
                    
                    console.log('Porcentaje de inversión cargado:', porcentaje)
                  }
                } catch (error) {
                  console.error('Error al procesar las métricas:', error)
                  porcentaje = 0
                }
              }
            }
            
            // Establecer montos personalizados basados en los balances mensuales
            const nuevosMontos = proyecciones.map(mes => {
              // Usar el balance mensual como base para la inversión
              const balance = mes.balance > 0 ? mes.balance : 0
              
              // Aplicar el porcentaje de inversión si estamos en modo porcentaje
              if (modo === 'porcentaje') {
                // Asegurarse de que el porcentaje sea un número válido
                const porcentajeNum = isNaN(porcentaje) ? 0 : porcentaje
                return (balance * (porcentajeNum / 100)).toFixed(2)
              } else {
                return balance.toFixed(2)
              }
            })
            
            // Actualizar estado
            setMontosPersonalizados(nuevosMontos)
            setMostrarAlerta(true)
            
            // Establecer la cantidad de meses según la proyección
            if (proyecciones.length <= 12) {
              setMeses('12')
            } else if (proyecciones.length <= 24) {
              setMeses('24')
            } else {
              setMeses('36')
            }
          }
        } catch (error) {
          console.error('Error al cargar proyecciones:', error)
        }
      }
    }
  }, [modo])
  
  // Manejar cambio en los montos personalizados
  const handleMontoPersonalizadoChange = (index: number, valor: string) => {
    const nuevosMontosPersonalizados = [...montosPersonalizados]
    nuevosMontosPersonalizados[index] = valor
    setMontosPersonalizados(nuevosMontosPersonalizados)
  }
  
  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obligatorios
    if ((modoInversion === 'fijo' && !montoFijo) || !tna) {
      alert('Por favor, complete todos los campos obligatorios')
      return
    }
    
    // Guardar valores en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulador_tna', tna)
      localStorage.setItem('simulador_montos', JSON.stringify(montosPersonalizados))
      localStorage.setItem('simulador_meses', meses)
    }
    
    // Preparar datos para el cálculo
    const datos: DatosSimulador = {
      montosFijos: parseFloat(montoFijo),
      montosPersonalizados: montosPersonalizados.map(m => parseFloat(m) || 0),
      modoInversion,
      tna: parseFloat(tna),
      meses: parseInt(meses),
      reinversion,
      reinversionCompuesta
    }
    
    // Llamar a la función de cálculo
    onCalcular(datos)
  }
  
  return (
    <div className="space-y-6">
      {mostrarAlerta && (
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-950 dark:to-blue-900">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Se han cargado los montos de inversión desde la proyección financiera.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Configuración Principal */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuración de la Simulación
          </CardTitle>
          <CardDescription>
            Configure los parámetros principales de su inversión en FCI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Configuración básica en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-sm text-muted-foreground">RENTABILIDAD</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tna">Tasa Nominal Anual (TNA) %</Label>
                  <Input
                    id="tna"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={tna}
                    onChange={(e) => setTna(e.target.value)}
                    placeholder="Ej: 45.5"
                    className="bg-background/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-sm text-muted-foreground">PERÍODO</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meses">Período de inversión</Label>
                  <Select value={meses} onValueChange={setMeses}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Seleccione el período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 meses (1 año)</SelectItem>
                      <SelectItem value="24">24 meses (2 años)</SelectItem>
                      <SelectItem value="36">36 meses (3 años)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Configuración de reinversión */}
            <Card className="bg-muted/20 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-purple-600" />
                  Opciones de Reinversión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="reinversion" className="font-medium">Reinversión</Label>
                    <p className="text-xs text-muted-foreground">Reinvertir el capital de meses anteriores en los siguientes</p>
                  </div>
                  <Switch
                    id="reinversion"
                    checked={reinversion}
                    onCheckedChange={setReinversion}
                  />
                </div>
                
                {reinversion && (
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border-l-4 border-purple-500">
                    <div className="space-y-1">
                      <Label htmlFor="reinversion-compuesta" className="font-medium">
                        Reinversión Compuesta
                      </Label>
                      <p className="text-xs text-muted-foreground">Reinvertir también los intereses generados</p>
                    </div>
                    <Switch
                      id="reinversion-compuesta"
                      checked={reinversionCompuesta}
                      onCheckedChange={setReinversionCompuesta}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>

      {/* Configuración de Inversión */}
      <Card className="bg-gradient-to-b from-[hsl(0,0%,100%)] to-[hsl(220,16%,96%)] 
                     dark:from-[hsl(228,16%,10%)] dark:to-[hsl(228,16%,6%)] 
                     transition-all duration-300 
                     hover:shadow-[0_0_6px_1px_hsl(220,16%,80%)] 
                     dark:hover:shadow-[0_0_6px_1px_hsl(228,16%,25%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración de Inversión
          </CardTitle>
          <CardDescription>
            Defina los montos que invertirá mensualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Configuración de modo de inversión */}
            <Tabs value={modoInversion} onValueChange={(value) => setModoInversion(value as 'fijo' | 'personalizado')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="fijo" className="data-[state=active]:bg-background text-[clamp(12px,2vw,14px)]">Monto Fijo</TabsTrigger>
                <TabsTrigger value="personalizado" className="data-[state=active]:bg-background text-[clamp(12px,2vw,14px)]">Montos Personalizados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fijo" className="space-y-4 mt-6">
                <div className="p-4 bg-muted/20 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-sm">MONTO FIJO MENSUAL</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montoFijo">Monto mensual a invertir</Label>
                    <Input
                      id="montoFijo"
                      type="number"
                      min="0"
                      step="0.01"
                      value={montoFijo}
                      onChange={(e) => setMontoFijo(e.target.value)}
                      placeholder="Ej: 50000"
                      className="bg-background/50 text-lg font-medium"
                      required={modoInversion === 'fijo'}
                    />
                    <p className="text-xs text-muted-foreground">
                      Este monto se invertirá todos los meses durante el período seleccionado
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="personalizado" className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Ingrese el monto a invertir para cada mes</p>
                  <div className="grid grid-cols-1 msm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mlg:grid-cols-5 lg:grid-cols-6 gap-4">
                    {montosPersonalizados.slice(0, parseInt(meses)).map((monto, index) => (
                      <div key={index} className="space-y-1">
                        <Label htmlFor={`monto-${index}`}>Mes {index + 1}</Label>
                        <Input 
                          id={`monto-${index}`} 
                          type="number" 
                          placeholder="Monto" 
                          value={monto} 
                          onChange={(e) => handleMontoPersonalizadoChange(index, e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Botón de cálculo */}
            <Button type="submit" className="text-background w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Inversión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}