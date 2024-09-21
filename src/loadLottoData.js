// src/loadLottoData.js

function loadLottoData() {
    const context = require.context('./lottoData', false, /numbers-\d{4}\.json$/);
    const data = [];
  
    context.keys().forEach((key) => {
      const yearData = context(key);
      data.push(...yearData);
    });
  
    return data;
  }
  
  export default loadLottoData;
  