import { type Actualizacion } from "@/lib/types"
import UpdateCard from "@/components/update-card"

interface UpdateListProps {
  actualizaciones: Actualizacion[]
}

export default function UpdateList({ actualizaciones }: UpdateListProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {actualizaciones.map((actualizacion, index) => (
        <UpdateCard
          key={actualizacion.version}
          actualizacion={actualizacion}
          isLast={index === actualizaciones.length - 1}
        />
      ))}
    </div>
  )
}