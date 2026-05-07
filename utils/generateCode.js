import { nanoid } from 'nanoid';

export function generateOrderCode() {
  const prefix = 'PARA';
  const part1 = nanoid(4).toUpperCase();
  const part2 = nanoid(4).toUpperCase();
  return `${prefix}-${part1}-${part2}`;
}