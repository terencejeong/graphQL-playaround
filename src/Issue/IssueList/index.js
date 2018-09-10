import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withState } from 'recompose';
import { GET_ISSUES_OF_REPOSITORY } from '../../Queries';
import { ISSUE_STATES } from '../../constants/issue-states';
import {
  TRANSITION_LABELS,
  TRANSITION_STATE
} from '../../constants/transition-state';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';
import './style.css';

const isShow = (issueState) => {
  return issueState !== ISSUE_STATES.NONE;
}

const IssueList = ({ issues }) => {
  return (
    <div className="IssueList">
      {issues.edges.map(({ node }) => (
        <IssueItem key={node.id} issue={node} />
      ))}
    </div>
  )
};

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState
}) => {
    return (
      <div className="Issues">
        <ButtonUnobtrusive
          onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobtrusive>

        {isShow(issueState) && (
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

              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    issue => issue.node.state === issueState,
                  ),
                },
              };

              if(!filteredRepository.issues.edges.length) {
                return <div className="IssueList">No Issues...</div>
              }

              return <IssueList issues={repository.issues} />
            }}
          </Query>
        )
        }
      </div>
    )
};

export default withState(
  'issueState',
  'onChangeIssueState',
  ISSUE_STATES.NONE
)(Issues);


// const Issues = ({ repositoryOwner, repositoryName }) => {
//   return (
//     <div className="Issues">
//       <Query
//         query={GET_ISSUES_OF_REPOSITORY}
//         variables={{
//           repositoryOwner,
//           repositoryName
//         }}
//       >
//         {({ data, loading, error}) => {
//           if (error) {
//             return <ErrorMessage error={error}/>
//           }
//            const { repository } = data;
//
//           if (loading && !repository) {
//             return <Loading />
//           }
//
//           if(!repository.issues.edges.length) {
//             return <div className="IssueList">No Issues...</div>
//           }
//
//           return <IssueList issues={repository.issues} />
//         }}
//       </Query>
//     </div>
//   )
// };