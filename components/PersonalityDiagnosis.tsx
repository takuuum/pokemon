'use client';

import { useState } from 'react';
import { Pokemon } from '@/lib/pokemon';
import Link from 'next/link';
import PokemonImage from './PokemonImage';

interface PersonalityDiagnosisProps {
  pokemonList: Pokemon[];
}

interface PersonalityAnswer {
  energy: string | null;
  social: string | null;
  decision: string | null;
  lifestyle: string | null;
  values: string | null;
  stress: string | null;
  hobby: string | null;
  communication: string | null;
  goal: string | null;
  environment: string | null;
}

const personalityQuestions = [
  {
    id: 'energy',
    question: '休日の過ごし方は？',
    options: [
      { value: 'active', label: 'アクティブに活動する', trait: 'aggressive' },
      { value: 'relax', label: 'のんびりと過ごす', trait: 'defensive' },
      { value: 'balance', label: 'バランスよく過ごす', trait: 'balanced' },
      { value: 'adventure', label: '新しいことに挑戦する', trait: 'speed' },
    ],
  },
  {
    id: 'social',
    question: '人との関わり方は？',
    options: [
      { value: 'leader', label: 'リーダーシップを取る', trait: 'aggressive' },
      { value: 'supporter', label: 'サポート役を好む', trait: 'defensive' },
      { value: 'team', label: 'チームで協力する', trait: 'balanced' },
      { value: 'independent', label: '一人で行動する', trait: 'speed' },
    ],
  },
  {
    id: 'decision',
    question: '重要な決断をする時は？',
    options: [
      { value: 'quick', label: '素早く決断する', trait: 'speed' },
      { value: 'careful', label: '慎重に考える', trait: 'defensive' },
      { value: 'intuitive', label: '直感で決める', trait: 'aggressive' },
      { value: 'analyze', label: 'じっくり分析する', trait: 'special' },
    ],
  },
  {
    id: 'lifestyle',
    question: '理想の生活スタイルは？',
    options: [
      { value: 'challenge', label: 'チャレンジングな毎日', trait: 'aggressive' },
      { value: 'stable', label: '安定した生活', trait: 'defensive' },
      { value: 'variety', label: '変化に富んだ生活', trait: 'speed' },
      { value: 'balanced', label: 'バランスの取れた生活', trait: 'balanced' },
    ],
  },
  {
    id: 'values',
    question: '最も大切にしていることは？',
    options: [
      { value: 'strength', label: '強さ・実力', trait: 'aggressive' },
      { value: 'safety', label: '安全・安定', trait: 'defensive' },
      { value: 'speed', label: 'スピード・効率', trait: 'speed' },
      { value: 'wisdom', label: '知恵・知識', trait: 'special' },
      { value: 'harmony', label: '調和・バランス', trait: 'balanced' },
    ],
  },
  {
    id: 'stress',
    question: 'ストレスを感じた時の対処法は？',
    options: [
      { value: 'fight', label: '正面から向き合う', trait: 'aggressive' },
      { value: 'defend', label: '身を守る', trait: 'defensive' },
      { value: 'escape', label: '一時的に距離を置く', trait: 'speed' },
      { value: 'think', label: '冷静に分析する', trait: 'special' },
      { value: 'adapt', label: '柔軟に対応する', trait: 'balanced' },
    ],
  },
  {
    id: 'hobby',
    question: '趣味や好きなことは？',
    options: [
      { value: 'sports', label: 'スポーツ・運動', trait: 'aggressive' },
      { value: 'reading', label: '読書・勉強', trait: 'special' },
      { value: 'creative', label: '創作活動', trait: 'balanced' },
      { value: 'travel', label: '旅行・冒険', trait: 'speed' },
      { value: 'relax', label: 'リラックス・休息', trait: 'defensive' },
    ],
  },
  {
    id: 'communication',
    question: 'コミュニケーションの取り方は？',
    options: [
      { value: 'direct', label: '直接的にはっきりと', trait: 'aggressive' },
      { value: 'careful', label: '慎重に言葉を選ぶ', trait: 'defensive' },
      { value: 'quick', label: '素早く簡潔に', trait: 'speed' },
      { value: 'deep', label: '深くじっくりと', trait: 'special' },
      { value: 'friendly', label: '親しみやすく', trait: 'balanced' },
    ],
  },
  {
    id: 'goal',
    question: '人生の目標は？',
    options: [
      { value: 'success', label: '成功・達成', trait: 'aggressive' },
      { value: 'peace', label: '平穏・安定', trait: 'defensive' },
      { value: 'growth', label: '成長・向上', trait: 'speed' },
      { value: 'knowledge', label: '知識・理解', trait: 'special' },
      { value: 'balance', label: 'バランス・調和', trait: 'balanced' },
    ],
  },
  {
    id: 'environment',
    question: '理想の環境は？',
    options: [
      { value: 'competitive', label: '競争的な環境', trait: 'aggressive' },
      { value: 'safe', label: '安全で守られた環境', trait: 'defensive' },
      { value: 'dynamic', label: '動的で変化のある環境', trait: 'speed' },
      { value: 'quiet', label: '静かで落ち着いた環境', trait: 'special' },
      { value: 'harmonious', label: '調和の取れた環境', trait: 'balanced' },
    ],
  },
];

