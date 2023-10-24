import { Memo, observer } from '@legendapp/state/react'
import { state$ } from '../state'
import { TileList } from '../types'
import { getTileColor } from '../tiles'

const ActiveTilesHistogram = observer(() => {
	const maxTilesCount = state$.maxTilesCount.get()
	const activeTileCount = state$.activeTileCount.get()
	return (
		<div className='flex flex-col items-center justify-start w-full'>
			{TileList.map((size) => {
				return (
					<div
            key={size}
						className='w-full h-7 flex relative items-start'
					>
						<div
							className='absolute right-0 top-0 h-7 flex'
							style={{
                backgroundColor: getTileColor(size),
                width: `${Math.max(5, (70 * activeTileCount[size]) / maxTilesCount)}%`,
                opacity: activeTileCount[size] > 0 ? 1 : 0.5
              }}
						/>
						<p className='text-md font-bold text-left w-full text-text z-10'>{size}</p>
					</div>
				)
			})}
		</div>
	)
})

export const Stats = observer(() => {
	return (
		<>
			<p className='text-lg text-left'>
				Score:
				<br />
				<b>
					<Memo>{state$.points}</Memo>
				</b>
			</p>
			<p className='text-lg text-left'>
				Efficiency:
				<br />
				<b>
					<Memo>{state$.efficiency}</Memo>%
				</b>
			</p>
			<p className='text-lg text-left'>Histogram:</p>
			<ActiveTilesHistogram />
		</>
	)
})
