import { colors } from "./colors";
import { TileSize, TileData, TileRecord } from "./types";

const tile2: TileData = {
  size: '2',
  power: 1,
  radius: 1,
  density: 1,
  color: colors.tile['2'],
  textColor: colors.text,
}
const tile4: TileData = {
  size: '4',
  power: 2,
  radius: 2,
  density: 1,
  color: colors.tile['4'],
  textColor: colors.text,
}
const tile8: TileData = {
  size: '8',
  power: 3,
  radius: 3,
  density: 1,
  color: colors.tile['8'],
  textColor: colors.background,
}
const tile16: TileData = {
  size: '16',
  power: 4,
  radius: 4,
  density: 1,
  color: colors.tile['16'],
  textColor: colors.background,
}
const tile32: TileData = {
  size: '32',
  power: 5,
  radius: 5,
  density: 1,
  color: colors.tile['32'],
  textColor: colors.background,
}
const tile64: TileData = {
  size: '64',
  power: 6,
  radius: 6,
  density: 1,
  color: colors.tile['64'],
  textColor: colors.background,
}
const tile128: TileData = {
  size: '128',
  power: 7,
  radius: 7,
  density: 1,
  color: colors.tile['128'],
  textColor: colors.background,
}
const tile256: TileData = {
  size: '256',
  power: 8,
  radius: 8,
  density: 1,
  color: colors.tile['256'],
  textColor: colors.background,
}
const tile512: TileData = {
  size: '512',
  power: 9,
  radius: 9,
  density: 1,
  color: colors.tile['512'],
  textColor: colors.background,
}
const tile1024: TileData = {
  size: '1024',
  power: 10,
  radius: 10,
  density: 1,
  color: colors.tile['1024'],
  textColor: colors.background,
}
const tile2048: TileData = {
  size: '2048',
  power: 11,
  radius: 11,
  density: 1,
  color: colors.tile['2048'],
  textColor: colors.background,
}

export const tiles: TileRecord<TileData> = {
  2: tile2,
  4: tile4,
  8: tile8,
  16: tile16,
  32: tile32,
  64: tile64,
  128: tile128,
  256: tile256,
  512: tile512,
  1024: tile1024,
  2048: tile2048,
}

export const getTileData = (size: TileSize | null): TileData | null => {
  if (size == null) return null
  return tiles[size]
}

export const getTileSize = (data: TileData): number => {
  return 30 + (15 * data.radius)
}
export const getTileStyle = (data: TileData) => {
  return {
    backgroundColor: data.color,
    width: getTileSize(data),
    height: getTileSize(data),
  }
}