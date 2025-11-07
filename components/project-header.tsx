'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BlurFade } from '@/components/magicui/blur-fade'

interface ProjectHeaderProps {
  project: {
    name: string
    logo: string
  }
  blurDelay: number
}

export default function ProjectHeader({ project, blurDelay }: ProjectHeaderProps) {
  const router = useRouter()

  const handleExit = () => {
    router.push('/#explora-trabajo')
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 lg:px-2">
      <BlurFade delay={blurDelay}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-secondary">
              <Image
                src={project.logo}
                alt={`${project.name} logo`}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <h1 className="text-md font-base">{project.name}</h1>
          </div>
          <div 
            className="text-muted-foreground text-xs cursor-pointer hover:text-foreground transition-colors"
            onClick={handleExit}
          >
            <span>SALIR </span>
            <kbd className="px-2 py-1 bg-muted rounded text-foreground">ESC</kbd>
          </div>
        </div>
      </BlurFade>
    </section>
  )
}