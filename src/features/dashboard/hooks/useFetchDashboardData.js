import { useState, useEffect } from 'react';

const useFetchDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.exemplo.com/consumo');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchDashboardData;