// 各質問の選択肢に数値を割り当て（性格タイプID計算用）
const optionValues: { [key: string]: { [key: string]: number } } = {
  energy: { active: 1, relax: 2, balance: 3, adventure: 4 },
  social: { leader: 1, supporter: 2, team: 3, independent: 4 },
  decision: { quick: 1, careful: 2, intuitive: 3, analyze: 4 },
  lifestyle: { challenge: 1, stable: 2, variety: 3, balanced: 4 },
  values: { strength: 1, safety: 2, speed: 3, wisdom: 4, harmony: 5 },
  stress: { fight: 1, defend: 2, escape: 3, think: 4, adapt: 5 },
  hobby: { sports: 1, reading: 2, creative: 3, travel: 4, relax: 5 },
  communication: { direct: 1, careful: 2, quick: 3, deep: 4, friendly: 5 },
  goal: { success: 1, peace: 2, growth: 3, knowledge: 4, balance: 5 },
  environment: { competitive: 1, safe: 2, dynamic: 3, quiet: 4, harmonious: 5 },
};

// 回答から性格タイプID（1-151）を計算
function calculatePersonalityTypeId(answers: PersonalityAnswer): number {
  // 各質問の回答値を取得
  const energyValue = optionValues.energy[answers.energy || ''] || 1;
  const socialValue = optionValues.social[answers.social || ''] || 1;
  const decisionValue = optionValues.decision[answers.decision || ''] || 1;
  const lifestyleValue = optionValues.lifestyle[answers.lifestyle || ''] || 1;
  const valuesValue = optionValues.values[answers.values || ''] || 1;
  const stressValue = optionValues.stress[answers.stress || ''] || 1;
  const hobbyValue = optionValues.hobby[answers.hobby || ''] || 1;
  const communicationValue = optionValues.communication[answers.communication || ''] || 1;
  const goalValue = optionValues.goal[answers.goal || ''] || 1;
  const environmentValue = optionValues.environment[answers.environment || ''] || 1;

  // 各値を組み合わせてハッシュ値を計算（151通りのIDを生成）
  // 各質問に異なる素数を掛けて、なるべく均等に分散させる
  const hash =
    energyValue * 2 +
    socialValue * 3 +
    decisionValue * 5 +
    lifestyleValue * 7 +
    valuesValue * 11 +
    stressValue * 13 +
    hobbyValue * 17 +
    communicationValue * 19 +
    goalValue * 23 +
    environmentValue * 29;

  // 151で割った余りを取得（1-151の範囲）
  const typeId = (hash % 151) + 1;

  return typeId;
}

// 性格タイプ名を生成（ポケモン名 + "型"）
function getPersonalityTypeName(pokemon: Pokemon): string {
  return `${pokemon.nameJa}型`;
}

