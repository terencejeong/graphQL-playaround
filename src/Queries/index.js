import gql from 'graphql-tag';
import REPOSITORY_FRAGMENT  from '../Repository/fragments'

export const GET_CURRENT_USER = gql`
    {
        viewer {
            login
            name
        }
    }
`;

export const GET_REPOSITORIES_OF_CURRENT_USER = gql`
    query($cursor: String) {
        viewer {
            repositories(
                first: 5
                orderBy: { direction: DESC, field: STARGAZERS }
                after: $cursor
            ) {
                edges {
                    node {
                        ...repository
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
  ${REPOSITORY_FRAGMENT}
`;

export const WATCH_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
      updateSubscription (input: { state: $viewerSubscription, subscribableId: $id }) {
          subscribable {
              id
              viewerSubscription
          }
      }
  }
`;



export const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
      addStar(input: { starrableId: $id }) {
          starrable {
              id
              viewerHasStarred
          }
      }
  }
`;

export const REMOVE_STAR = gql`
  mutation($id: ID!) {
      removeStar(input: {starrableId: $id}) {
          starrable {
              id
              viewerHasStarred
          }
      }
  }
`;

