export interface Pokemon {
  id: number;
  name: string;
  nameJa: string;
  image: string;
  imageGif?: string;
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
}

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

  const nameJa = await getJapaneseName(data.name, data.id);
  const typesJa = await Promise.all(
    data.types.map((type: any) => getJapaneseTypeName(type.type.name))
  );
  const abilitiesJa = await Promise.all(
    data.abilities.map((ability: any) => getJapaneseAbilityName(ability.ability.name))
  );

  // 静止画（高画質）を取得
  const staticImage = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  // GIFアニメーションスプライトを取得
  const gifImage = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

  return {
    id: data.id,
    name: data.name,
    nameJa,
    image: staticImage,
    imageGif: gifImage || undefined,
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
  };
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const nameJa = await getJapaneseName(data.name, data.id);
  const typesJa = await Promise.all(
    data.types.map((type: any) => getJapaneseTypeName(type.type.name))
  );
  const abilitiesJa = await Promise.all(
    data.abilities.map((ability: any) => getJapaneseAbilityName(ability.ability.name))
  );

  // 静止画（高画質）を取得
  const staticImage = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  // GIFアニメーションスプライトを取得
  const gifImage = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;

  return {
    id: data.id,
    name: data.name,
    nameJa,
    image: staticImage,
    imageGif: gifImage || undefined,
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
  };
}
