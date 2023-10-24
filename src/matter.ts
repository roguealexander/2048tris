import './style.css'
import {Bodies, Composite, Engine, Render, Runner, Svg} from 'matter-js'
import { getTileData } from './tiles';

const canvas = document.getElementById('canvas') as HTMLCanvasElement
canvas.width = 800;
canvas.height = 500;
const engine = Engine.create();
const render = Render.create({
  engine: engine,
  canvas: canvas,
  options: {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    wireframes: false
  }
});
const ground = Bodies.rectangle(400, 500, 800, 10, {isStatic: true});
const leftWall = Bodies.rectangle(0, 0, 10, 1000, {isStatic: true});
const rightWall = Bodies.rectangle(800, 0, 10, 1000, {isStatic: true});
Composite.add(engine.world, [ground, leftWall, rightWall]);
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);


const createTile = (tilePower: number, x: number, y: number) => {
  const tileData = getTileData(tilePower)
  return Bodies.circle(x, y, 10 * tileData.radius, {
    render: {
      fillStyle: tileData.color,
      text:{ 
        content: tilePower,
        color: tileData.textColor,
        size: 16,
      }
    }
  })
}


for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
    const body = createTile(i, 350 + i, 0);
    Composite.add(engine.world, [body]);
  }, i * 500)
}
