// src/hook/useSearch.ts
import { useState } from "react";

let externalSetSearch: ((value: string) => void) | null = null;

export function useSearch(): [string, (value: string) => void] {
  const [searchTerm, setSearchTerm] = useState("");
  externalSetSearch = setSearchTerm;
  return [searchTerm, setSearchTerm];
}

export function setSearchGlobal(value: string) {
  if (externalSetSearch) {
    externalSetSearch(value);
  }
}