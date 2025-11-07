"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlurFade } from "@/components/magicui/blur-fade"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  tipoDepartamento: string
  zonaPreferida: string
  nombre: string
  email: string
  telefono: string
}

const tiposDepartamento = [
  "1 ambiente",
  "2 ambientes", 
  "3 ambientes",
  "4+ ambientes",
  "Loft",
  "Duplex"
]

const zonasPreferidas = [
  "Puerto Madero",
  "Palermo",
  "Belgrano",
  "Recoleta",
  "Villa Crespo",
  "Núñez",
  "Barracas",
  "San Telmo"
]

export function ContactoSection() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    tipoDepartamento: "",
    zonaPreferida: "",
    nombre: "",
    email: "",
    telefono: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  const canProceedStep1 = formData.tipoDepartamento !== ""
  const canProceedStep2 = formData.zonaPreferida !== ""
  const canSubmit = formData.nombre !== "" && formData.email !== "" && formData.telefono !== ""

  if (isSubmitted) {
    return (
      <section id="contacto" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <BlurFade delay={0.1}>
              <Card className="text-center border border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
                <CardContent className="p-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
                    ¡Mensaje enviado exitosamente!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-6">
                    Gracias por tu interés. Nos pondremos en contacto contigo dentro de las próximas 24 horas.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false)
                      setCurrentStep(1)
                      setFormData({
                        tipoDepartamento: "",
                        zonaPreferida: "",
                        nombre: "",
                        email: "",
                        telefono: ""
                      })
                    }}
                    variant="outline"
                  >
                    Enviar otro mensaje
                  </Button>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Contactanos
              <span className="block text-primary">hoy mismo</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Completá el formulario y recibí información personalizada sobre nuestros desarrollos
            </p>
          </div>
        </BlurFade>

        <div className="max-w-2xl mx-auto">
          <BlurFade delay={0.2}>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-center">Quiero más información</CardTitle>
                
                {/* Progress indicator */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div key={i} className="flex items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          i + 1 <= currentStep 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </div>
                        {i < totalSteps - 1 && (
                          <div className={cn(
                            "w-8 h-0.5 mx-2 transition-colors",
                            i + 1 < currentStep ? "bg-primary" : "bg-muted"
                          )} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Step 1: Tipo de departamento */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-medium mb-4 block">
                        ¿Qué tipo de departamento te interesa?
                      </Label>
                      <Select 
                        value={formData.tipoDepartamento} 
                        onValueChange={(value) => setFormData({...formData, tipoDepartamento: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona el tipo de departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDepartamento.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleNext}
                        disabled={!canProceedStep1}
                        className="gap-2"
                      >
                        Siguiente <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Zona preferida */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-medium mb-4 block">
                        ¿En qué zona te gustaría vivir?
                      </Label>
                      <Select 
                        value={formData.zonaPreferida} 
                        onValueChange={(value) => setFormData({...formData, zonaPreferida: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona tu zona preferida" />
                        </SelectTrigger>
                        <SelectContent>
                          {zonasPreferidas.map(zona => (
                            <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        onClick={handlePrev}
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                      </Button>
                      <Button 
                        onClick={handleNext}
                        disabled={!canProceedStep2}
                        className="gap-2"
                      >
                        Siguiente <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Datos personales */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-medium mb-4 block">
                        Datos de contacto
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nombre">Nombre completo</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                            placeholder="+54 11 1234-5678"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        onClick={handlePrev}
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={!canSubmit || isLoading}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? "Enviando..." : "Quiero más información"}
                        {!isLoading && <CheckCircle className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}