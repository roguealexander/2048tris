import { observer } from '@legendapp/state/react'
import { state$ } from '../state'
import { Tile } from './tile'
import { ReactNode } from 'react'

const HoldAvailableIndicator = observer(({ children }: { children: ReactNode }) => {
	return <div style={state$.holdAvailable.get() ? {} : { filter: 'grayscale(1)', opacity: 0.7 }}>{children}</div>
})

export const Hold = observer(() => {
	return (
    <>
			<p className='text-xl text-left'>Hold:</p>
			<div className='flex w-32 h-32 items-center justify-center bg-playarea border-4 border-border'>
				<HoldAvailableIndicator>
					<Tile size={state$.heldTile} />
				</HoldAvailableIndicator>
			</div>
    </>
	)
})
