module.exports = {
  CalculateVarianceResult(listResultOfVariance) {
    const counts = {};
    for (const value of listResultOfVariance) counts[value] = counts[value] ? counts[value] + 1 : 1;
    const failureAmount = counts[false] || 0;
    const calulated = (failureAmount / listResultOfVariance.length) * 100;
    if (calulated) {
      return parseFloat(calulated.toFixed(2));
    }
    return 0;
  },
  ConvertDifferenceValue(differenceValue) {
    if (differenceValue) {
      return parseFloat(differenceValue.toFixed(2));
    }
    return 0;
  },
};