// 診断コメントを生成
function generateDiagnosisComment(pokemon: Pokemon, answers: PersonalityAnswer): string {
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
  const attackStat = pokemon.stats.find(s => s.name === 'attack')?.value || 0;
  const defenseStat = pokemon.stats.find(s => s.name === 'defense')?.value || 0;
  const speedStat = pokemon.stats.find(s => s.name === 'speed')?.value || 0;
  const spAttackStat = pokemon.stats.find(s => s.name === 'special-attack')?.value || 0;
  const hpStat = pokemon.stats.find(s => s.name === 'hp')?.value || 0;

  // 回答パターンから性格傾向を判定
  let dominantTrait = 'balanced';
  const traitCounts: { [key: string]: number } = {
    aggressive: 0,
    defensive: 0,
    balanced: 0,
    speed: 0,
    special: 0,
  };

  personalityQuestions.forEach((q) => {
    const answerValue = answers[q.id as keyof PersonalityAnswer];
    if (answerValue) {
      const option = q.options.find((opt) => opt.value === answerValue);
      if (option && option.trait) {
        traitCounts[option.trait as keyof typeof traitCounts]++;
      }
    }
  });

  dominantTrait = Object.entries(traitCounts).reduce((a, b) =>
    traitCounts[a[0] as keyof typeof traitCounts] > traitCounts[b[0] as keyof typeof traitCounts] ? a : b
  )[0];

  // ポケモンの特性に基づくコメント
  const comments: string[] = [];

  // タイプに基づくコメント（複数タイプがある場合は最初のタイプを優先）
  const primaryType = pokemon.types[0];
  if (primaryType === 'fire') {
    comments.push('情熱的でエネルギッシュな性格');
  } else if (primaryType === 'water') {
    comments.push('柔軟で適応力の高い性格');
  } else if (primaryType === 'grass') {
    comments.push('成長を大切にする穏やかな性格');
  } else if (primaryType === 'electric') {
    comments.push('行動力があり、スピード感のある性格');
  } else if (primaryType === 'psychic') {
    comments.push('知性的で深く考える性格');
  } else if (primaryType === 'ice') {
    comments.push('冷静で落ち着いた性格');
  } else if (primaryType === 'dragon') {
    comments.push('力強く、リーダーシップのある性格');
  } else if (primaryType === 'dark') {
    comments.push('神秘的で独立心の強い性格');
  } else if (primaryType === 'fairy') {
    comments.push('優しく、調和を大切にする性格');
  } else if (primaryType === 'normal') {
    comments.push('バランスが取れた安定した性格');
  } else if (primaryType === 'fighting') {
    comments.push('正義感が強く、努力を惜しまない性格');
  } else if (primaryType === 'poison') {
    comments.push('独特な魅力と、強い個性を持つ性格');
  } else if (primaryType === 'ground') {
    comments.push('堅実で、地に足のついた性格');
  } else if (primaryType === 'flying') {
    comments.push('自由を愛し、広い視野を持つ性格');
  } else if (primaryType === 'bug') {
    comments.push('努力家で、粘り強く取り組む性格');
  } else if (primaryType === 'rock') {
    comments.push('堅実で、安定感のある性格');
  } else if (primaryType === 'ghost') {
    comments.push('神秘的で、深い洞察力を持つ性格');
  } else if (primaryType === 'steel') {
    comments.push('強靭で、困難に立ち向かう性格');
  }

  // ステータスに基づくコメント
  if (dominantTrait === 'aggressive' && attackStat > 80) {
    comments.push('積極的に行動し、目標に向かって突き進む力があります');
  } else if (dominantTrait === 'defensive' && defenseStat > 80) {
    comments.push('慎重で、周囲を守ることを大切にします');
  } else if (dominantTrait === 'speed' && speedStat > 80) {
    comments.push('素早い判断力と行動力を持っています');
  } else if (dominantTrait === 'special' && spAttackStat > 80) {
    comments.push('知的な判断と深い思考力があります');
  } else if (totalStats > 500) {
    comments.push('バランスの取れた能力を持っています');
  }

  // サイズに基づくコメント
  if (pokemon.height < 0.5) {
    comments.push('小さくても、その存在感は抜群です');
  } else if (pokemon.height >= 1.5) {
    comments.push('堂々とした風格と、人を惹きつける魅力があります');
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

export default function PersonalityDiagnosis({ pokemonList }: PersonalityDiagnosisProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalityAnswer>({
    energy: null,
    social: null,
    decision: null,
    lifestyle: null,
    values: null,
    stress: null,
    hobby: null,
    communication: null,
    goal: null,
    environment: null,
  });
  const [result, setResult] = useState<Pokemon | null>(null);
  const [personalityType, setPersonalityType] = useState<string>('');
  const [diagnosisComment, setDiagnosisComment] = useState<string>('');

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (currentQuestion < personalityQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // 診断完了
      calculateResult();
    }
  };

  const calculateResult = () => {
    // 回答から性格タイプIDを計算（1-151）
    const personalityTypeId = calculatePersonalityTypeId(answers);

    // そのIDのポケモンを探す
    const matchedPokemon = pokemonList.find(p => p.id === personalityTypeId);

    if (matchedPokemon) {
      setResult(matchedPokemon);
      setPersonalityType(getPersonalityTypeName(matchedPokemon));
      setDiagnosisComment(generateDiagnosisComment(matchedPokemon, answers));
    } else {
      // 見つからない場合は最初のポケモン（フォールバック）
      setResult(pokemonList[0]);
      setPersonalityType(getPersonalityTypeName(pokemonList[0]));
      setDiagnosisComment(generateDiagnosisComment(pokemonList[0], answers));
    }
  };

  const resetDiagnosis = () => {
    setCurrentQuestion(0);
    setAnswers({
      energy: null,
      social: null,
      decision: null,
      lifestyle: null,
      values: null,
      stress: null,
      hobby: null,
      communication: null,
      goal: null,
      environment: null,
    });
    setResult(null);
    setPersonalityType('');
    setDiagnosisComment('');
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            性格診断結果
          </h2>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-purple-500 text-white rounded-full text-lg font-semibold">
              あなたの性格タイプ: {personalityType}
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            あなたの性格にぴったりのポケモンは...
          </p>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 mb-8">
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
                  className="px-4 py-2 bg-purple-500 rounded-full text-sm font-semibold text-white"
                >
                  {typeJa}
                </span>
              ))}
            </div>
          </div>

          {/* 診断コメント */}
          <div className="bg-purple-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
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
              className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
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

  const currentQ = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>質問 {currentQuestion + 1} / {personalityQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
              className="w-full p-4 text-left bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 hover:border-purple-500 border-2 border-transparent transition-all duration-200"
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
