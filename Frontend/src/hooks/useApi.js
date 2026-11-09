import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk fetch data dengan loading & error handling
 * @param {Function} apiCall - API call function (e.g., () => quizAPI.getAll())
 * @param {Array} dependencies - Dependency array untuk re-fetch
 */
export function useApi(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    let isMounted = true;
    try {
      setLoading(true);
      const result = await apiCall();
      if (isMounted) {
        setData(result?.data !== undefined ? result.data : result);
        setError(null);
      }
    } catch (err) {
      if (isMounted) {
        setError(err);
        setData(null);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook untuk POST/PUT/DELETE request dengan loading & error handling
 */
export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

export const useApiPost = useApiMutation;

