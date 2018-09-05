import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { GET_ISSUES_OF_REPOSITORY } from '../../Queries';
import { ISSUE_STATES } from '../../constants/issue-states';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import './style.css';

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const Issues = ({ repositoryOwner, repositoryName }) => {
  return (
    <div className="Issues">
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{
          repositoryOwner,
          repositoryName
        }}
      >
        {({ data, loading, error}) => {
          if (error) {
            return <ErrorMessage error={error}/>
          }
           const { repository } = data;

          if (loading && !repository) {
            return <Loading />
          }

          if(!repository.issues.edges.length) {
            return <div className="IssueList">No Issues...</div>
          }

          return <IssueList issues={repository.issues} />
        }}
      </Query>
    </div>
  )
};

const IssueList = ({ issues }) => {
  return (
    <div className="IssueList">
      {issues.edges.map(({ node }) => (
        <IssueItem key={node.id} issue={node} />
      ))}
    </div>
  )

};

export default Issues;