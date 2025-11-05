import { getPokemonList, getPokemon } from '@/lib/pokemon';
import PokemonDiagnosis from '@/components/PokemonDiagnosis';
import SidebarSimple from '@/components/SidebarSimple';

export default async function DiagnosisPage() {
  // 全ポケモンのデータを取得（診断に使用）
  const pokemonList = await getPokemonList(151);
  const allPokemon = await Promise.all(
    pokemonList.map((pokemon) => getPokemon(pokemon.name))
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SidebarSimple />
      <div className="md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
              ポケモン診断
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              質問に答えて、あなたにぴったりのポケモンを見つけましょう！
            </p>
          </div>
          <PokemonDiagnosis pokemonList={allPokemon} />
        </div>
      </div>
    </main>
  );
}
