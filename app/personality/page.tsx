import { getPokemonList, getPokemon } from '@/lib/pokemon';
import PersonalityDiagnosis from '@/components/PersonalityDiagnosis';
import Sidebar from '@/components/Sidebar';

export default async function PersonalityPage() {
  // 全ポケモンのデータを取得（診断に使用）
  const pokemonList = await getPokemonList(151);
  const allPokemon = await Promise.all(
    pokemonList.map((pokemon) => getPokemon(pokemon.name))
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
              性格診断
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              あなたの性格を診断して、ぴったりのポケモンを見つけましょう！
            </p>
          </div>
          <PersonalityDiagnosis pokemonList={allPokemon} />
        </div>
      </div>
    </main>
  );
}
