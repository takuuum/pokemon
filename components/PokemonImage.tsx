'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pokemon } from '@/lib/pokemon';

interface PokemonImageProps {
  pokemon: Pokemon;
  size?: number;
  className?: string;
}

export default function PokemonImage({ pokemon, size = 256, className = '' }: PokemonImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentImage = isHovered && pokemon.imageGif ? pokemon.imageGif : pokemon.image;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={currentImage}
        alt={pokemon.nameJa}
        fill
        className="object-contain pixelated"
        sizes={`${size}px`}
      />
    </div>
  );
}
