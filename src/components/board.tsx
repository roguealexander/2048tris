import { Memo, observer } from '@legendapp/state/react'
import { actions$, state$ } from '../state'
import { Tile } from './tile'
import { Engine, Render, World, Bodies, Runner } from 'matter-js'
import { useRef, useEffect, ReactNode } from 'react'
import { getTileRadius } from '../tiles'

const TileDropPositioner = observer(({ children }: { children: ReactNode }) => {
	const dropX = state$.dropX.get()
	return <div className='absolute pointer-events-none' style={{left: dropX, transform: "translate(-50%, -50%)" }}>
		{children}
	</div>
})

export const Board = observer(() => {
	const scene = useRef<HTMLDivElement | null>(null)
	const engine = useRef(Engine.create({
		gravity: {x: 0, y: 0.5}
	}))

	useEffect(() => {
		const cw = 500 * 2
		const ch = 820 * 2

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

	const releaseBall = (e) => {
		const ball = Bodies.circle(state$.dropX.get() * 2, 50, 10 + Math.random() * 30, {
			mass: 0.1,
			restitution: 0,
			friction: 0.005,
			render: {
				fillStyle: '#0000ff',
			},
		})
		World.add(engine.current.world, [ball])
		actions$.releaseTile()
	}

	const moveBall = (e) => {
		state$.mouseX.set(e.nativeEvent.offsetX)
	}

	return (
		<div className='flex flex-col relative gap-2 items-start'>
			<p className='text-xl font-bold text-left'>
				Score: <Memo>{state$.points}</Memo>
			</p>
			<div ref={scene} onMouseDown={releaseBall} onMouseMove={moveBall} className='flex flex-col relative w-[500px] h-[820px] bg-playarea rounded-b border-4 border-t-0 border-border' style={{boxSizing: 'content-box'}}>
				<TileDropPositioner>
					<Tile size={state$.activeTile} />
				</TileDropPositioner>
				{/* <Tile size={state$.activeTile} />
				<button onClick={() => actions$.releaseTile()}>Release</button> */}
			</div>
		</div>
	)
})
