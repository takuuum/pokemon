'use client';

import { useState } from 'react';
import { Pokemon } from '@/lib/pokemon';
import Link from 'next/link';
import Image from 'next/image';
import PokemonImage from './PokemonImage';

interface PokemonDiagnosisProps {
  pokemonList: Pokemon[];
}

type DiagnosisMode = 'simple' | 'detailed' | null;

interface Answer {
  favoriteType: string | null;
  personality: string | null;
  preference: string | null;
  size: string | null;
  importantStat: string | null;
  battleStyle: string | null;
  evolutionStage: string | null;
  weightPreference: string | null;
  rarity: string | null;
  purpose: string | null;
}

// 簡易診断の質問（5問）
const simpleQuestions = [
  {
    id: 'favoriteType',
    question: '好きなタイプは？',
    options: [
      { value: 'fire', label: 'ほのお' },
      { value: 'water', label: 'みず' },
      { value: 'grass', label: 'くさ' },
      { value: 'electric', label: 'でんき' },
      { value: 'psychic', label: 'エスパー' },
      { value: 'ice', label: 'こおり' },
      { value: 'dragon', label: 'ドラゴン' },
      { value: 'dark', label: 'あく' },
      { value: 'fairy', label: 'フェアリー' },
      { value: 'normal', label: 'ノーマル' },
    ],
  },
  {
    id: 'personality',
    question: 'あなたの性格は？',
    options: [
      { value: 'aggressive', label: '攻撃的' },
      { value: 'defensive', label: '防御的' },
      { value: 'balanced', label: 'バランス型' },
      { value: 'speed', label: '素早い行動派' },
      { value: 'special', label: '特殊能力重視' },
    ],
  },
  {
    id: 'preference',
    question: 'どのようなポケモンが好きですか？',
    options: [
      { value: 'cute', label: 'かわいい' },
      { value: 'cool', label: 'かっこいい' },
      { value: 'strong', label: '強そう' },
      { value: 'mysterious', label: '神秘的' },
      { value: 'elegant', label: '優雅' },
    ],
  },
  {
    id: 'size',
    question: 'ポケモンの大きさは？',
    options: [
      { value: 'small', label: '小さい（0.3m〜0.5m）' },
      { value: 'medium', label: '中くらい（0.5m〜1.5m）' },
      { value: 'large', label: '大きい（1.5m以上）' },
    ],
  },
  {
    id: 'importantStat',
    question: 'どのステータスが重要ですか？',
    options: [
      { value: 'hp', label: 'HP（体力）' },
      { value: 'attack', label: '攻撃' },
      { value: 'defense', label: '防御' },
      { value: 'special-attack', label: '特攻' },
      { value: 'special-defense', label: '特防' },
      { value: 'speed', label: '素早さ' },
    ],
  },
];

