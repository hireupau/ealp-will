import { useEffect, useRef, useState } from 'react'

const COFFEES = ['Flat White', 'Long Black'] as const
const FULFILMENTS = ['Pick up', 'Delivery'] as const

type Coffee = (typeof COFFEES)[number]
type Fulfilment = (typeof FULFILMENTS)[number]

/** Scrolls the returned section into view the moment it becomes active. */
function useRevealScroll(active: boolean) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [active])

  return ref
}

function orderReference() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export default function App() {
  const [coffee, setCoffee] = useState<Coffee | null>(null)
  const [fulfilment, setFulfilment] = useState<Fulfilment | null>(null)
  const [reference, setReference] = useState<string | null>(null)

  const showFulfilment = coffee !== null
  const showSubmit = showFulfilment && fulfilment !== null
  const showConfirmation = reference !== null

  const fulfilmentRef = useRevealScroll(showFulfilment)
  const submitRef = useRevealScroll(showSubmit)
  const confirmationRef = useRevealScroll(showConfirmation)

  function chooseCoffee(choice: Coffee) {
    if (choice === coffee) return
    setCoffee(choice)
    setFulfilment(null)
    setReference(null)
  }

  function chooseFulfilment(choice: Fulfilment) {
    if (choice === fulfilment) return
    setFulfilment(choice)
    setReference(null)
  }

  function startOver() {
    setCoffee(null)
    setFulfilment(null)
    setReference(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main>
      <section className="step">
        <h1>What coffee would you like to order?</h1>
        <div className="options">
          {COFFEES.map((option) => (
            <button
              key={option}
              type="button"
              className={option === coffee ? 'option selected' : 'option'}
              aria-pressed={option === coffee}
              onClick={() => chooseCoffee(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {showFulfilment && (
        <section className="step" ref={fulfilmentRef}>
          <h2>How would you like it?</h2>
          <div className="options">
            {FULFILMENTS.map((option) => (
              <button
                key={option}
                type="button"
                className={option === fulfilment ? 'option selected' : 'option'}
                aria-pressed={option === fulfilment}
                onClick={() => chooseFulfilment(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      )}

      {showSubmit && (
        <section className="step" ref={submitRef}>
          <h2>Ready to go</h2>
          <p className="summary">
            One <strong>{coffee}</strong> for <strong>{fulfilment?.toLowerCase()}</strong>.
          </p>
          <button type="button" className="submit" onClick={() => setReference(orderReference())}>
            Submit Order
          </button>
        </section>
      )}

      {showConfirmation && (
        <section className="step" ref={confirmationRef}>
          <p className="tick" aria-hidden="true">
            ☕
          </p>
          <h2>Order complete</h2>
          <dl className="receipt">
            <dt>Coffee</dt>
            <dd>{coffee}</dd>
            <dt>Collection</dt>
            <dd>{fulfilment}</dd>
            <dt>Order</dt>
            <dd>#{reference}</dd>
          </dl>
          <button type="button" className="ghost" onClick={startOver}>
            Order another
          </button>
        </section>
      )}
    </main>
  )
}
