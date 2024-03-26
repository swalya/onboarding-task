import { gql } from "graphql-tag";

const typeDefs = gql`
  type Column {
    id: ID!
    name: String!
    tasks: [Task]
  }

  type Task {
    id: ID!
    name: String!
    columnId: String!
  }

  type Query {
    columns: [Column]!
    tasks: [Task]!
  }

  type Mutation {
    createColumn(columnName: String!): Column!
    renameColumn(newName: String!, columnId: String!): Column!
    clearColumn(columnId: String!): String!
    deleteColumn(columnId: String!): String!
    createTask(taskName: String!, columnId: String!): Task!
    moveTask(newColumnId: String!, taskId: String!): Task!
    deleteTask(taskId: String!): String!
  }
`;

export default typeDefs;