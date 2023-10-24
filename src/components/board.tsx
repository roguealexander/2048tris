import { Memo, observer } from '@legendapp/state/react'
import { actions$, state$ } from '../state'
import { Tile } from './tile'

export const Board = observer(() => {
	return (
		<div className='flex flex-col gap-2 items-start'>
			<p className='text-xl font-bold text-left'>
				Score: <Memo>{state$.points}</Memo>
			</p>
			<div className='flex flex-col w-[500px] h-[820px] bg-playarea rounded-b-2xl border-8 border-t-0 border-border'>
				<Tile size={state$.activeTile} />
				<button onClick={() => actions$.releaseTile()}>Release</button>
			</div>
		</div>
	)
})
