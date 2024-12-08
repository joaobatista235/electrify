export const fetchConsumptionData = async () => {
    try {
      const response = await fetch('https://api.exemplo.com/consumo');
      if (!response.ok) throw new Error('Erro ao buscar dados');
      return await response.json();
    } catch (err) {
      throw err;
    }
  };
  