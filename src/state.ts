import { batch, observable } from "@legendapp/state"
import { TileSize } from "./types"
import { rand } from "@ngneat/falso"

type TileQueue = [TileSize, TileSize, TileSize, TileSize, TileSize, TileSize]

type GameState = {
  activeTile: TileSize
  heldTile: TileSize | null
  queue: TileQueue
  holdAvailable: boolean
  points: number
}

type GameActions = {
  releaseTile: () => void
  hold: () => void
  reset: () => void
  topOut: () => void
}

const getQueueTile = (): TileSize => {
  return  rand(['2', '2', '4', '4', '8', '8', '16', '32'])
}
const constructInitialQueue = (): TileQueue  => {
  return [
    getQueueTile(),
    getQueueTile(),
    getQueueTile(),
    getQueueTile(),
    getQueueTile(),
    getQueueTile(),
  ]
}

export const state$ = observable<GameState>({
  activeTile: getQueueTile(),
  heldTile: null,
  queue: constructInitialQueue(),
  holdAvailable: true,
  points: 0,
})

const pullActiveTileFromQueue = () => {
  state$.activeTile.set(state$.queue[0].peek())
}

const advanceQueue = () => {
  state$.queue.set((queue: TileQueue) => queue.slice(1).concat(getQueueTile()) as TileQueue)
}

const setHeldTile = (tile: TileSize) => {
  state$.heldTile.set(tile)
}

const addPoints = (additional: number) => {
  state$.points.set((points) => points + additional)
}

const resetHoldAvailable = () => {
  state$.holdAvailable.set(true)
}

const swapActiveAndHeldTiles = () => {
  const heldTile = state$.heldTile.peek()
  const activeTile = state$.activeTile.peek()
  state$.heldTile.set(activeTile)
  state$.activeTile.set(heldTile)
  state$.holdAvailable.set(false)
}

export const actions$ = observable<GameActions>({
  releaseTile: () => {
    batch(() => {
      const activeTile = state$.activeTile.peek()

      addPoints(parseInt(activeTile))
      pullActiveTileFromQueue()
      advanceQueue()
      resetHoldAvailable()
    })
  },
  hold: () => {
    console.log('hold pressed')
    batch(() => {
      // Exit if hold action already used
      const holdAvailable = state$.holdAvailable.peek()
      if (!holdAvailable) {
        return
      }
      
      // If no tile in hold, pull from queue
      const heldTile = state$.heldTile.peek()
      if (heldTile == null) {
        setHeldTile(state$.activeTile.peek())
        pullActiveTileFromQueue()
        advanceQueue()
        return
      }
      
      // Switch active and held tiles
      swapActiveAndHeldTiles()      
    })
  },
  reset: () => null,
  topOut: () => null,
})

