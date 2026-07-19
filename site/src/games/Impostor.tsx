import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { impostorCategories, getCategoryById } from './categories'

// Impostor — pass-and-play social deduction. Same rules as the original:
// 3–12 players, one random impostor. Innocents see the secret word; the
// impostor sees nothing and has to bluff through the discussion.

const MIN_PLAYERS = 3
const MAX_PLAYERS = 12

type Session = {
  playerCount: number
  categoryName: string
  word: string
  impostorIndex: number
}

function makeSession(playerCount: number, categoryId: string): Session {
  const category = getCategoryById(categoryId)!
  return {
    playerCount,
    categoryName: category.name,
    word: category.words[Math.floor(Math.random() * category.words.length)],
    impostorIndex: Math.floor(Math.random() * playerCount),
  }
}

export default function Impostor() {
  const [phase, setPhase] = useState<'setup' | 'reveal' | 'discuss'>('setup')
  const [players, setPlayers] = useState(5)
  const [categoryId, setCategoryId] = useState(impostorCategories[0].id)
  const [session, setSession] = useState<Session | null>(null)
  const [current, setCurrent] = useState(0)
  const [shown, setShown] = useState(false)

  const category = useMemo(() => getCategoryById(categoryId), [categoryId])

  const start = () => {
    setSession(makeSession(players, categoryId))
    setCurrent(0)
    setShown(false)
    setPhase('reveal')
  }

  const next = () => {
    if (!session) return
    if (current + 1 >= session.playerCount) {
      setPhase('discuss')
    } else {
      setCurrent((c) => c + 1)
      setShown(false)
    }
  }

  const isImpostor = session !== null && current === session.impostorIndex

  return (
    <div className="imp">
      <nav className="case-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← Back to the site</Link>
      </nav>

      {phase === 'setup' && (
        <div className="imp-setup">
          <div className="case-kicker">Off the clock</div>
          <h1>Impostor.</h1>
          <p className="imp-rules">
            Pass-and-play social deduction. Everyone sees the secret word — except <b>one
            impostor</b>, who has to bluff through the discussion without knowing it.
            Take turns describing the word; vote out the faker. No refunds.
          </p>

          <div className="imp-field">
            <h3>Players</h3>
            <div className="imp-stepper">
              <button
                aria-label="Fewer players"
                onClick={() => setPlayers((p) => Math.max(MIN_PLAYERS, p - 1))}
                disabled={players <= MIN_PLAYERS}
              >−</button>
              <span className="imp-count">{players}</span>
              <button
                aria-label="More players"
                onClick={() => setPlayers((p) => Math.min(MAX_PLAYERS, p + 1))}
                disabled={players >= MAX_PLAYERS}
              >+</button>
            </div>
            <p className="imp-note">{MIN_PLAYERS}–{MAX_PLAYERS} players. Exactly one will be the impostor.</p>
          </div>

          <div className="imp-field">
            <h3>Category</h3>
            <div className="imp-cats">
              {impostorCategories.map((c) => (
                <button
                  key={c.id}
                  className={'imp-cat' + (c.id === categoryId ? ' active' : '')}
                  aria-pressed={c.id === categoryId}
                  onClick={() => setCategoryId(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {category && <p className="imp-note">{category.words.length} words in the deck.</p>}
          </div>

          <button className="imp-start" onClick={start}>Deal the roles →</button>
        </div>
      )}

      {phase === 'reveal' && session && (
        <div className="imp-stage">
          <div className="imp-progress">
            Player {current + 1} of {session.playerCount} · {session.categoryName}
            <button className="imp-abort" onClick={() => setPhase('setup')}>Start over</button>
          </div>

          {!shown ? (
            <div className="imp-card">
              <div className="imp-pass">Pass the phone to</div>
              <div className="imp-player">Player {current + 1}</div>
              <p className="imp-note">Only tap when it's actually you. No peeking.</p>
              <button className="imp-start" onClick={() => setShown(true)}>Show my role</button>
            </div>
          ) : (
            <div className={'imp-card' + (isImpostor ? ' is-imp' : ' is-inn')}>
              <div className="imp-pass">Your role</div>
              <div className="imp-role">{isImpostor ? 'IMPOSTOR' : 'INNOCENT'}</div>
              {isImpostor ? (
                <p className="imp-secret-note">
                  You don't get the word. Keep a straight face, listen hard, and bluff.
                </p>
              ) : (
                <>
                  <div className="imp-pass" style={{ marginTop: 18 }}>The secret word</div>
                  <div className="imp-word">{session.word}</div>
                </>
              )}
              <button className="imp-start" onClick={next}>
                {current + 1 >= session.playerCount ? "Everyone's in →" : 'Hide & pass →'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'discuss' && session && (
        <div className="imp-stage">
          <div className="imp-card">
            <div className="case-kicker">All roles assigned</div>
            <h2 className="imp-discuss-h">Start talking.</h2>
            <p className="imp-rules">
              Take turns describing the {session.categoryName.toLowerCase()} word without
              saying it. The impostor is improvising — when you're ready, vote. Then check
              your answer below.
            </p>
            <RevealAnswer session={session} />
            <div className="imp-row">
              <button className="imp-start" onClick={start}>New round — same setup</button>
              <button className="imp-alt" onClick={() => setPhase('setup')}>Change setup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RevealAnswer({ session }: { session: Session }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="imp-answer">
      {open ? (
        <p>
          The impostor was <b>Player {session.impostorIndex + 1}</b>. The word was{' '}
          <b>{session.word}</b>.
        </p>
      ) : (
        <button className="imp-alt" onClick={() => setOpen(true)}>Reveal the answer</button>
      )}
    </div>
  )
}
