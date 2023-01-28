import { DocumentNode } from "graphql";

export interface RefetchInput<T> {
  context: string;
  query: DocumentNode;
  variables: T;
}