// 詳細診断の質問（10問）
const detailedQuestions = [
  {
    id: 'favoriteType',
    question: '好きなタイプは？',
    options: [
      { value: 'fire', label: 'ほのお' },
      { value: 'water', label: 'みず' },
      { value: 'grass', label: 'くさ' },
      { value: 'electric', label: 'でんき' },
      { value: 'psychic', label: 'エスパー' },
      { value: 'ice', label: 'こおり' },
      { value: 'dragon', label: 'ドラゴン' },
      { value: 'dark', label: 'あく' },
      { value: 'fairy', label: 'フェアリー' },
      { value: 'normal', label: 'ノーマル' },
    ],
  },
  {
    id: 'personality',
    question: 'あなたの性格は？',
    options: [
      { value: 'aggressive', label: '攻撃的' },
      { value: 'defensive', label: '防御的' },
      { value: 'balanced', label: 'バランス型' },
      { value: 'speed', label: '素早い行動派' },
      { value: 'special', label: '特殊能力重視' },
    ],
  },
  {
    id: 'preference',
    question: 'どのようなポケモンが好きですか？',
    options: [
      { value: 'cute', label: 'かわいい' },
      { value: 'cool', label: 'かっこいい' },
      { value: 'strong', label: '強そう' },
      { value: 'mysterious', label: '神秘的' },
      { value: 'elegant', label: '優雅' },
    ],
  },
  {
    id: 'size',
    question: 'ポケモンの大きさは？',
    options: [
      { value: 'small', label: '小さい（0.3m〜0.5m）' },
      { value: 'medium', label: '中くらい（0.5m〜1.5m）' },
      { value: 'large', label: '大きい（1.5m以上）' },
    ],
  },
  {
    id: 'importantStat',
    question: 'どのステータスが重要ですか？',
    options: [
      { value: 'hp', label: 'HP（体力）' },
      { value: 'attack', label: '攻撃' },
      { value: 'defense', label: '防御' },
      { value: 'special-attack', label: '特攻' },
      { value: 'special-defense', label: '特防' },
      { value: 'speed', label: '素早さ' },
    ],
  },
  {
    id: 'battleStyle',
    question: 'バトルスタイルは？',
    options: [
      { value: 'first-strike', label: '先制攻撃重視' },
      { value: 'endurance', label: '持久戦' },
      { value: 'one-hit', label: '一撃必殺' },
      { value: 'support', label: 'サポート型' },
      { value: 'versatile', label: 'オールラウンド' },
    ],
  },
  {
    id: 'evolutionStage',
    question: 'どの進化段階のポケモンが好きですか？',
    options: [
      { value: 'basic', label: '進化前（かわいい）' },
      { value: 'middle', label: '中間進化（バランス）' },
      { value: 'final', label: '最終進化（強力）' },
      { value: 'no-evolution', label: '進化しない（シンプル）' },
    ],
  },
  {
    id: 'weightPreference',
    question: 'ポケモンの重さは？',
    options: [
      { value: 'light', label: '軽い（10kg以下）' },
      { value: 'medium', label: '普通（10kg〜50kg）' },
      { value: 'heavy', label: '重い（50kg以上）' },
    ],
  },
  {
    id: 'rarity',
    question: 'どのようなレアリティが好きですか？',
    options: [
      { value: 'common', label: '普通（よく見かける）' },
      { value: 'rare', label: '珍しい（見つけにくい）' },
      { value: 'legendary', label: '伝説・幻（非常に珍しい）' },
    ],
  },
  {
    id: 'purpose',
    question: 'ポケモンとの関わり方は？',
    options: [
      { value: 'battle', label: 'バトルで活躍させる' },
      { value: 'care', label: 'かわいがる' },
      { value: 'collection', label: 'コレクション' },
      { value: 'adventure', label: '冒険のパートナー' },
    ],
  },
];

