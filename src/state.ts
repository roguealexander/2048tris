import { batch, computed, observable } from '@legendapp/state'
import { TileList, TileRecord, TileSize } from './types'
import { rand } from '@ngneat/falso'
import { getTilePower, getTileRadius } from './tiles'

type TileQueue = [TileSize, TileSize, TileSize, TileSize, TileSize, TileSize]

type GameState = {
	activeTile: TileSize
	heldTile: TileSize | null
	queue: TileQueue
	holdAvailable: boolean
	points: number

	mouseX: number
	dropX: number

	activeTileCount: TileRecord<number>
	maxTilesCount: number
	largestTile: TileSize
  efficiency: number
}

type GameActions = {
	releaseTile: () => void
	hold: () => void
	reset: () => void
	topOut: () => void
}

const getQueueTile = (): TileSize => {
	return rand(['2', '2', '2', '4', '4', '4', '8', '8', '8', '16', '16', '32'])
}
const constructInitialQueue = (): TileQueue => {
	return [getQueueTile(), getQueueTile(), getQueueTile(), getQueueTile(), getQueueTile(), getQueueTile()]
}

export const state$ = observable<GameState>({
	activeTile: getQueueTile(),
	heldTile: null,
	queue: constructInitialQueue(),
	holdAvailable: true,
	points: 0,

	mouseX: 0,
	dropX: computed((): number => {
		const radius = getTileRadius(state$.activeTile.get())
		return Math.min(Math.max(radius / 2, state$.mouseX.get()), 450 - radius / 2)
	}),

	activeTileCount: {
		'2': 0,
		'4': 0,
		'8': 0,
		'16': 0,
		'32': 0,
		'64': 0,
		'128': 0,
		'256': 0,
		'512': 0,
		'1024': 0,
		'2048': 0,
		'4096': 0,
		'8192': 0,
	},
	maxTilesCount: computed((): number => {
		let maxCount = 0

		Object.values(state$.activeTileCount.get()).forEach((count) => {
			if (count > maxCount) {
				maxCount = count
			}
		})

		return maxCount
	}),
	largestTile: computed((): TileSize => {
		return (Object.keys(state$.activeTileCount.get())
			.reverse()
			.find((size) => state$.activeTileCount[size as TileSize].peek() > 0) ?? '2') as TileSize
	}),
  efficiency: computed((): number => {
    const activeTileCount = state$.activeTileCount.get()

    const largestTile = [...TileList].reverse().find((size) => {
      console.log('check size', size)
      return activeTileCount[size] > 0
    }) ?? '2'

    const largestPower = getTilePower(largestTile)

    const weightedScore = TileList.slice(0, largestPower).reduce((acc, size, index) => {
      const rawScore = parseInt(size) * activeTileCount[size]
      const adjustedScore = rawScore * (index / largestPower)

      return acc + adjustedScore
    }, 0)

    console.log({
      largestTile,
      largestPower,
      weightedScore
    })

    return Math.round(10000 * (weightedScore / state$.points.get())) / 100
  })
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
