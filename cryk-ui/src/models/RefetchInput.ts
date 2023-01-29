import { DocumentNode } from "graphql";

export interface RefetchInput<T> {
  query: DocumentNode;
  variables: T;
}
