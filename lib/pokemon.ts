export interface Pokemon {
  id: number;
  name: string;
  nameJa: string;
  image: string; // デフォルト画像（前向き静止画）
  imageFront?: string; // 前向き静止画（オス/デフォルト）
  imageFrontFemale?: string; // 前向き静止画（メス）
  imageBack?: string; // 後ろ向き静止画（オス/デフォルト）
  imageBackFemale?: string; // 後ろ向き静止画（メス）
  imageGifFront?: string; // 前向きGIF（オス/デフォルト）
  imageGifFrontFemale?: string; // 前向きGIF（メス）
  imageGifBack?: string; // 後ろ向きGIF（オス/デフォルト）
  imageGifBackFemale?: string; // 後ろ向きGIF（メス）
  imageGif?: string; // 後方互換性のため残す
  types: string[];
  typesJa: string[];
  height: number;
  weight: number;
  abilities: string[];
  abilitiesJa: string[];
  stats: {
    name: string;
    value: number;
  }[];
  genderRate: number; // -1: 性別なし, 0-8: メスの割合（8段階）
}

export type GenderInfo = {
  hasMale: boolean;
  hasFemale: boolean;
  isGenderless: boolean;
};

export function getGenderInfo(genderRate: number): GenderInfo {
  // genderRate: -1 = 性別なし, 0-8 = メスの割合（0=100%オス, 8=100%メス）
  if (genderRate === -1) {
    return { hasMale: false, hasFemale: false, isGenderless: true };
  }

  const hasMale = genderRate !== 8;
  const hasFemale = genderRate !== 0;

  return {
    hasMale,
    hasFemale,
    isGenderless: false,
  };
}

export type ImageType = 'front' | 'front-female' | 'back' | 'back-female' | 'gif-front' | 'gif-front-female' | 'gif-back' | 'gif-back-female';

export interface PokemonListItem {
  name: string;
  url: string;
  nameJa?: string;
}

export interface PokemonListItemWithJa extends PokemonListItem {
  nameJa: string;
  id: number;
}

export async function getPokemonList(limit: number = 151): Promise<PokemonListItem[]> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await response.json();
  return data.results;
}

export async function getPokemonListWithJapanese(limit: number = 151): Promise<PokemonListItemWithJa[]> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await response.json();

  // URLからIDを抽出して日本語名を取得
  const pokemonListWithJa = await Promise.all(
    data.results.map(async (pokemon: PokemonListItem) => {
      const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
      const nameJa = await getJapaneseName(pokemon.name, id);
      return {
        ...pokemon,
        nameJa,
        id,
      };
    })
  );

  return pokemonListWithJa;
}

async function getJapaneseName(englishName: string, id: number): Promise<string> {
  try {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesResponse.json();
    const japaneseName = speciesData.names.find((name: any) => name.language.name === 'ja');
    return japaneseName ? japaneseName.name : englishName;
  } catch {
    return englishName;
  }
}

async function getJapaneseTypeName(englishType: string): Promise<string> {
  try {
    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${englishType}`);
    const typeData = await typeResponse.json();
    const japaneseName = typeData.names.find((name: any) => name.language.name === 'ja');
    return japaneseName ? japaneseName.name : englishType;
  } catch {
    return englishType;
  }
}

async function getJapaneseAbilityName(englishAbility: string): Promise<string> {
  try {
    const abilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${englishAbility}`);
    const abilityData = await abilityResponse.json();
    const japaneseName = abilityData.names.find((name: any) => name.language.name === 'ja');
    return japaneseName ? japaneseName.name : englishAbility;
  } catch {
    return englishAbility;
  }
}

export async function getPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();

  // 性別情報を取得（speciesエンドポイントから）
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
  const speciesData = await speciesResponse.json();
  const genderRate = speciesData.gender_rate ?? -1;

  const nameJa = await getJapaneseName(data.name, data.id);
  const typesJa = await Promise.all(
    data.types.map((type: any) => getJapaneseTypeName(type.type.name))
  );
  const abilitiesJa = await Promise.all(
    data.abilities.map((ability: any) => getJapaneseAbilityName(ability.ability.name))
  );

  // 各種画像を取得
  const imageFront = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  const imageFrontFemale = data.sprites.front_female || undefined;
  const imageBack = data.sprites.back_default;
  const imageBackFemale = data.sprites.back_female || undefined;
  const imageGifFront = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
  const imageGifFrontFemale = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_female || undefined;
  const imageGifBack = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_default;
  const imageGifBackFemale = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_female || undefined;

  return {
    id: data.id,
    name: data.name,
    nameJa,
    image: imageFront, // デフォルトは前向き静止画
    imageFront,
    imageFrontFemale,
    imageBack: imageBack || undefined,
    imageBackFemale,
    imageGifFront: imageGifFront || undefined,
    imageGifFrontFemale,
    imageGifBack: imageGifBack || undefined,
    imageGifBackFemale,
    imageGif: imageGifFront || undefined, // 後方互換性
    types: data.types.map((type: any) => type.type.name),
    typesJa,
    height: data.height / 10, // デシメートルをメートルに変換
    weight: data.weight / 10, // ヘクトグラムをキログラムに変換
    abilities: data.abilities.map((ability: any) => ability.ability.name),
    abilitiesJa,
    stats: data.stats.map((stat: any) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
    genderRate,
  };
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  // 性別情報を取得（speciesエンドポイントから）
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const speciesData = await speciesResponse.json();
  const genderRate = speciesData.gender_rate ?? -1;

  const nameJa = await getJapaneseName(data.name, data.id);
  const typesJa = await Promise.all(
    data.types.map((type: any) => getJapaneseTypeName(type.type.name))
  );
  const abilitiesJa = await Promise.all(
    data.abilities.map((ability: any) => getJapaneseAbilityName(ability.ability.name))
  );

  // 各種画像を取得
  const imageFront = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  const imageFrontFemale = data.sprites.front_female || undefined;
  const imageBack = data.sprites.back_default;
  const imageBackFemale = data.sprites.back_female || undefined;
  const imageGifFront = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
  const imageGifFrontFemale = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_female || undefined;
  const imageGifBack = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_default;
  const imageGifBackFemale = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_female || undefined;

  return {
    id: data.id,
    name: data.name,
    nameJa,
    image: imageFront, // デフォルトは前向き静止画
    imageFront,
    imageFrontFemale,
    imageBack: imageBack || undefined,
    imageBackFemale,
    imageGifFront: imageGifFront || undefined,
    imageGifFrontFemale,
    imageGifBack: imageGifBack || undefined,
    imageGifBackFemale,
    imageGif: imageGifFront || undefined, // 後方互換性
    types: data.types.map((type: any) => type.type.name),
    typesJa,
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map((ability: any) => ability.ability.name),
    abilitiesJa,
    stats: data.stats.map((stat: any) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
    genderRate,
  };
}
