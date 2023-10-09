import {useInfiniteQuery} from '@tanstack/react-query';
import {REPOSITORIES_KEY} from './keys';
import {makeRequest} from './fetch';
import debounce from '../utils/debounce';

const fetchRepositories = async ({
  pageParam = 1,
  queryKey = '',
}: {
  pageParam?: number;
  queryKey?: string;
}) => {
  const perPage = 30; // Number of items per page
  const api = `https://api.github.com/search/repositories?q=${
    queryKey[1] ? queryKey[1] : 'react-native'
  }&page=${pageParam}&per_page=${perPage}`;
  const response = await makeRequest(api);
  // Extract the necessary data from the response
  const {items, total_count, incomplete_results}: any = response;

  return {
    items,
    total_count: total_count || 0,
    incomplete_results,
  };
};

const useRepositories = ({searchKey}: {searchKey: string}) => {
  return useInfiniteQuery(
    [REPOSITORIES_KEY + '000', searchKey],
    fetchRepositories,
    {
      getNextPageParam: (lastPage, allPages) => {
        const {total_count} = lastPage;
        if (allPages.length * 30 < total_count) {
          // Calculate next page number
          return allPages.length + 1;
        }
        return undefined; // No more pages to load
      },
    },
  );
};

export default useRepositories;