function calculateScore(pokemon: Pokemon, answers: Answer, mode: DiagnosisMode): number {
  let score = 0;

  // タイプマッチング
  if (answers.favoriteType && pokemon.types.includes(answers.favoriteType)) {
    score += mode === 'simple' ? 40 : 30;
  }

  // 性格に基づくステータス評価
  if (answers.personality === 'aggressive') {
    const attackStat = pokemon.stats.find(s => s.name === 'attack')?.value || 0;
    score += attackStat * (mode === 'simple' ? 0.4 : 0.3);
  } else if (answers.personality === 'defensive') {
    const defenseStat = pokemon.stats.find(s => s.name === 'defense')?.value || 0;
    const hpStat = pokemon.stats.find(s => s.name === 'hp')?.value || 0;
    score += (defenseStat + hpStat) * (mode === 'simple' ? 0.25 : 0.2);
  } else if (answers.personality === 'speed') {
    const speedStat = pokemon.stats.find(s => s.name === 'speed')?.value || 0;
    score += speedStat * (mode === 'simple' ? 0.4 : 0.3);
  } else if (answers.personality === 'special') {
    const spAttackStat = pokemon.stats.find(s => s.name === 'special-attack')?.value || 0;
    score += spAttackStat * (mode === 'simple' ? 0.4 : 0.3);
  } else if (answers.personality === 'balanced') {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
    score += totalStats * (mode === 'simple' ? 0.06 : 0.05);
  }

  // 好みに基づく評価
  if (answers.preference === 'cute') {
    if (pokemon.height < 0.5) score += mode === 'simple' ? 25 : 20;
    if (pokemon.types.includes('fairy') || pokemon.types.includes('normal')) {
      score += mode === 'simple' ? 15 : 10;
    }
  } else if (answers.preference === 'cool') {
    if (pokemon.types.includes('dragon') || pokemon.types.includes('fire') || pokemon.types.includes('electric')) {
      score += mode === 'simple' ? 20 : 15;
    }
  } else if (answers.preference === 'strong') {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
    if (totalStats > 500) score += mode === 'simple' ? 25 : 20;
  } else if (answers.preference === 'mysterious') {
    if (pokemon.types.includes('ghost') || pokemon.types.includes('psychic') || pokemon.types.includes('dark')) {
      score += mode === 'simple' ? 20 : 15;
    }
  } else if (answers.preference === 'elegant') {
    if (pokemon.types.includes('fairy') || pokemon.types.includes('psychic')) {
      score += mode === 'simple' ? 20 : 15;
    }
  }

  // サイズマッチング（詳細診断のみ）
  if (mode === 'detailed') {
    if (answers.size === 'small' && pokemon.height < 0.5) {
      score += 20;
    } else if (answers.size === 'medium' && pokemon.height >= 0.5 && pokemon.height < 1.5) {
      score += 20;
    } else if (answers.size === 'large' && pokemon.height >= 1.5) {
      score += 20;
    }
  }

  // 重要ステータス評価
  if (answers.importantStat) {
    const stat = pokemon.stats.find(s => s.name === answers.importantStat);
    if (stat) {
      score += stat.value * (mode === 'simple' ? 0.3 : 0.4);
    }
  }

  // バトルスタイル評価（詳細診断のみ）
  if (mode === 'detailed') {
    if (answers.battleStyle === 'first-strike') {
      const speedStat = pokemon.stats.find(s => s.name === 'speed')?.value || 0;
      score += speedStat * 0.2;
    } else if (answers.battleStyle === 'endurance') {
      const hpStat = pokemon.stats.find(s => s.name === 'hp')?.value || 0;
      const defenseStat = pokemon.stats.find(s => s.name === 'defense')?.value || 0;
      score += (hpStat + defenseStat) * 0.15;
    } else if (answers.battleStyle === 'one-hit') {
      const attackStat = pokemon.stats.find(s => s.name === 'attack')?.value || 0;
      const spAttackStat = pokemon.stats.find(s => s.name === 'special-attack')?.value || 0;
      score += Math.max(attackStat, spAttackStat) * 0.2;
    } else if (answers.battleStyle === 'versatile') {
      const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
      score += totalStats * 0.03;
    }
  }

  // 進化段階評価（詳細診断のみ）
  if (mode === 'detailed' && answers.evolutionStage) {
    // IDに基づいて進化段階を推定（Gen1では基本的に3段階）
    if (answers.evolutionStage === 'basic' && pokemon.id <= 151 && pokemon.id % 3 === 1) {
      score += 15;
    } else if (answers.evolutionStage === 'final' && pokemon.id <= 151 && pokemon.id % 3 === 0) {
      score += 15;
    } else if (answers.evolutionStage === 'no-evolution') {
      // 進化しないポケモン（例: カビゴン、ラプラスなど）
      const noEvolutionIds = [83, 106, 107, 108, 113, 115, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151];
      if (noEvolutionIds.includes(pokemon.id)) {
        score += 15;
      }
    }
  }

  // 体重評価（詳細診断のみ）
  if (mode === 'detailed' && answers.weightPreference) {
    if (answers.weightPreference === 'light' && pokemon.weight < 10) {
      score += 15;
    } else if (answers.weightPreference === 'medium' && pokemon.weight >= 10 && pokemon.weight < 50) {
      score += 15;
    } else if (answers.weightPreference === 'heavy' && pokemon.weight >= 50) {
      score += 15;
    }
  }

  // レアリティ評価（詳細診断のみ）
  if (mode === 'detailed' && answers.rarity) {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
    if (answers.rarity === 'legendary') {
      // 伝説ポケモン（総ステータスが高い、または特定のID）
      const legendaryIds = [144, 145, 146, 150, 151];
      if (legendaryIds.includes(pokemon.id) || totalStats > 580) {
        score += 20;
      }
    } else if (answers.rarity === 'common') {
      // 普通のポケモン（総ステータスが低め）
      if (totalStats < 400) {
        score += 15;
      }
    } else if (answers.rarity === 'rare') {
      // 珍しいポケモン（中程度の総ステータス）
      if (totalStats >= 400 && totalStats <= 580) {
        score += 15;
      }
    }
  }

  // 用途評価（詳細診断のみ）
  if (mode === 'detailed' && answers.purpose) {
    if (answers.purpose === 'battle') {
      const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
      if (totalStats > 450) {
        score += 15;
      }
    } else if (answers.purpose === 'care') {
      // かわいいポケモン（小さい、フェアリータイプなど）
      if (pokemon.height < 0.6 || pokemon.types.includes('fairy') || pokemon.types.includes('normal')) {
        score += 15;
      }
    } else if (answers.purpose === 'collection') {
      // コレクション（珍しい、見た目が特徴的）
      score += 10; // 全体的に少しボーナス
    } else if (answers.purpose === 'adventure') {
      // 冒険（バランス型、総ステータスが中程度）
      const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
      if (totalStats >= 350 && totalStats <= 550) {
        score += 15;
      }
    }
  }

  return score;
}

