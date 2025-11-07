import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type Actualizacion } from "@/lib/types"

interface UpdateCardProps {
  actualizacion: Actualizacion
  isLast: boolean
}

export default function UpdateCard({ actualizacion, isLast }: UpdateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{actualizacion.titulo}</CardTitle>
            <CardDescription>
              Versión {actualizacion.version} - {actualizacion.fecha}
            </CardDescription>
          </div>
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
            v{actualizacion.version}
          </span>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {actualizacion.descripcion.map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {!isLast && (
        <div className="px-6 pb-4">
        </div>
      )}
    </Card>
  )
}