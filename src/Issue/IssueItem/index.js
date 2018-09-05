import React from 'react';
import Link from '../../Link';

import './style.css';

const IssueItem = ({ issue }) => {
  return (
    <div className="IssueItem">
      {/*placeholder to add a show/hide comment button later*/}
      <div className="IssueItem-content">
        <h3>
          <Link href={issue.url}>{issue.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{__html: issue.bodyHTML}}>
          {/*placeholder to render list of comments*/}
        </div>
      </div>
    </div>
  )
};

export default IssueItem;