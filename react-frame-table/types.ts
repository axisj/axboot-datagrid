type Direction = "left" | "center" | "right";
type Size = "small" | "medium" | "large";

export interface RFTableColumn {
  key: string | string[];
  label: string;
  width?: number;
  align?: Direction;
}

export interface RFTableColumnGroup {
  label: string;
  colspan: number;
}

export type RFTableDataItem = {
  values: Record<string, any>;
  status?: string;
  selected?: boolean;
}

export interface RFTableProps {
  data: RFTableDataItem[];
  columns: RFTableColumn[];
  columnsGroup: RFTableColumnGroup[];
}
