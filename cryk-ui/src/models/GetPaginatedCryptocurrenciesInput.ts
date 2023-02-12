export interface GetPaginatedCryptocurrenciesInput {
  limit?: number;
  offset?: number;
  searchText? : string[];
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}
