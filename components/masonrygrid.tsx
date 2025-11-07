import React from 'react';
import BlurFade from "@/components/magicui/blur-fade"; // Asegúrate de que BlurFade esté configurado
import Image from "next/image";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.1; // Ajusta este valor según tu diseño

const MasonryGrid: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-3xl" id="photos">
      <div className="columns-2 sm:columns-3 rounded-lg">
        {DATA.masonryImages.map((image, index) => (
          <BlurFade key={image.id} delay={BLUR_FADE_DELAY * index}>
            <div
              className={`relative overflow-hidden rounded-lg transition-transform duration-300 sm:hover:scale-110
              ${index === DATA.masonryImages.length - 1 ? 'hidden sm:block' : ''}`}
            >
              <Image
                alt={image.alt}
                src={image.src}
                width={300}
                height={300}
                loading={index === DATA.masonryImages.length - 1 ? "lazy" : "eager"}
                priority={index === DATA.masonryImages.length - 1 ? false : true}
                className="rounded-lg aspect-w-16 aspect-h-9 mb-4 w-full object-cover transition-transform duration-300"
              />
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default MasonryGrid;
