const equipmentData = {
    AC: { power: 1.2 },
    Lamp: { power: 0.05 },
    Computer: { power: 0.3 },
  };
  
  export const calculateConsumption = (equipmentType, quantity, usageHours) => {
    const equipment = equipmentData[equipmentType];
  
    if (!equipment) {
      return null;
    }
  
    const dailyConsumption = equipment.power * quantity * usageHours;
    const dailyCost = dailyConsumption * 0.8;
    const monthlyCost = dailyCost * 30;
  
    return {
      dailyConsumption,
      dailyCost,
      monthlyCost,
    };
  };
  