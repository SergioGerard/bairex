"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, ShoppingCart, Edit } from "lucide-react"
import { useShoppingSimulation } from "@/hooks/use-shopping-simulation"
import { BlurFade } from "@/components/magicui/blur-fade"

// Skeleton Components
function ProductCardSkeleton() {
  return (
    <Card className="group flex flex-col h-full bg-gradient-to-b from-card to-card/80 border-border/50">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex justify-end items-start mb-2">
          <div className="flex gap-1 flex-shrink-0">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

function CartHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-lg p-4 lg:p-6">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="min-w-0">
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-[180px] rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function CartItemSkeleton() {
  return (
    <Card className="bg-gradient-to-r from-card to-card/80 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="text-center">
            <Skeleton className="h-3 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SimulacionCompraSkeleton({ activeTab }: { activeTab: string }) {
  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
      
      {/* Tabs and Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      
      {/* Content based on active tab */}
      {activeTab === "productos" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <CartHeaderSkeleton />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function SimulacionCompraPage() {
  // Estado para controlar las pestañas
  const [activeTab, setActiveTab] = useState("productos")
  
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  // Usar el hook personalizado para toda la lógica de la simulación de compra
  const {
    // Estados
    productos,
    carrito,
    totalCarrito,
    isDialogOpen,
    setIsDialogOpen,
    productoActual,
    nombre,
    setNombre,
    descripcion,
    setDescripcion,
    precio,
    setPrecio,
    fechaCompra,
    setFechaCompra,
    
    // Funciones
    agregarAlCarrito,
    eliminarDelCarrito,
    cambiarCantidad,
    abrirDialogoProducto,
    guardarProducto,
    eliminarProducto,
    finalizarCompra,
  } = useShoppingSimulation()
  
  // Toda la lógica de negocio ahora está en el hook useShoppingSimulation
  
  // Mostrar skeleton mientras se hidrata
  if (!isHydrated) {
    return <SimulacionCompraSkeleton activeTab={activeTab} />
  }
  
  return (
    <div className="mx-auto p-4">
      <BlurFade delay={0.1}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-card border border-border rounded-md p-2 dark:bg-card dark:border-border dark:sidebar-border">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Simulación de Compra</h1>
          </div>
        </div>
      </BlurFade>
      
      <BlurFade delay={0.2}>
        <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <div className="flex justify-between items-center">
          <TabsList className="w-fit">
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="carrito">
              Carrito ({carrito.length})
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => abrirDialogoProducto()} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </div>
        
        <TabsContent value="productos" className="space-y-6">
          {productos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tu tienda está vacía</h3>
              <p className="text-muted-foreground mb-6">Comienza agregando productos para crear tu simulación de compra</p>
              <Button onClick={() => abrirDialogoProducto()} size="lg" className="text-background">
                <Plus className="mr-2 h-5 w-5" /> Crear Primer Producto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
              {productos.map(producto => (
                <Card key={producto.id} className="group flex flex-col h-full bg-gradient-to-b from-card to-card/80 border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex justify-end items-start mb-2">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 hover:bg-primary/10"
                          onClick={() => abrirDialogoProducto(producto)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <CardTitle className="text-base font-semibold leading-tight line-clamp-2">{producto.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{producto.descripcion}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-primary">${producto.precio.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground">c/u</span>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 text-sm" 
                          onClick={() => agregarAlCarrito(producto)}
                          size="sm"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="carrito" className="min-h-0">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-lg p-4 lg:p-6">
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg lg:text-xl font-bold">Carrito de Compras</h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} • Total: ${totalCarrito.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium whitespace-nowrap">Fecha:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[180px] justify-start text-left font-normal text-sm"
                        >
                          {fechaCompra ? format(fechaCompra, "dd/MM/yyyy") : <span>Seleccionar</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fechaCompra}
                          onSelect={(date) => date && setFechaCompra(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button 
                    onClick={finalizarCompra} 
                    disabled={carrito.length === 0}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </div>
            </div>
            
            {carrito.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
                <p className="text-muted-foreground mb-6">Agrega productos desde la tienda para comenzar tu compra</p>
                <Button onClick={() => setActiveTab("productos")} size="lg" className="text-background">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorar Productos
                </Button>
              </div>
            ) : (
              <div className="space-y-4 min-h-0">
                {/* Vista de escritorio */}
                <div className="hidden lg:block">
                  <div className="bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 lg:gap-4 p-3 lg:p-4 bg-muted/30 font-medium text-xs lg:text-sm">
                      <div className="col-span-5">Producto</div>
                      <div className="col-span-2 text-center">Precio</div>
                      <div className="col-span-2 text-center">Cantidad</div>
                      <div className="col-span-2 text-center">Subtotal</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {carrito.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 lg:gap-4 p-3 lg:p-4 border-t border-border/50 items-center hover:bg-muted/20 transition-colors">
                          <div className="col-span-5 min-w-0">
                            <div className="flex items-center gap-2 lg:gap-3">
                              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-1.5 lg:p-2 flex-shrink-0">
                                <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm lg:text-base truncate">{item.nombre}</div>
                                <div className="text-xs lg:text-sm text-muted-foreground line-clamp-1">{item.descripcion}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 text-center font-medium text-sm">${item.precio.toFixed(2)}</div>
                          <div className="col-span-2 text-center">
                            <div className="flex items-center justify-center gap-1 lg:gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7 lg:h-8 lg:w-8 hover:bg-primary/10"
                                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              >
                                -
                              </Button>
                              <span className="w-6 lg:w-8 text-center font-medium text-sm">{item.cantidad}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7 lg:h-8 lg:w-8 hover:bg-primary/10"
                                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="col-span-2 text-center font-bold text-primary text-sm">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </div>
                          <div className="col-span-1 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 lg:h-8 lg:w-8 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => eliminarDelCarrito(item.id)}
                            >
                              <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 lg:gap-4 p-3 lg:p-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="col-span-9 text-right font-bold text-base lg:text-lg">Total:</div>
                      <div className="col-span-2 text-center font-bold text-lg lg:text-xl text-primary">${totalCarrito.toFixed(2)}</div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* Vista tablet */}
                <div className="hidden md:block lg:hidden">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {carrito.map(item => (
                      <Card key={item.id} className="bg-gradient-to-r from-card to-card/80 border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 flex-shrink-0">
                                <ShoppingCart className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{item.nombre}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">{item.descripcion}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                              onClick={() => eliminarDelCarrito(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Precio</div>
                              <div className="font-medium">${item.precio.toFixed(2)}</div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-medium">{item.cantidad}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Subtotal</div>
                              <div className="font-bold text-primary">${(item.precio * item.cantidad).toFixed(2)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mt-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-primary">${totalCarrito.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Vista móvil */}
                <div className="md:hidden space-y-3 max-h-80 overflow-y-auto">
                  {carrito.map(item => (
                    <Card key={item.id} className="bg-gradient-to-r from-card to-card/80 border-border/50">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-1.5 flex-shrink-0">
                              <ShoppingCart className="w-3 h-3 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate">{item.nombre}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{item.descripcion}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            onClick={() => eliminarDelCarrito(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Precio: </span>
                            <span className="font-medium">${item.precio.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center font-medium text-xs">{item.cantidad}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Subtotal</div>
                            <div className="font-bold text-primary text-sm">${(item.precio * item.cantidad).toFixed(2)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Total para móvil */}
                <div className="md:hidden">
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold text-primary">${totalCarrito.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para crear/editar productos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{productoActual ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {productoActual 
                ? "Modifica los detalles del producto seleccionado." 
                : "Completa los detalles para crear un nuevo producto."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio
              </Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="text-background" onClick={guardarProducto}>
              {productoActual ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </BlurFade>
    </div>
  )
}