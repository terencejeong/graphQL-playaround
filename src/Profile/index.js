import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ErrorMessage from '../Error'
import Loading from '../Loading'
import RepositoryList from '../Repository'
import {
  GET_CURRENT_USER,
  GET_REPOSITORIES_OF_CURRENT_USER,
} from '../Queries'

const Profile = () => (
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    notifyOnNetworkStatusChange={true}
  >
    {(props) => {
      const { data: { viewer }, loading, error, fetchMore } = props;

      if (error) {
        return <ErrorMessage error={error} />
      }

      if(loading && !viewer) {
        return <Loading />;
      }

      return (
          <div>
           {viewer.name} {viewer.login}
           <RepositoryList
             repositories={viewer.repositories}
             loading={loading}
             fetchMore={fetchMore}
             entry={'viewer'}
           />
          </div>
      )
    }}
  </Query>
);

export default Profile