import React from "react";

export function getCellValueByRowKey<T>(rowKey: React.Key | React.Key[], values: T) {
  if (Array.isArray(rowKey)) {
    return rowKey.reduce((acc, cur) => {
      if (!acc) return acc;
      if (acc[cur]) return acc[cur];
      return acc;
    }, values as Record<string, any>);
  } else {
    return (values as Record<string, any>)[rowKey];
  }
}
