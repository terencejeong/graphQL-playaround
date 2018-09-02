import React from 'react';
import { Mutation } from 'react-apollo';
import {
  REMOVE_STAR,
  STAR_REPOSITORY,
  WATCH_REPOSITORY,
} from '../../Queries';
import { VIEWER_SUBSCRIPTIONS } from '../../constants/viewer-subscriptions';
import Link from '../../Link';
import Button from '../../Button'
import '../style.css';
import REPOSITORY_FRAGMENT from '../fragments';


const updateAddStar = (client, mutationResult) => {
  // has access to the Apollo Client and the mutation result.
  const { data: { addStar: { starrable: { id } } } } = mutationResult;

  // define the repository --> goal is to read the repository from the cache and update back to the cache.
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });
  //write repository back to cache.
  const writeLocal = (totalCount) => client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
    // update count of stargazers
    const totalCount = repository.stargazers.totalCount + 1;
    writeLocal(totalCount)
};

const removeTheStar = ( client, mutationResult ) => {
  const { data: { removeStar: { starrable: { id } } } } = mutationResult;

  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  })
};
const updateWatch = (client, mutationResult) => {
  const { data: { updateSubscription: { subscribable: { id, viewerSubscription } } } } = mutationResult;

  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;

  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
  ? totalCount + 1
  : totalCount - 1

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  })
};


const isWatch = (viewerSubscription) => {
  return (
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
  );
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
  viewerHasSubscribed
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>
      <div>
        {!viewerHasStarred
          ?
          (
          <Mutation
            mutation={STAR_REPOSITORY}
            variables={{id}}
            update={updateAddStar}
          >
            {(addStar, { data, loading, error }) => (
              <Button
                className={'RepositoryItem-title-action'}
                onClick={addStar}
              >
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        )
          :
          (
          <Mutation
            mutation={REMOVE_STAR}
            variables={{id : id}}
            update={removeTheStar}
          >
            {(removeStar, prop) => (
              <Button
                className={'RepositoryItem-title-action'}
                onClick={removeStar}
              >
                Remove Star
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        )
        }
        <Mutation
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              },
            },
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => {
            return (
              <Button
                className="RepositoryItem-title-action"
                onClick={updateSubscription}
              >
                {watchers.totalCount}{' '}
                {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
              </Button>
            )
          }}
        </Mutation>
      </div>
    </div>
    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && (
            <span>Language: {primaryLanguage.name}</span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;