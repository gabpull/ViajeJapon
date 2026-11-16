import { useDeferredValue, useMemo, useState, type CSSProperties } from 'react'
import {
  catalog,
  platformLabel,
  typeLabel,
  type ContentType,
  type Platform,
  type Title,
} from './data/catalog'
import './App.css'

type PlatformFilter = 'all' | Platform
type TypeFilter = 'all' | ContentType

function matches(title: Title, query: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    title.name.toLowerCase().includes(q) ||
    title.genres.some((g) => g.toLowerCase().includes(q)) ||
    (title.note?.toLowerCase().includes(q) ?? false) ||
    platformLabel[title.platform].toLowerCase().includes(q)
  )
}

function TitleCard({ title }: { title: Title }) {
  const [imgFailed, setImgFailed] = useState(false)
  const words = title.name.replace(/[:']/g, '').split(/\s+/).filter(Boolean)
  const initial =
    words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : words
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()
  const showImage = Boolean(title.poster) && !imgFailed

  return (
    <article className="title-card" style={{ '--accent': title.accent } as CSSProperties}>
      <div className={`poster${showImage ? ' has-image' : ''}`}>
        {showImage ? (
          <img
            src={title.poster}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <>
            <span className="poster-initial" aria-hidden="true">
              {initial}
            </span>
            <span className="poster-grain" aria-hidden="true" />
          </>
        )}
      </div>
      <div className="title-meta">
        <div className="title-tags">
          <span className={`plat plat-${title.platform}`}>{platformLabel[title.platform]}</span>
          <span className="kind">{typeLabel[title.type]}</span>
        </div>
        <h3>{title.name}</h3>
        <p className="genres">
          {title.genres.join(' · ')}
          {title.year ? ` · ${title.year}` : ''}
        </p>
        {title.note ? <p className="note">Incluido vía {title.note}</p> : null}
      </div>
    </article>
  )
}

export default function App() {
  const [platform, setPlatform] = useState<PlatformFilter>('all')
  const [type, setType] = useState<TypeFilter>('all')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    return catalog.filter((t) => {
      if (platform !== 'all' && t.platform !== platform) return false
      if (type !== 'all' && t.type !== type) return false
      return matches(t, deferredQuery)
    })
  }, [platform, type, deferredQuery])

  const counts = useMemo(() => {
    const apple = catalog.filter((t) => t.platform === 'apple').length
    const claro = catalog.filter((t) => t.platform === 'claro').length
    return { apple, claro, total: catalog.length }
  }, [])

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-wash" />
          <div className="hero-beam" />
          <div className="hero-grid" />
        </div>
        <nav className="topnav">
          <span className="brand-mark">Incluido</span>
          <a className="nav-jump" href="#catalogo">
            Ver catálogo
          </a>
        </nav>
        <div className="hero-copy">
          <p className="brand">Incluido</p>
          <h1>Lo que ya puedes ver sin pagar de más</h1>
          <p className="lede">
            Películas y series incluidas en Apple TV+ y Claro Video. Sin alquiler, sin compra
            extra, sin PPV.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#catalogo">
              Explorar títulos
            </a>
            <a className="btn ghost" href="#aviso">
              Cómo usarlo
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="notice" id="aviso">
          <h2>Solo contenido incluido</h2>
          <p>
            En la app de Apple TV hay mucho para alquilar o comprar: aquí listamos Apple Originals
            de tu suscripción. En Claro Video excluimos estrenos de alquiler y pago por evento; el
            catálogo (y Universal+ / Atresplayer) puede variar según tu país y plan.
          </p>
        </section>

        <section className="catalog" id="catalogo">
          <div className="catalog-head">
            <div>
              <h2>Catálogo incluido</h2>
              <p className="sub">
                {counts.total} títulos de muestra · {counts.apple} Apple TV+ · {counts.claro} Claro
                Video
              </p>
            </div>
            <label className="search">
              <span className="sr-only">Buscar</span>
              <input
                type="search"
                placeholder="Buscar título, género o plataforma…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="filters" role="group" aria-label="Filtros">
            <div className="filter-row">
              {(
                [
                  ['all', 'Todas'],
                  ['apple', 'Apple TV+'],
                  ['claro', 'Claro Video'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={platform === value ? 'chip on' : 'chip'}
                  onClick={() => setPlatform(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="filter-row">
              {(
                [
                  ['all', 'Series y películas'],
                  ['serie', 'Series'],
                  ['pelicula', 'Películas'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={type === value ? 'chip on' : 'chip'}
                  onClick={() => setType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="result-count" aria-live="polite">
            {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
          </p>

          <div className="grid">
            {filtered.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="empty">No hay coincidencias. Prueba otro filtro o búsqueda.</p>
          ) : null}
        </section>

        <section className="tips">
          <h2>Tips rápidos</h2>
          <ul>
            <li>
              <strong>Apple TV:</strong> abre la pestaña Apple TV (no “Tienda” ni títulos con
              precio de alquiler).
            </li>
            <li>
              <strong>Claro Video:</strong> elige el plan incluido de $0 asociado a tu factura
              Claro; evita títulos marcados como alquiler.
            </li>
            <li>
              La disponibilidad de Claro cambia por país (p. ej. Colombia / México) y por el pack
              de tu línea u hogar.
            </li>
          </ul>
        </section>
      </main>

      <footer className="foot">
        <p>
          Incluido · Guía personal de catálogo incluido · Los listados son orientativos y pueden
          cambiar.
        </p>
      </footer>
    </div>
  )
}
