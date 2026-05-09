async function fetchYahooData(ticker) {
    if(ticker === 'EQQQ.MI' && typeof historicalDataStr !== 'undefined') {
        return historicalDataStr;
    }
    
    const url = `https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=5y&interval=1d`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Error al descargar Yahoo Finance. Asegúrate de iniciar el servidor local (ej: python -m http.server)');
    const data = await res.json();
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    
    const hist = [];
    for(let i=0; i<timestamps.length; i++) {
        if(closes[i] !== null) {
            const d = new Date(timestamps[i] * 1000);
            const dt = d.toISOString().split('T')[0];
            hist.push({ date: dt, price: closes[i] });
        }
    }
    return hist;
}
