interface Props {
  dataLength: number;
  reorderable?: boolean;
}

export function getLineNumberWidth({ dataLength, reorderable }: Props) {
  return Math.max(`${dataLength}`.length * 10 + 7 * 2, reorderable ? 40 : 30);
}
