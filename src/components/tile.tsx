import { getTileData, getTileStyle } from '../tiles'
import { TileSize } from '../types'
import { Observable } from '@legendapp/state'
import { observer } from '@legendapp/state/react'

export const PlaceholderTile = () => {
	return <div className='flex rounded-full w-[60px] h-[60px] bg-text opacity-50' />
}

export const Tile = observer(({ size }: { size?: Observable<TileSize | null> }) => {
	const tileSize = size?.get()
	if (tileSize == null) return <PlaceholderTile />

	const tileData = getTileData(tileSize)!

	return (
		<div className='flex justify-center align-center rounded-full' style={getTileStyle(tileData)}>
			<p className='text-lg text-slate-600 self-center font-bold' style={{color: tileData.textColor}}>{tileData.size}</p>
		</div>
	)
})
