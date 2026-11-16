/**
 * Fetches poster URLs (TVMaze for series, Wikipedia for movies)
 * and writes src/data/posters.json keyed by catalog id.
 */
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

/** English / Wikipedia-friendly lookup overrides by display name */
const LOOKUP = {
  Nocturno: 'Nocturne',
  '12 12 12': '12 12 12',
  'Materia oscura': 'Dark Matter',
  Separación: 'Severance',
  'Terapia sin filtro': 'Shrinking',
  'Vicios ocultos': 'Your Friends & Neighbors',
  Stick: 'Stick Owen Wilson',
  'Siendo Heumann': 'Being Heumann',
  Matchbox: 'Matchbox The Movie',
  'Plan en familia 2': 'The Family Plan 2',
  'Plan en familia': 'The Family Plan',
  'La Ley y el Orden': 'Law & Order',
  'El secreto de Puente Viejo': 'The Secret of Old Bridge',
  'Cómo entrenar a tu dragón': 'How to Train Your Dragon',
  'Parque Jurásico': 'Jurassic Park',
  'Volver al futuro': 'Back to the Future',
  Tiburón: 'Jaws',
  'Rápidos y furiosos': 'The Fast and the Furious',
  Cazafantasmas: 'Ghostbusters',
  'El Hobbit': 'The Hobbit An Unexpected Journey',
  'Teléfono negro': 'The Black Phone',
  'Mi villano favorito': 'Despicable Me',
  'Un vecino gruñón': 'A Man Called Otto',
  'Furiosa: de la saga Mad Max': 'Furiosa A Mad Max Saga',
  '007 (selección clásica)': 'Casino Royale',
  'La gran estafa': 'Ocean\'s Eleven',
  'Los Protegidos': 'Los Protegidos',
  'La Ruta': 'La Ruta',
  Cardo: 'Cardo',
  Velvet: 'Velvet',
  Wolf: 'Wolf',
  'The Assassin': 'The Assassin',
  From: 'From',
  Ted: 'Ted',
  See: 'See',
  Surface: 'Surface',
  Invasion: 'Invasion',
  Trying: 'Trying',
  Sugar: 'Sugar',
  Luck: 'Luck',
  Blitz: 'Blitz',
  Napoleon: 'Napoleon',
  Emancipation: 'Emancipation',
  Ghosted: 'Ghosted',
  Spirited: 'Spirited',
  Outcome: 'Outcome',
  Eternity: 'Eternity',
  Mayday: 'Mayday',
  Tenzing: 'Tenzing',
  Palmer: 'Palmer',
  CODA: 'CODA',
  Finch: 'Finch',
  Tetris: 'Tetris',
  Greyhound: 'Greyhound',
  Argylle: 'Argylle',
  'John Wick': 'John Wick',
  IT: 'It',
  'Mamma Mia!': 'Mamma Mia!',
  Shrek: 'Shrek',
  'Kung Fu Panda': 'Kung Fu Panda',
}

