'use client';

import { useState } from 'react';
import { Pokemon } from '@/lib/pokemon';
import SearchBar from './SearchBar';
import PokemonGrid from './PokemonGrid';
import Sidebar from './Sidebar';

interface PokemonSearchClientProps {
  pokemonList: Pokemon[];
}

export default function PokemonSearchClient({ pokemonList }: PokemonSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="flex">
      <Sidebar
        pokemonCount={pokemonList.length}
        onTypeFilter={setSelectedType}
        selectedType={selectedType}
      />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <SearchBar onSearch={setSearchQuery} />
          <PokemonGrid
            pokemonList={pokemonList}
            searchQuery={searchQuery}
            selectedType={selectedType}
          />
        </div>
      </div>
    </div>
  );
}
