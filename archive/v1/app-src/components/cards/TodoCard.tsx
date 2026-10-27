import { useStore } from '../../lib/store'
import type { Item } from '../../lib/types'
import { Icon } from '../Icon'

export function TodoCard({ item }: { item: Item }) {
  const { patchItem } = useStore()
  const done = Boolean(item.done)
  return (
    <div className="todo-card" data-done={done}>
      <button
        type="button"
        className="check"
        role="checkbox"
        aria-checked={done}
        aria-label={`${done ? 'Mark not done' : 'Mark done'}: ${item.text}`}
        onClick={() => patchItem(item.id, { done: !done })}
      >
        <span className="check__box">{done && <Icon name="check" size={18} />}</span>
      </button>
      <p className="todo-card__text">{item.text}</p>
    </div>
  )
}
