import { observer } from '@legendapp/state/react'
import { state$ } from '../state'
import { Tile } from './tile'
import { ReactNode } from 'react'

const HoldAvailableIndicator = observer(({ children }: { children: ReactNode }) => {
	return <div style={state$.holdAvailable.get() ? {} : { filter: 'grayscale(1)', opacity: 0.7 }}>{children}</div>
})

export const Hold = observer(() => {
	return (
		<div className='flex flex-col gap-2 items-start'>
			<p className='text-xl font-bold text-left'>Hold:</p>
			<div className='flex w-32 h-32 items-center justify-center bg-playarea rounded border-4 border-border'>
				<HoldAvailableIndicator>
					<Tile size={state$.heldTile} />
				</HoldAvailableIndicator>
			</div>
		</div>
	)
})
