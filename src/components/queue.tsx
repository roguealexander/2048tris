import { observer } from "@legendapp/state/react";
import { state$ } from "../state";
import { Tile } from "./tile";

export const Queue = observer(() => {
  return <div className="flex flex-col gap-2 items-start">
    <p className="text-xl font-bold text-left">Next:</p>
    <div className="flex w-32 h-32 items-center justify-center bg-playarea rounded">
      <Tile size={state$.queue[0]} />
    </div>
    <p className="text-xl font-bold text-left">Queue:</p>
    <div className="flex flex-col w-32 gap-2 py-7 items-center justify-center bg-playarea rounded">
      {[1, 2, 3, 4, 5].map((index) => {
        return <div key={index} className="flex w-[105px] h-[105px] items-center justify-center">
          <Tile size={state$.queue[index]} />
          </div>
      })}
    </div>
  </div>
})