import React from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import 'components/Shared/OpenDataPage/graphiql.css';
import 'components/Shared/OpenDataPage/OpenDataPage.css';
import { Link } from 'react-router-dom';

function graphQLFetcher(graphQLParams) {
  return fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

export default function OpenDataPage() {
  return (
    <div className='OpenDataPage'>
      <h2>Open Data</h2>
      <Link to={process.env.REACT_APP_XML_ENDPOINT}>Legacy XML</Link>
      <GraphiQL fetcher={graphQLFetcher} />
    </div>
  );
}



