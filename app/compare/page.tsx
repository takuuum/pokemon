import { getPokemonListWithJapanese } from '@/lib/pokemon';
import PokemonCompareClient from '@/components/PokemonCompareClient';
import ComparisonHistory from '@/components/ComparisonHistory';
import Sidebar from '@/components/Sidebar';

export default async function ComparePage() {
  const pokemonList = await getPokemonListWithJapanese(151);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
              ポケモン比較
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              2匹のポケモンを比較して、どちらが強いかを確認できます
            </p>
          </div>
          <PokemonCompareClient pokemonList={pokemonList} />
          <ComparisonHistory />
        </div>
      </div>
    </main>
  );
}
