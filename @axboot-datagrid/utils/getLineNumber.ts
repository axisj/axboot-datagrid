interface Props {
  dataLength: number;
}

export function getLineNumberWidth({ dataLength }: Props) {
  return Math.max(`${dataLength}`.length * 8 + 7 * 2, 30);
}
