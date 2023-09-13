import { gql } from "@apollo/client";

export const CREATE_CUSTOM_IMAGES = gql`
  mutation CreateCustomImages($data: [CustomImageCreateInput!]!) {
    createCustomImages(data: $data) {
      id
      name
    }
  }
`;
