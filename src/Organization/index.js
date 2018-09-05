import React from 'react';
import { Query } from 'react-apollo';
import ErrorMessage from '../Error';
import Loading from '../Loading';
import RepositoryList from '../Repository';
import { GET_REPOSITORIES_OF_ORGANIZATION } from '../Queries';


// the skip prop skips executing the query in case no organization is provided.
// have to write the error component.
const Organization = (props) =>  {
  const { organizationName } = props;
  return (
    <Query
      query={GET_REPOSITORIES_OF_ORGANIZATION}
      variables={{
        organizationName: organizationName
      }}
      skip={organizationName === ''}
      notifyOnNetworkStatusChange={true}
    >
      {({ data, loading, error, fetchMore}) => {

        if (error) {
          return <ErrorMessage error={error} />
        }

        const { organization } = data;

        if(loading && !organization) {
          return <Loading />
        }
        return (
          <RepositoryList
            loading={loading}
            repositories={organization.repositories}
            fetchMore={fetchMore}
            entry={'organization'}
          />
        )
      }}
    </Query>
  )
};

export default Organization;