import { gql } from "@apollo/client";

export const GET_CUSTOMS = gql`
  query GetCustoms {
    customs {
      id
      name
    }
  }
`;

export const GET_CUSTOM_DETAIL = gql`
  query Query($where: CustomWhereUniqueInput!) {
    custom(where: $where) {
      images {
        id
        image {
          publicUrl
        }
        name
        width
        height
        timestamp
      }
    }
  }
`;
