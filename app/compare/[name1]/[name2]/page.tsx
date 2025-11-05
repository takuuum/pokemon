import { getPokemon } from '@/lib/pokemon';
import { notFound } from 'next/navigation';
import PokemonComparison from '@/components/PokemonComparison';
import SidebarSimple from '@/components/SidebarSimple';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    name1: string;
    name2: string;
  }>;
}

export default async function CompareDetail({ params }: PageProps) {
  const { name1, name2 } = await params;

  let pokemon1, pokemon2;
  try {
    [pokemon1, pokemon2] = await Promise.all([
      getPokemon(name1),
      getPokemon(name2),
    ]);
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SidebarSimple />
      <div className="md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/compare"
            className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← 比較ページに戻る
          </Link>
          <PokemonComparison pokemon1={pokemon1} pokemon2={pokemon2} />
        </div>
      </div>
    </main>
  );
}
