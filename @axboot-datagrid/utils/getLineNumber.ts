interface Props {
  dataLength: number;
  reorderable?: boolean;
}

export function getLineNumberWidth({ dataLength, reorderable }: Props) {
  return Math.max(`${dataLength}`.length * 9 + 7 * 2 + (reorderable ? 5 : 0), 30);
}
