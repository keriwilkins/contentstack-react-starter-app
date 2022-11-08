import { useEffect, useState } from 'react';
import { useParams, useNavigate, useMatch } from 'react-router-dom';
import { getPageRes } from '../helper/index.d';
import { onEntryChange } from '../sdk/entry.d';
import { PageEntry } from '../typescript/pages';

export default function useFetchEntry() {
  const [getEntries, setEntries] = useState({} as PageEntry);
  const [error, setError] = useState(false);
  const history = useNavigate();
  const params = useParams();
  const match = useMatch('/blog');
  const entryUrl = params.page ? `/${params.page}` : '/';

  useEffect(() => {
    onEntryChange(() => fetchEntry().then((data) => setEntries(data)));
  }, [params.page]);

  useEffect(() => {
    if (getEntries.url !== entryUrl) fetchEntry();
    error && history('/404');
  }, [entryUrl, error]);

  const fetchEntry = async () => {
    try {
      if (match?.pathname === '/blog') {
        const result = await getPageRes('/blog');
        !result && setError(true);
        setEntries(result);
        return result;
      } else {
        const result = await getPageRes(entryUrl);
        !result && setError(true);
        setEntries(result);
        return result;
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };
  return fetchEntry;
}