const WIKI_PAGES = {
  CODA: 'CODA_(2021_film)',
  Finch: 'Finch_(film)',
  Tetris: 'Tetris_(film)',
  Greyhound: 'Greyhound_(film)',
  Palmer: 'Palmer_(film)',
  Ghosted: 'Ghosted_(2023_film)',
  Spirited: 'Spirited_(film)',
  'Killers of the Flower Moon': 'Killers_of_the_Flower_Moon',
  'Fly Me to the Moon': 'Fly_Me_to_the_Moon_(2024_film)',
  Argylle: 'Argylle',
  Wolfs: 'Wolfs',
  'The Gorge': 'The_Gorge_(film)',
  Napoleon: 'Napoleon_(2023_film)',
  Emancipation: 'Emancipation_(2022_film)',
  'Cha Cha Real Smooth': 'Cha_Cha_Real_Smooth',
  Wolfwalkers: 'Wolfwalkers',
  'Still: A Michael J. Fox Movie': 'Still:_A_Michael_J._Fox_Movie',
  Luck: 'Luck_(2022_film)',
  'Plan en familia': 'The_Family_Plan',
  'The Instigators': 'The_Instigators',
  Blitz: 'Blitz_(2024_film)',
  Shrek: 'Shrek',
  'Cómo entrenar a tu dragón': 'How_to_Train_Your_Dragon_(2010_film)',
  'Kung Fu Panda': 'Kung_Fu_Panda',
  'Parque Jurásico': 'Jurassic_Park_(film)',
  'Volver al futuro': 'Back_to_the_Future',
  Tiburón: 'Jaws_(film)',
  'John Wick': 'John_Wick_(film)',
  'Rápidos y furiosos': 'The_Fast_and_the_Furious_(2001_film)',
  Cazafantasmas: 'Ghostbusters',
  'El Hobbit': 'The_Hobbit:_An_Unexpected_Journey',
  'Teléfono negro': 'The_Black_Phone',
  IT: 'It_(2017_film)',
  'Mi villano favorito': 'Despicable_Me',
  'Mamma Mia!': 'Mamma_Mia!_(film)',
  'Un vecino gruñón': 'A_Man_Called_Otto',
  'Furiosa: de la saga Mad Max': 'Furiosa:_A_Mad_Max_Saga',
  '007 (selección clásica)': 'Casino_Royale_(2006_film)',
  'La gran estafa': 'Ocean%27s_Eleven_(2001_film)',
}

async function getJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'IncluidoCatalog/1.0 (personal catalog app)' },
  })
  if (!res.ok) return null
  return res.json()
}

async function tvmaze(query) {
  const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`
  const data = await getJson(url)
  if (!data?.image) return null
  return data.image.original || data.image.medium || null
}

async function wikipedia(page) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${page}`
  const data = await getJson(url)
  if (!data || data.type === 'disambiguation') return null
  return data.originalimage?.source || data.thumbnail?.source || null
}

async function wikipediaSearch(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
  const data = await getJson(url)
  const title = data?.query?.search?.[0]?.title
  if (!title) return null
  return wikipedia(encodeURIComponent(title.replace(/ /g, '_')))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// Dynamic import of catalog via a tiny generated bridge — parse titles from the TS file instead
import { readFileSync } from 'node:fs'

function parseCatalog() {
  const src = readFileSync(path.join(ROOT, 'src/data/catalog.ts'), 'utf8')
  const blocks = [
    ['apple', 'serie', 'appleSeries'],
    ['apple', 'pelicula', 'appleMovies'],
    ['claro', 'serie', 'claroSeries'],
    ['claro', 'pelicula', 'claroMovies'],
  ]
  const items = []
  for (const [platform, type, varName] of blocks) {
    const re = new RegExp(`const ${varName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`)
    const m = src.match(re)
    if (!m) throw new Error(`Missing ${varName}`)
    const names = [...m[1].matchAll(/name:\s*'((?:\\'|[^'])*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    )
    names.forEach((name, i) => {
      items.push({ id: `${platform}-${type}-${i}`, name, type, platform })
    })
  }
  return items
}

const posters = {}
const items = parseCatalog()
let found = 0

for (const item of items) {
  const lookup = LOOKUP[item.name] || item.name
  let url = null
  try {
    if (item.type === 'serie') {
      url = await tvmaze(lookup)
      if (!url) url = await tvmaze(item.name)
    } else {
      const page = WIKI_PAGES[item.name]
      if (page) url = await wikipedia(page)
      if (!url) url = await wikipediaSearch(`${lookup} film`)
      if (!url) url = await wikipediaSearch(lookup)
      // some Apple films also appear as TVMaze? skip
    }
  } catch (e) {
    console.warn('error', item.name, e.message)
  }
  if (url) {
    posters[item.id] = url
    found++
    console.log('✓', item.name)
  } else {
    console.log('✗', item.name)
  }
  await sleep(250)
}

const out = path.join(ROOT, 'src/data/posters.json')
writeFileSync(out, JSON.stringify(posters, null, 2) + '\n')
console.log(`\nWrote ${found}/${items.length} posters → ${out}`)
