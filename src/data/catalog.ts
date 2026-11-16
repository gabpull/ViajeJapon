import posters from './posters.json'

export type Platform = 'apple' | 'claro'
export type ContentType = 'serie' | 'pelicula'

export type Title = {
  id: string
  name: string
  type: ContentType
  platform: Platform
  genres: string[]
  year?: number
  note?: string
  accent: string
  poster?: string
}

/** Apple TV+: todo es Original incluido en la suscripción (sin alquilar). */
const appleSeries: Omit<Title, 'id' | 'platform' | 'type' | 'accent'>[] = [
  { name: 'Nocturno', genres: ['Crimen', 'Suspense'], year: 2025 },
  { name: '12 12 12', genres: ['Crimen', 'Acción'], year: 2025 },
  { name: 'Slow Horses', genres: ['Suspense', 'Drama'], year: 2022 },
  { name: 'Ted Lasso', genres: ['Comedia', 'Deportes'], year: 2020 },
  { name: 'Silo', genres: ['Ciencia ficción'], year: 2023 },
  { name: 'Materia oscura', genres: ['Ciencia ficción', 'Suspense'], year: 2024 },
  { name: 'Separación', genres: ['Suspense', 'Misterio'], year: 2022 },
  { name: 'Terapia sin filtro', genres: ['Comedia'], year: 2023 },
  { name: 'The Morning Show', genres: ['Drama'], year: 2019 },
  { name: 'Vicios ocultos', genres: ['Drama', 'Crimen'], year: 2025 },
  { name: 'Foundation', genres: ['Ciencia ficción'], year: 2021 },
  { name: 'For All Mankind', genres: ['Drama', 'Ciencia ficción'], year: 2019 },
  { name: 'Presumed Innocent', genres: ['Crimen', 'Drama'], year: 2024 },
  { name: 'The Studio', genres: ['Comedia'], year: 2025 },
  { name: 'Murderbot', genres: ['Ciencia ficción', 'Comedia'], year: 2025 },
  { name: 'Monarch: Legacy of Monsters', genres: ['Acción', 'Ciencia ficción'], year: 2023 },
  { name: 'Pachinko', genres: ['Drama'], year: 2022 },
  { name: 'Bad Sisters', genres: ['Drama', 'Comedia negra'], year: 2022 },
  { name: 'Hijack', genres: ['Suspense', 'Acción'], year: 2023 },
  { name: 'Invasion', genres: ['Ciencia ficción'], year: 2021 },
  { name: 'Acapulco', genres: ['Comedia'], year: 2021 },
  { name: 'Platonic', genres: ['Comedia'], year: 2023 },
  { name: 'Loot', genres: ['Comedia'], year: 2022 },
  { name: 'Mythic Quest', genres: ['Comedia'], year: 2020 },
  { name: 'Trying', genres: ['Comedia'], year: 2020 },
  { name: 'Sugar', genres: ['Misterio', 'Drama'], year: 2024 },
  { name: 'Criminal Record', genres: ['Crimen'], year: 2024 },
  { name: 'Palm Royale', genres: ['Comedia', 'Drama'], year: 2024 },
  { name: 'Lessons in Chemistry', genres: ['Drama'], year: 2023 },
  { name: 'Masters of the Air', genres: ['Drama', 'Guerra'], year: 2024 },
  { name: 'Black Bird', genres: ['Crimen', 'Drama'], year: 2022 },
  { name: 'Servant', genres: ['Terror', 'Suspense'], year: 2019 },
  { name: 'See', genres: ['Drama', 'Ciencia ficción'], year: 2019 },
  { name: 'Prehistoric Planet', genres: ['Documental', 'Naturaleza'], year: 2022 },
  { name: 'The Reluctant Traveler', genres: ['Viajes', 'Comedia'], year: 2023 },
  { name: 'Stick', genres: ['Comedia', 'Deportes'], year: 2025 },
  { name: 'Chief of War', genres: ['Drama', 'Historia'], year: 2025 },
  { name: 'Government Cheese', genres: ['Comedia', 'Drama'], year: 2025 },
  { name: 'Dope Thief', genres: ['Crimen', 'Drama'], year: 2025 },
  { name: 'The Buccaneers', genres: ['Drama', 'Romance'], year: 2023 },
  { name: 'Bad Monkey', genres: ['Comedia', 'Crimen'], year: 2024 },
  { name: 'Constellation', genres: ['Ciencia ficción', 'Suspense'], year: 2024 },
  { name: 'Surface', genres: ['Suspense'], year: 2022 },
  { name: 'Tehran', genres: ['Suspense', 'Acción'], year: 2020 },
  { name: 'The Afterparty', genres: ['Comedia', 'Misterio'], year: 2022 },
  { name: 'Schmigadoon!', genres: ['Comedia', 'Musical'], year: 2021 },
  { name: 'Central Park', genres: ['Animación', 'Comedia'], year: 2020 },
  { name: 'Fraggle Rock: Back to the Rock', genres: ['Infantil', 'Familia'], year: 2022 },
  { name: 'Stillwater', genres: ['Infantil', 'Animación'], year: 2020 },
  { name: 'Camp Snoopy', genres: ['Infantil', 'Animación'], year: 2024 },
  { name: 'WondLa', genres: ['Animación', 'Aventuras'], year: 2024 },
]

