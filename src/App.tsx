import { useState } from 'react'
import './App.css'
import { observable } from '@legendapp/state'
import { TilePower } from './types'
import { Hold } from './components/hold'
import { Board } from './components/board'
import { Queue } from './components/queue'
import { HoldListener } from './components/hold-listener'

const power1$ = observable<TilePower>(1)
const power2$ = observable<TilePower>(2)
const power3$ = observable<TilePower>(3)
const power4$ = observable<TilePower>(4)
const power5$ = observable<TilePower>(5)
const power6$ = observable<TilePower>(6)
const power7$ = observable<TilePower>(7)
const power8$ = observable<TilePower>(8)
const power9$ = observable<TilePower>(9)
const power10$ = observable<TilePower>(10)
const power11$ = observable<TilePower>(11)

function App() {
  return (
    <>
      <div className='flex flex-row gap-4'>
      <HoldListener />
      <Hold />
      <Board />
      <Queue />
      {/* <Tile power$={power1$} />
      <Tile power$={power2$} />
      <Tile power$={power3$} />
      <Tile power$={power4$} />
      <Tile power$={power5$} />
      <Tile power$={power6$} />
      <Tile power$={power7$} />
      <Tile power$={power8$} />
      <Tile power$={power9$} />
      <Tile power$={power10$} />
      <Tile power$={power11$} /> */}
      </div>
    </>
  )
}

export default App
