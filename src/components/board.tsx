import { Memo, observer } from '@legendapp/state/react'
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

const ignoredBodies: Record<number, boolean> = {}
const handledCollision: Record<string, boolean> = {}
let tileId = 450

const TileDropPositioner = observer(({ children }: { children: ReactNode }) => {
	const dropX = state$.dropX.get()
	return (
		<div className='absolute pointer-events-none' style={{ left: dropX, transform: 'translate(-50%, -50%)' }}>
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

	useEffect(() => {
		const cw = width * 2
		const ch = height * 2

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

		World.add(engine.current.world, [
			Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
			Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
			Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
			Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
		])

		Runner.run(engine.current)
		Render.run(render)

		Events.on(engine.current, 'collisionActive', (event) => {
			const { pairs } = event

			pairs.forEach((pair) => {
				const { id, bodyA, bodyB } = pair

				if (handledCollision[id]) return
				handledCollision[id] = true

				const aRadius = bodyA.circleRadius
				const bRadius = bodyB.circleRadius

				if (aRadius === bRadius && aRadius != null) {
					console.log('merge', id)

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
		const radius = getTileRadius(state$.activeTile.peek())
		
		const ball = Bodies.circle(state$.dropX.get() * 2, radius / 2, radius, {
			density: 0.00005,
			restitution: 0.2,
			friction: 0.005,
			id: ++tileId,
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
			<p className='text-xl font-bold text-left'>
				{' '}
			</p>
			<div
				ref={scene}
				onMouseDown={releaseBall}
				onMouseMove={moveBall}
				className='flex flex-col relative w-[450px] h-[700px] bg-playarea border-4 border-t-0 border-border'
				style={{ boxSizing: 'content-box' }}
			>
				<TileDropPositioner>
					<Tile size={state$.activeTile} />
				</TileDropPositioner>
				{/* <Tile size={state$.activeTile} />
				<button onClick={() => actions$.releaseTile()}>Release</button> */}
			</div>
		</div>
	)
})