const appleMovies: Omit<Title, 'id' | 'platform' | 'type' | 'accent'>[] = [
  { name: 'Siendo Heumann', genres: ['Drama', 'Comedia'], year: 2025 },
  { name: 'Tenzing', genres: ['Drama', 'Aventuras'], year: 2025 },
  { name: 'Matchbox', genres: ['Acción', 'Comedia'], year: 2025 },
  { name: 'Mayday', genres: ['Acción', 'Comedia'], year: 2025 },
  { name: 'Outcome', genres: ['Comedia'], year: 2025 },
  { name: 'Eternity', genres: ['Romance', 'Comedia'], year: 2025 },
  { name: 'Plan en familia 2', genres: ['Comedia', 'Acción'], year: 2025 },
  { name: 'The Gorge', genres: ['Acción', 'Romance'], year: 2025 },
  { name: 'Wolfs', genres: ['Acción', 'Comedia'], year: 2024 },
  { name: 'Fly Me to the Moon', genres: ['Comedia', 'Romance'], year: 2024 },
  { name: 'Argylle', genres: ['Acción', 'Comedia'], year: 2024 },
  { name: 'Killers of the Flower Moon', genres: ['Drama', 'Crimen'], year: 2023 },
  { name: 'CODA', genres: ['Drama'], year: 2021 },
  { name: 'Finch', genres: ['Ciencia ficción', 'Drama'], year: 2021 },
  { name: 'Tetris', genres: ['Drama', 'Thriller'], year: 2023 },
  { name: 'Ghosted', genres: ['Acción', 'Romance'], year: 2023 },
  { name: 'Spirited', genres: ['Comedia', 'Musical'], year: 2022 },
  { name: 'Plan en familia', genres: ['Comedia', 'Acción'], year: 2023 },
  { name: 'Luck', genres: ['Animación', 'Familia'], year: 2022 },
  { name: 'Greyhound', genres: ['Guerra', 'Acción'], year: 2020 },
  { name: 'Palmer', genres: ['Drama'], year: 2021 },
  { name: 'Wolfwalkers', genres: ['Animación', 'Aventuras'], year: 2020 },
  { name: 'The Instigators', genres: ['Acción', 'Comedia'], year: 2024 },
  { name: 'Fountain of Youth', genres: ['Aventuras'], year: 2025 },
  { name: 'Echo Valley', genres: ['Suspense'], year: 2025 },
  { name: 'Blitz', genres: ['Drama', 'Guerra'], year: 2024 },
  { name: 'Napoleon', genres: ['Drama', 'Historia'], year: 2023 },
  { name: 'Cha Cha Real Smooth', genres: ['Comedia', 'Drama'], year: 2022 },
  { name: 'Emancipation', genres: ['Drama', 'Historia'], year: 2022 },
  { name: 'Still: A Michael J. Fox Movie', genres: ['Documental'], year: 2023 },
]

/**
 * Claro Video: catálogo / Universal+ / Atresplayer típico incluido
 * con plan Claro (sin alquiler ni PPV). Varía por país y plan.
 */
const claroSeries: Omit<Title, 'id' | 'platform' | 'type' | 'accent'>[] = [
  { name: 'The Office', genres: ['Comedia'], year: 2005, note: 'Universal+' },
  { name: 'Suits', genres: ['Drama'], year: 2011, note: 'Universal+' },
  { name: 'Ted', genres: ['Comedia'], year: 2024, note: 'Universal+' },
  { name: 'La Ley y el Orden', genres: ['Crimen', 'Drama'], year: 1990, note: 'Universal+' },
  { name: 'FBI', genres: ['Crimen', 'Drama'], year: 2018, note: 'Universal+' },
  { name: 'The Rookie', genres: ['Drama', 'Acción'], year: 2018, note: 'Universal+' },
  { name: 'Blue Bloods', genres: ['Drama', 'Crimen'], year: 2010, note: 'Universal+' },
  { name: 'From', genres: ['Terror', 'Suspense'], year: 2022, note: 'Universal+' },
  { name: 'La Brea', genres: ['Ciencia ficción', 'Drama'], year: 2021, note: 'Universal+' },
  { name: 'The Walking Dead', genres: ['Terror', 'Drama'], year: 2010 },
  { name: 'Chicago Fire', genres: ['Drama'], year: 2012, note: 'Universal+' },
  { name: 'Chicago P.D.', genres: ['Crimen', 'Drama'], year: 2014, note: 'Universal+' },
  { name: 'New Amsterdam', genres: ['Drama'], year: 2018, note: 'Universal+' },
  { name: 'Brooklyn Nine-Nine', genres: ['Comedia'], year: 2013 },
  { name: 'Parks and Recreation', genres: ['Comedia'], year: 2009 },
  { name: 'Schitt\'s Creek', genres: ['Comedia'], year: 2015 },
  { name: 'Virgin River', genres: ['Drama', 'Romance'], year: 2019 },
  { name: 'Velvet', genres: ['Drama', 'Romance'], year: 2014, note: 'Atresplayer' },
  { name: 'Los Protegidos', genres: ['Drama', 'Familia'], year: 2010, note: 'Atresplayer' },
  { name: 'La Ruta', genres: ['Drama'], year: 2022, note: 'Atresplayer' },
  { name: 'Cardo', genres: ['Drama'], year: 2021, note: 'Atresplayer' },
  { name: 'El secreto de Puente Viejo', genres: ['Drama'], year: 2011, note: 'Atresplayer' },
  { name: 'Wolf', genres: ['Suspense'], year: 2024, note: 'Universal+' },
  { name: 'The Assassin', genres: ['Drama', 'Suspense'], year: 2025, note: 'Universal+' },
]

