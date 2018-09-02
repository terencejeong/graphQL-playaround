import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading'
import RepositoryList from '../Repository'
import {
  GET_CURRENT_USER,
  GET_REPOSITORIES_OF_CURRENT_USER,
} from '../Queries'

const  Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {(props) => {
      const { data: { viewer, loading }, fetchMore } = props;

      if(loading || !viewer) {
        return <Loading />
      }

      return (
          <div>
           {viewer.name} {viewer.login}
           <RepositoryList
             repositories={viewer.repositories}
             fetchMore={fetchMore}
           />
          </div>
      )
    }}
  </Query>
);

export default Profile