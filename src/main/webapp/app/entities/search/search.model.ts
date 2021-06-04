export interface SearchAutoSuggestion {
  readonly text: string;
}

interface SearchAggregationStatement {
  readonly func: string;
  readonly feature: string;
}

interface SearchAggregationStatements {
  readonly statements: ReadonlyArray<SearchAggregationStatement>;
}

interface SearchByStatements {
  readonly features: ReadonlyArray<string>;
}

interface SearchWhereStatement {
  readonly feature: string;
  readonly condition: string;
  readonly statement: string;
}

interface SearchWhereStatements {
  readonly conditions: ReadonlyArray<SearchWhereStatement>;
}

interface SearchOrderByStatements {
  readonly feature: string;
  readonly direction: string;
}

export interface SearchResult {
  readonly aggregation: SearchAggregationStatements;
  readonly by: SearchByStatements;
  readonly where: SearchWhereStatements;
  readonly orderBy: SearchOrderByStatements;
}
