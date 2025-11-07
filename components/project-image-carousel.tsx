import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

interface ProjectImageCarouselProps {
  images: string[]
  projectName: string
  className?: string
}

export default function ProjectImageCarousel({ 
  images, 
  projectName, 
  className = "" 
}: ProjectImageCarouselProps) {
  return (
    <div className={`w-full ${className}`}>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image: string, index: number) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-4/5 lg:basis-3/5 xl:basis-1/2">
              <Card className="bg-secondary/50 p-1 border border-border overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-[4/2.82] overflow-hidden rounded-sm">
                    <Image
                      src={image}
                      alt={`${projectName} imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  )
}