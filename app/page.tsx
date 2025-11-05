import { getPokemonList, getPokemon } from '@/lib/pokemon';
import PokemonSearchClient from '@/components/PokemonSearchClient';

export default async function Home() {
  const pokemonList = await getPokemonList(151);

  // 全てのポケモンデータを取得（検索機能のため）
  const allPokemon = await Promise.all(
    pokemonList.map((pokemon) => getPokemon(pokemon.name))
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center mb-8 pt-8 md:pt-8 md:ml-64">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
          ポケモン図鑑
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          全{allPokemon.length}匹のポケモンを表示
        </p>
      </div>
      <PokemonSearchClient pokemonList={allPokemon} />
    </main>
  );
}
