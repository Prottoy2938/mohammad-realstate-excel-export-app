import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';

export const Hit = ({ hit }) => {
  return (
    <article>
      <div className="hit-dealName">
			  <Highlight attribute="dealName" hit={hit} />
			</div>
			<div className="hit-DealDetails.clientName">
			  <Highlight attribute="DealDetails.clientName" hit={hit} />
			</div>
    </article>
  );
};