// 診断コメントを生成
function generateDiagnosisComment(pokemon: Pokemon, answers: Answer, mode: DiagnosisMode): string {
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
  const primaryType = pokemon.types[0];
  const comments: string[] = [];

  // タイプに基づくコメント
  const typeComments: { [key: string]: string } = {
    fire: '情熱的でエネルギッシュ',
    water: '柔軟で適応力が高い',
    grass: '成長を大切にする穏やかさ',
    electric: '行動力がありスピード感がある',
    psychic: '知性的で深く考える',
    ice: '冷静で落ち着いている',
    dragon: '力強くリーダーシップがある',
    dark: '神秘的で独立心が強い',
    fairy: '優しく調和を大切にする',
    normal: 'バランスが取れて安定している',
    fighting: '正義感が強く努力を惜しまない',
    poison: '独特な魅力と強い個性を持つ',
    ground: '堅実で地に足がついている',
    flying: '自由を愛し広い視野を持つ',
    bug: '努力家で粘り強い',
    rock: '堅実で安定感がある',
    ghost: '神秘的で深い洞察力を持つ',
    steel: '強靭で困難に立ち向かう',
  };

  if (typeComments[primaryType]) {
    comments.push(`あなたは${typeComments[primaryType]}性格です`);
  }

  // 好みに基づくコメント
  if (answers.preference === 'cute') {
    comments.push('かわいらしいものを好む、優しい心の持ち主です');
  } else if (answers.preference === 'cool') {
    comments.push('かっこいいものを好む、スタイリッシュなセンスがあります');
  } else if (answers.preference === 'strong') {
    comments.push('強さを重視する、向上心が高い性格です');
  } else if (answers.preference === 'mysterious') {
    comments.push('神秘的で奥深い魅力に惹かれる、独特な感性を持っています');
  } else if (answers.preference === 'elegant') {
    comments.push('優雅さを好む、上品で洗練された性格です');
  }

  // 性格に基づくコメント
  if (answers.personality === 'aggressive') {
    comments.push('積極的に行動し、目標に向かって突き進む力があります');
  } else if (answers.personality === 'defensive') {
    comments.push('慎重で、周囲を守ることを大切にします');
  } else if (answers.personality === 'speed') {
    comments.push('素早い判断力と行動力を持っています');
  } else if (answers.personality === 'special') {
    comments.push('知的な判断と深い思考力があります');
  } else if (answers.personality === 'balanced') {
    comments.push('バランスの取れた能力を持っています');
  }

  // 総合ステータスに基づくコメント
  if (totalStats > 580) {
    comments.push('非常に高い潜在能力を持っており、どんな困難にも立ち向かえる強さがあります');
  } else if (totalStats < 350) {
    comments.push('シンプルで純粋な魅力があり、周囲に優しい影響を与えます');
  }

  // デフォルトコメント
  if (comments.length === 0) {
    comments.push('あなたの個性が、このポケモンとぴったり合っています');
  }

  return comments.join('。') + '。';
}

