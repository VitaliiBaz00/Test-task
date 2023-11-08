import {useCallback, useMemo, useState} from 'react';
import {API_ACCESS_TOKEN} from '@env';

const baseUrl = 'https://api.eduki.com/api/v1/elastic';
const requestLimit = 20;

export const useData = () => {
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const controller = useMemo(() => new AbortController(), []);

  const getData = useCallback(
    async (page: number, searchString: string) => {
      try {
        if (loading && page === 1) {
          controller.abort();
        }
        setLoading(true);
        const response = await fetch(
          `${baseUrl}?limit=${requestLimit}&p=${page}&q=${searchString}&world=de`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
            signal: controller.signal,
          },
        );

        const readyData = await response.json();

        if (readyData.data.items.materials) {
          page === 1
            ? setData(readyData.data.items.materials)
            : setData(prev => [...prev, ...readyData.data.items.materials]);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
        } else {
          console.error(error, 'Failed to fetch data');
        }
      }
    },
    [controller, loading],
  );

  return {data, loading, getData};
};
