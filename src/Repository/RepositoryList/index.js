import React, { Fragment } from 'react';
import Issues from '../../Issue';
import RepositoryItem from '../RepositoryItem';
import Loading from '../../Loading';
import FetchMore from '../../FetchMore';
import '../style.css';

const updateQuery = (entry) => (previousResult, { fetchMoreResult }) => {
  if(!fetchMoreResult) {
    return previousResult
  }
  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ],
      },
    },
  };
}

// fetchMore comes from the query.
const RepositoryList = ({ repositories, fetchMore, loading, entry}) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
        <Issues
          repositoryName={node.name}
          repositoryOwner={node.owner.login}
        />
      </div>
    ))}
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={updateQuery(entry)}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;

// const RepositoryList = (value) => {
//   const { repositories } = value;
//   return repositories.edges.map(({ node }) => (
//     <div key={node.id} className="RepositoryItem">
//       <RepositoryItem {...node} />
//     </div>
//   ))
// };