export default function PokemonDiagnosis({ pokemonList }: PokemonDiagnosisProps) {
  const [mode, setMode] = useState<DiagnosisMode>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({
    favoriteType: null,
    personality: null,
    preference: null,
    size: null,
    importantStat: null,
    battleStyle: null,
    evolutionStage: null,
    weightPreference: null,
    rarity: null,
    purpose: null,
  });
  const [result, setResult] = useState<Pokemon | null>(null);
  const [diagnosisComment, setDiagnosisComment] = useState<string>('');

  const questions = mode === 'simple' ? simpleQuestions : detailedQuestions;

  const handleModeSelect = (selectedMode: 'simple' | 'detailed') => {
    setMode(selectedMode);
    setCurrentQuestion(0);
    setAnswers({
      favoriteType: null,
      personality: null,
      preference: null,
      size: null,
      importantStat: null,
      battleStyle: null,
      evolutionStage: null,
      weightPreference: null,
      rarity: null,
      purpose: null,
    });
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // 診断完了
      calculateResult();
    }
  };

  const calculateResult = () => {
    const scores = pokemonList.map((pokemon) => ({
      pokemon,
      score: calculateScore(pokemon, answers, mode),
    }));

    scores.sort((a, b) => b.score - a.score);
    const resultPokemon = scores[0].pokemon;
    setResult(resultPokemon);
    setDiagnosisComment(generateDiagnosisComment(resultPokemon, answers, mode));
  };

  const resetDiagnosis = () => {
    setMode(null);
    setCurrentQuestion(0);
    setAnswers({
      favoriteType: null,
      personality: null,
      preference: null,
      size: null,
      importantStat: null,
      battleStyle: null,
      evolutionStage: null,
      weightPreference: null,
      rarity: null,
      purpose: null,
    });
    setResult(null);
    setDiagnosisComment('');
  };

  // モード選択画面
  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            診断モードを選択
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            どちらの診断で進めますか？
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 簡易診断 */}
            <button
              onClick={() => handleModeSelect('simple')}
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 border-2 border-transparent hover:border-blue-400"
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  簡易診断
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  5問の簡単な質問で<br />
                  あなたにぴったりのポケモンを診断
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  所要時間：約2分
                </div>
              </div>
            </button>

            {/* 詳細診断 */}
            <button
              onClick={() => handleModeSelect('detailed')}
              className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 border-2 border-transparent hover:border-purple-400"
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  詳細診断
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  10問の詳細な質問で<br />
                  より精密にあなたに合うポケモンを診断
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  所要時間：約3分
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            診断結果
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            あなたにぴったりのポケモンは...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            {mode === 'simple' ? '簡易診断' : '詳細診断'}の結果
          </p>

          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 mb-8">
            <PokemonImage pokemon={result} size={256} showSelector={true} />
            <h3 className="text-4xl font-bold text-gray-800 dark:text-white mt-6 mb-2">
              {result.nameJa}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              #{String(result.id).padStart(3, '0')}
            </p>
            <div className="flex gap-2 justify-center flex-wrap mb-6">
              {result.typesJa.map((typeJa, index) => (
                <span
                  key={result.types[index]}
                  className="px-4 py-2 bg-blue-500 rounded-full text-sm font-semibold text-white"
                >
                  {typeJa}
                </span>
              ))}
            </div>
          </div>

          {/* 診断コメント */}
          <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              診断コメント
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              {diagnosisComment}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">高さ</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{result.height}m</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">重さ</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{result.weight}kg</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 col-span-2 md:col-span-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総合ステータス</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {result.stats.reduce((sum, stat) => sum + stat.value, 0)}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href={`/pokemon/${result.name}`}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              詳細を見る
            </Link>
            <button
              onClick={resetDiagnosis}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* 診断モード表示 */}
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            {mode === 'simple' ? '簡易診断' : '詳細診断'}
          </span>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>質問 {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                mode === 'simple' ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          {currentQ.question}
        </h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQ.id, option.value)}
              className={`w-full p-4 text-left bg-gray-100 dark:bg-gray-700 rounded-lg hover:border-2 border-2 border-transparent transition-all duration-200 ${
                mode === 'simple'
                  ? 'hover:bg-blue-100 dark:hover:bg-blue-900 hover:border-blue-500'
                  : 'hover:bg-purple-100 dark:hover:bg-purple-900 hover:border-purple-500'
              }`}
            >
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
