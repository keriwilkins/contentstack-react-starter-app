import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RenderComponents from '../components/render-components';
import Skeleton from 'react-loading-skeleton';
import { PageEntry } from '../typescript/pages';
import useFetchEntry from '../hooks/useFetchEntry';
import { onEntryChange } from '../sdk/entry.d';

export default function Home() {
  const fetchData = useFetchEntry();
  const params = useParams();
  const [getEntries, setEntries] = useState({} as PageEntry);

  useEffect(() => {
    onEntryChange(() => {
      fetchData().then((data) => setEntries(data));
    });
  }, [params.page]);

  return Object.keys(getEntries).length ? (
    <RenderComponents
      pageComponents={getEntries?.page_components}
      contentTypeUid='page'
      entryUid={getEntries?.uid}
      locale={getEntries?.locale}
    />
  ) : (
    <Skeleton count={5} height={400} />
  );
}