const claroMovies: Omit<Title, 'id' | 'platform' | 'type' | 'accent'>[] = [
  { name: 'Shrek', genres: ['Animación', 'Familia'], year: 2001, note: 'Universal+' },
  { name: 'Cómo entrenar a tu dragón', genres: ['Animación', 'Familia'], year: 2010, note: 'Universal+' },
  { name: 'Kung Fu Panda', genres: ['Animación', 'Familia'], year: 2008, note: 'Universal+' },
  { name: 'Parque Jurásico', genres: ['Aventuras', 'Ciencia ficción'], year: 1993, note: 'Universal+' },
  { name: 'Volver al futuro', genres: ['Ciencia ficción', 'Comedia'], year: 1985, note: 'Universal+' },
  { name: 'Tiburón', genres: ['Suspense', 'Aventuras'], year: 1975, note: 'Universal+' },
  { name: 'John Wick', genres: ['Acción'], year: 2014, note: 'Universal+' },
  { name: 'Rápidos y furiosos', genres: ['Acción'], year: 2001, note: 'Universal+' },
  { name: 'Cazafantasmas', genres: ['Comedia', 'Fantasía'], year: 1984, note: 'Universal+' },
  { name: 'El Hobbit', genres: ['Aventuras', 'Fantasía'], year: 2012, note: 'Universal+' },
  { name: 'Teléfono negro', genres: ['Terror', 'Suspense'], year: 2021, note: 'Universal+' },
  { name: 'IT', genres: ['Terror'], year: 2017, note: 'Universal+' },
  { name: 'Mi villano favorito', genres: ['Animación', 'Familia'], year: 2010, note: 'Universal+' },
  { name: 'Mamma Mia!', genres: ['Musical', 'Comedia'], year: 2008 },
  { name: 'Un vecino gruñón', genres: ['Drama', 'Comedia'], year: 2022, note: 'Universal+' },
  { name: 'Furiosa: de la saga Mad Max', genres: ['Acción', 'Aventuras'], year: 2024, note: 'Universal+' },
  { name: '007 (selección clásica)', genres: ['Acción', 'Suspense'], year: 2006, note: 'Universal+' },
  { name: 'La gran estafa', genres: ['Crimen', 'Drama'], year: 2001, note: 'Universal+' },
]

const APPLE_ACCENTS = ['#1a3a4a', '#2d4a3e', '#3a4a2f', '#4a3520', '#1f3344', '#3a2a2a', '#243848']
const CLARO_ACCENTS = ['#5c2a1e', '#1e3d35', '#2a3550', '#4a2f1a', '#1a4040', '#3a3020', '#2f3a28']

function build(
  items: Omit<Title, 'id' | 'platform' | 'type' | 'accent' | 'poster'>[],
  platform: Platform,
  type: ContentType,
  accents: string[],
): Title[] {
  return items.map((item, i) => {
    const id = `${platform}-${type}-${i}`
    const poster = (posters as Record<string, string>)[id]
    return {
      ...item,
      id,
      platform,
      type,
      accent: accents[i % accents.length],
      ...(poster ? { poster } : {}),
    }
  })
}

export const catalog: Title[] = [
  ...build(appleSeries, 'apple', 'serie', APPLE_ACCENTS),
  ...build(appleMovies, 'apple', 'pelicula', APPLE_ACCENTS),
  ...build(claroSeries, 'claro', 'serie', CLARO_ACCENTS),
  ...build(claroMovies, 'claro', 'pelicula', CLARO_ACCENTS),
]

export const platformLabel: Record<Platform, string> = {
  apple: 'Apple TV+',
  claro: 'Claro Video',
}

export const typeLabel: Record<ContentType, string> = {
  serie: 'Serie',
  pelicula: 'Película',
}
