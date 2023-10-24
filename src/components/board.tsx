import { observer } from '@legendapp/state/react'
import { actions$, state$ } from '../state'
import { Tile } from './tile'
import { Engine, Render, World, Events, Bodies, Runner } from 'matter-js'
import { useRef, useEffect, ReactNode } from 'react'
import { getMergedTileSize, getTileRadius, getTileSizeFromRadius } from '../tiles'
import ball2 from '../assets/2.png'
import ball4 from '../assets/4.png'
import ball8 from '../assets/8.png'
import ball16 from '../assets/16.png'
import ball32 from '../assets/32.png'
import ball64 from '../assets/64.png'
import ball128 from '../assets/128.png'
import ball256 from '../assets/256.png'
import ball512 from '../assets/512.png'
import ball1024 from '../assets/1024.png'
import ball2048 from '../assets/2048.png'
import ball4096 from '../assets/4096.png'
import ball8192 from '../assets/8192.png'
import { TileRecord } from '../types'
import { batch } from '@legendapp/state'

const width = 450
const height = 700
let lastDroppedTileId = -1

const tileAsset: TileRecord<string> = {
	'2': ball2,
	'4': ball4,
	'8': ball8,
	'16': ball16,
	'32': ball32,
	'64': ball64,
	'128': ball128,
	'256': ball256,
	'512': ball512,
	'1024': ball1024,
	'2048': ball2048,
	'4096': ball4096,
	'8192': ball8192,
}

const handledCollision: Record<string, boolean> = {}
let tileId = 450

const TileDropPositioner = observer(({ children }: { children: ReactNode }) => {
	const dropX = state$.dropX.get()
	if (state$.toppedOut.get()) return null
	return (
		<div className='absolute pointer-events-none' style={{ left: dropX, top: 64, transform: 'translate(-50%, -50%)' }}>
			{children}
		</div>
	)
})

export const Board = observer(() => {
	const scene = useRef<HTMLDivElement | null>(null)
	const engine = useRef(
		Engine.create({
			gravity: { x: 0, y: 1 },
		})
	)
	const runner = useRef(Runner.create())

	runner.current.enabled = !state$.toppedOut.get()

	useEffect(() => {
		const cw = (width + (64 * 2)) * 2
		const ch = (height + (64 * 2)) * 2

		const render = Render.create({
			element: scene.current,
			engine: engine.current,
			options: {
				width: cw,
				height: ch,
				wireframes: false,
				background: 'transparent',
			},
		})

		const topBoundary = Bodies.rectangle(cw / 2, -20 + 64, cw, 40, { id: 100, isSensor: true, isStatic: true, render: { fillStyle: 'red',opacity: 0.2 } })

		World.add(engine.current.world, [
			// Top Boundary
			topBoundary,

			// Left Boundary
			Bodies.rectangle(-20 + 128, ch / 2, 40, ch, { isStatic: true, render: { opacity: 0.2 } }),
			// Bottom Boundary
			Bodies.rectangle(cw / 2, ch + 20 - 128, cw, 40, { isStatic: true, render: { opacity: 0.2 } }),
			// Right Boundary
			Bodies.rectangle(cw + 20 - 128, ch / 2, 40, ch, { isStatic: true, render: { opacity: 0.2 } }),
		])

		Runner.start(runner.current, engine.current)
		Render.run(render)

		Events.on(engine.current, 'collisionActive', (event) => {
			const { pairs } = event

			pairs.forEach((pair) => {
				const { id, bodyA, bodyB } = pair

				if ((bodyA.id === 100 && bodyB.id !== lastDroppedTileId) || (bodyB.id === 100 && bodyA.id !== lastDroppedTileId)) {
					actions$.topOut()
				}

				if (handledCollision[id]) return
				handledCollision[id] = true

				const aRadius = bodyA.circleRadius
				const bRadius = bodyB.circleRadius

				if (aRadius === bRadius && aRadius != null) {
					World.remove(engine.current.world, bodyA)
					World.remove(engine.current.world, bodyB)

					const size = getTileSizeFromRadius(aRadius)
					const mergedSize = getMergedTileSize(size)
					const mergedRadius = getTileRadius(mergedSize)

					batch(() => {
						state$.activeTileCount[size].set((count) => count - 2)
						state$.activeTileCount[mergedSize].set((count) => count + 1)
					})

					const x = (bodyA.position.x + bodyB.position.x) / 2
					const y = (bodyA.position.y + bodyB.position.y) / 2

					const ball = Bodies.circle(x, y, mergedRadius, {
						density: 0.00005,
						restitution: 0.2,
						friction: 0.005,
						id: ++tileId,
						render: {
							sprite: {
								texture: tileAsset[mergedSize],
								xScale: 1,
								yScale: 1,
							},
						},
					})

					World.add(engine.current.world, [ball])
				}
			})
		})

		return () => {
			Render.stop(render)
			World.clear(engine.current.world, false)
			Engine.clear(engine.current)
			render.canvas.remove()
			render.canvas = null
			render.context = null
			render.textures = {}
		}
	}, [])

	const releaseBall = () => {
		if (state$.toppedOut.get()) return

		const radius = getTileRadius(state$.activeTile.peek())

		lastDroppedTileId = ++tileId

		const ball = Bodies.circle(state$.dropX.get() * 2, 64 * 2, radius, {
			density: 0.00005,
			restitution: 0.2,
			friction: 0.005,
			id: lastDroppedTileId,
			render: {
				sprite: {
					texture: tileAsset[state$.activeTile.peek()],
					xScale: 1,
					yScale: 1,
				},
			},
		})

		state$.activeTileCount[state$.activeTile.peek()].set((count) => count + 1)
		World.add(engine.current.world, [ball])
		actions$.releaseTile()
	}

	const moveBall = (e) => {
		state$.mouseX.set(e.nativeEvent.offsetX)
	}

	return (
		<div className='flex flex-col relative gap-4 items-start'>
			<p className='text-xl font-bold text-left italic'>2048tris</p>
			<div className='flex relative bg-playarea border-4 border-t-0 border-border' style={{ boxSizing: 'content-box', width, height }}>
				<div
					ref={scene}
					onMouseDown={releaseBall}
					onMouseMove={moveBall}
					className='flex flex-col absolute '
					style={{ width: width + (64 * 2), height: height + (64), left: -64, top: -64 }}
				>
					<TileDropPositioner>
						<Tile size={state$.activeTile} />
					</TileDropPositioner>
				</div>
			</div>
		</div>
	)
})
