import './App.css'
import { Hold } from './components/hold'
import { Board } from './components/board'
import { Queue } from './components/queue'
import { HoldListener } from './components/hold-listener'
import { ActiveTilesHistogram, Stats } from './components/stats'

function App() {
  return (
    <>
      <div className='flex flex-row gap-16'>
        <HoldListener />
        <div className='flex flex-col gap-4 items-start'>
        <Hold />
        <Stats />
        <ActiveTilesHistogram />
        </div>
        <Board />
        <Queue />
      </div>
    </>
  )
}

export default App
