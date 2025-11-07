"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"
import { format } from "date-fns"

// Función para generar IDs únicos compatible con todos los entornos
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Definir interfaces para los productos y el carrito
export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen?: string
}

export interface ProductoCarrito extends Producto {
  cantidad: number
}

export function useShoppingSimulation() {
  // Estados para gestionar productos y carrito
  const [productos, setProductos] = useLocalStorage<Producto[]>("productos", [])
  const [carrito, setCarrito] = useLocalStorage<ProductoCarrito[]>("carrito", [])
  const [totalCarrito, setTotalCarrito] = useState(0)
  
  // Estados para el formulario de producto
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productoActual, setProductoActual] = useState<Producto | null>(null)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  
  // Estado para la fecha de compra
  const [fechaCompra, setFechaCompra] = useState<Date>(new Date())
  
  // Calcular el total del carrito cuando cambia
  useEffect(() => {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    setTotalCarrito(total)
  }, [carrito])
  
  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const productoEnCarrito = carrito.find(item => item.id === producto.id)
    
    if (productoEnCarrito) {
      // Si ya está en el carrito, aumentar cantidad
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      ))
    } else {
      // Si no está en el carrito, agregarlo con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }
  
  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item.id !== id))
  }
  
  // Función para cambiar la cantidad de un producto en el carrito
  const cambiarCantidad = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id)
      return
    }
    
    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad } : item
    ))
  }
  
  // Función para abrir el diálogo de creación/edición de producto
  const abrirDialogoProducto = (producto?: Producto) => {
    if (producto) {
      // Modo edición
      setProductoActual(producto)
      setNombre(producto.nombre)
      setDescripcion(producto.descripcion)
      setPrecio(producto.precio.toString())
    } else {
      // Modo creación
      setProductoActual(null)
      setNombre("")
      setDescripcion("")
      setPrecio("")
    }
    
    setIsDialogOpen(true)
  }
  
  // Función para guardar un producto (crear o editar)
  const guardarProducto = () => {
    if (!nombre || !precio) return
    
    const precioNumerico = parseFloat(precio)
    if (isNaN(precioNumerico) || precioNumerico <= 0) return
    
    const nuevoProducto: Producto = {
      id: productoActual?.id || generateUniqueId(),
      nombre,
      descripcion,
      precio: precioNumerico
    }
    
    if (productoActual) {
      // Actualizar producto existente
      setProductos(productos.map(p => p.id === productoActual.id ? nuevoProducto : p))
      
      // Actualizar también en el carrito si existe
      if (carrito.some(item => item.id === productoActual.id)) {
        setCarrito(carrito.map(item => 
          item.id === productoActual.id 
            ? { ...nuevoProducto, cantidad: item.cantidad } 
            : item
        ))
      }
    } else {
      // Crear nuevo producto
      setProductos([...productos, nuevoProducto])
    }
    
    // Cerrar diálogo y limpiar formulario
    setIsDialogOpen(false)
    setProductoActual(null)
    setNombre("")
    setDescripcion("")
    setPrecio("")
  }
  
  // Función para eliminar un producto
  const eliminarProducto = (id: string) => {
    setProductos(productos.filter(p => p.id !== id))
    
    // Eliminar también del carrito si existe
    if (carrito.some(item => item.id === id)) {
      eliminarDelCarrito(id)
    }
  }
  
  // Función para finalizar la compra
  const finalizarCompra = () => {
    if (carrito.length === 0) return
    
    // Crear un evento de almacenamiento para comunicarse con otros componentes
    const compraEvent = new CustomEvent("nuevaCompra", {
      detail: {
        name: "Compra del mes",
        amount: totalCarrito,
        type: "expense",
        recurrence: "one-time",
        startDate: fechaCompra
      }
    })
    
    // Disparar el evento para que otros componentes lo capturen
    window.dispatchEvent(compraEvent)
    
    // Guardar en localStorage para que la página principal lo detecte
    const financialEntries = JSON.parse(localStorage.getItem("financialEntries") || "[]")
    const nuevaEntrada = {
      id: generateUniqueId(),
      name: "Compra del mes",
      amount: totalCarrito,
      type: "expense",
      recurrence: "one-time",
      startDate: fechaCompra
    }
    
    localStorage.setItem("financialEntries", JSON.stringify([...financialEntries, nuevaEntrada]))
    
    // Disparar evento de storage para que otros componentes se actualicen
    window.dispatchEvent(new Event("storage"))
    
    // Vaciar el carrito
    setCarrito([])
    
    // Mostrar mensaje de éxito
    alert("Compra registrada con éxito")
  }
  
  // Función para exportar productos y carrito
  const exportarProductos = () => {
    // Crear objeto con productos, carrito y fecha de compra
    const dataToExport = {
      productos,
      carrito,
      fechaCompra
    }
    
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `compra-simulada-${format(new Date(), "yyyy-MM-dd")}.json`
    
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }
  
  // Función para importar productos, carrito y fecha de compra
  const importarProductos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    fileReader.readAsText(event.target.files?.[0] as File, "UTF-8")
    fileReader.onload = e => {
      try {
        const content = e.target?.result as string
        const parsedData = JSON.parse(content)
        
        // Verificar si es el formato nuevo (objeto con productos, carrito y fechaCompra)
        if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
          let mensajes = []
          
          // Importar productos
          if (Array.isArray(parsedData.productos)) {
            const productosValidos = parsedData.productos.filter((item: any) => 
              typeof item === "object" && 
              item !== null && 
              typeof item.nombre === "string" && 
              typeof item.precio === "number"
            )
            
            if (productosValidos.length > 0) {
              // Asignar nuevos IDs para evitar conflictos
              const productosConId = productosValidos.map((p: any) => ({
                ...p,
                id: generateUniqueId()
              }))
              
              setProductos(productosConId)
              mensajes.push(`${productosConId.length} productos`)
            }
          }
          
          // Importar carrito
          if (Array.isArray(parsedData.carrito)) {
            const carritoValido = parsedData.carrito.filter((item: any) => 
              typeof item === "object" && 
              item !== null && 
              typeof item.nombre === "string" && 
              typeof item.precio === "number" &&
              typeof item.cantidad === "number"
            )
            
            if (carritoValido.length > 0) {
              // Asignar nuevos IDs para evitar conflictos y relacionarlos con los productos importados
              const carritoConId = carritoValido.map((p: any) => ({
                ...p,
                id: generateUniqueId()
              }))
              
              setCarrito(carritoConId)
              mensajes.push(`${carritoConId.length} productos en el carrito`)
            }
          }
          
          // Importar fecha de compra
          if (parsedData.fechaCompra) {
            try {
              const fecha = new Date(parsedData.fechaCompra)
              if (!isNaN(fecha.getTime())) {
                setFechaCompra(fecha)
                mensajes.push("fecha de compra")
              }
            } catch (e) {
              console.error("Error al importar fecha de compra:", e)
            }
          }
          
          // Los mensajes de importación ahora se manejan por los botones globales
          // if (mensajes.length > 0) {
          //   console.log(`Se importaron correctamente: ${mensajes.join(", ")}`)
          // } else {
          //   console.log("No se encontraron datos válidos para importar")
          // }
        } 
        // Formato antiguo (solo array de productos)
        else if (Array.isArray(parsedData)) {
          // Validar que cada elemento tenga la estructura correcta
          const productosValidos = parsedData.filter((item: any) => 
            typeof item === "object" && 
            item !== null && 
            typeof item.nombre === "string" && 
            typeof item.precio === "number"
          )
          
          if (productosValidos.length > 0) {
            // Asignar nuevos IDs para evitar conflictos
            const productosConId = productosValidos.map((p: any) => ({
              ...p,
              id: generateUniqueId()
            }))
            
            setProductos(productosConId)
            // toast.success(`Se importaron ${productosConId.length} productos correctamente`)
          } else {
            // toast.error("El archivo no contiene productos válidos")
          }
        } else {
          // toast.error("El formato del archivo no es válido")
        }
      } catch (error) {
        console.error("Error al importar datos:", error)
        // toast.error("Error al importar datos")
      }
    }
  }

  return {
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
    exportarProductos,
    importarProductos
  }
}