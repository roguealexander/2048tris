import { observer, useMount, useUnmount } from "@legendapp/state/react"
import { actions$ } from "../state"

export const HoldListener = observer(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code !== 'Space') return null
    event.preventDefault()
    event.stopPropagation()
    actions$.hold()
  }

  useMount(() => window.addEventListener('keydown', handleKeyDown))
  useUnmount(() => window.removeEventListener('keydown', handleKeyDown))
  
  return null
})