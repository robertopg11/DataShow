// Estado Global
let buyPoints = [
    { date: '2022-06-13', price: 270.60, total: 270.60, comision: 3, numero: 1 },
    { date: '2022-09-28', price: 286.15, total: 286.15, comision: 3, numero: 1 },
    { date: '2022-11-04', price: 268.35, total: 268.35, comision: 3, numero: 1 },
    { date: '2022-12-28', price: 248.80, total: 248.80, comision: 3, numero: 1 },
    { date: '2023-07-06', price: 339.65, total: 339.65, comision: 3, numero: 1 },
    { date: '2024-02-20', price: 398.00, total: 398.00, comision: 3, numero: 1 },
    { date: '2024-07-18', price: 445.80, total: 445.80, comision: 3, numero: 1 },
    { date: '2024-07-25', price: 429.55, total: 429.55, comision: 3, numero: 1 },
    { date: '2024-08-05', price: 387.90, total: 387.90, comision: 3, numero: 1 },
    { date: '2025-01-28', price: 498.65, total: 498.65, comision: 3, numero: 1 },
    { date: '2025-02-25', price: 497.00, total: 497.00, comision: 3, numero: 1 },
    { date: '2025-02-26', price: 495.50, total: 495.50, comision: 3, numero: 1 },
    { date: '2025-02-28', price: 485.25, total: 485.25, comision: 3, numero: 1 },
    { date: '2025-03-04', price: 470.85, total: 470.85, comision: 3, numero: 1 },
    { date: '2025-03-07', price: 454.30, total: 454.30, comision: 3, numero: 1 },
    { date: '2025-03-31', price: 430.50, total: 430.50, comision: 3, numero: 1 },
    { date: '2025-04-03', price: 411.20, total: 411.20, comision: 3, numero: 1 },
    { date: '2025-04-04', price: 399.70, total: 399.70, comision: 3, numero: 1 },
    { date: '2026-01-20', price: 521.90, total: 521.90, comision: 3, numero: 1 },
    { date: '2026-02-13', price: 509.00, total: 509.00, comision: 3, numero: 1 },
    { date: '2026-03-27', price: 497.35, total: 497.35, comision: 3, numero: 1 }
];

let historicalData = [];
let currentPrice = 0;
let productName = "INVESCO EQQQ NASDAQ-100 UCITS ETF";
let earnedDividends = 0;

function updateStats() {
    const totalInvestment = buyPoints.reduce((sum, p) => sum + p.total + (p.comision || 0) + (p.autoFx || 0), 0);
    const shares = buyPoints.reduce((sum, p) => sum + (p.numero || 1), 0);
    const totalComisions = buyPoints.reduce((sum, p) => sum + (p.comision || 0), 0);
    const totalAutoFx = buyPoints.reduce((sum, p) => sum + (p.autoFx || 0), 0);
    
    const avgPrice = shares > 0 ? totalInvestment / shares : 0;
    const currentValue = shares * currentPrice;
    
    // Ganancia bruta = (Valor Actual - Total Invertido) + Dividendos
    const grossGainWithoutDividends = currentValue - totalInvestment; 
    const grossGain = grossGainWithoutDividends + earnedDividends;
    
    const grossGainPercent = totalInvestment > 0 ? (grossGain / totalInvestment * 100).toFixed(2) : 0;

    const estimatedTaxes = calculateTaxes(grossGain);
    const netGain = grossGain - estimatedTaxes;

    // Calcular TIR (XIRR)
    const cashFlows = [];
    buyPoints.forEach(p => {
        cashFlows.push({ date: new Date(p.date), amount: -(p.total + (p.comision || 0) + (p.autoFx || 0)) });
    });
    cashFlows.push({ date: new Date(), amount: currentValue + earnedDividends });
    const xirr = calculateXIRR(cashFlows);
    const xirrPercent = (xirr * 100).toFixed(2);

    document.getElementById('totalInvestment').textContent = totalInvestment.toFixed(2) + ' €';
    document.getElementById('currentValue').textContent = currentValue.toFixed(2) + ' €';
    
    const gainLossEl = document.getElementById('gainLoss');
    gainLossEl.textContent = `${grossGain.toFixed(2)} € (${grossGainPercent}%)`;
    gainLossEl.className = 'value ' + (grossGain >= 0 ? 'positive' : 'negative');

    const xirrEl = document.getElementById('xirrValue');
    xirrEl.textContent = `${xirrPercent}%`;
    xirrEl.className = 'value ' + (xirr >= 0 ? 'positive' : 'negative');
    
    document.getElementById('totalCommissions').textContent = totalComisions.toFixed(2) + ' €';
    document.getElementById('autoFxCommissions').textContent = totalAutoFx.toFixed(2) + ' €';
    document.getElementById('estimatedTaxes').textContent = estimatedTaxes.toFixed(2) + ' €';
    
    const divEl = document.getElementById('dividendsEarned');
    divEl.textContent = earnedDividends.toFixed(2) + ' €';
    
    const netGainEl = document.getElementById('netGain');
    netGainEl.textContent = `${netGain.toFixed(2)} €`;
    netGainEl.className = 'value ' + (netGain >= 0 ? 'positive' : 'negative');

    document.getElementById('shares').textContent = shares.toFixed(4).replace(/\.?0+$/, ''); 
    document.getElementById('avgPrice').textContent = avgPrice.toFixed(2) + ' €';
    document.getElementById('currentPrice').textContent = currentPrice.toFixed(2) + ' €';
    document.getElementById('currentPrice').className = 'value ' + (currentPrice > avgPrice ? 'positive' : 'negative');
}

function renderChart(tickerName) {
    const dates = historicalData.map(d => d.date);
    const prices = historicalData.map(d => d.price);

    const totalInv = buyPoints.reduce((sum, p) => sum + p.total + (p.comision || 0), 0);
    const shares = buyPoints.reduce((sum, p) => sum + (p.numero || 1), 0);
    const avgPrice = shares > 0 ? totalInv / shares : 0;
    const avgLine = dates.map(() => avgPrice);

    const trace1 = {
        x: dates,
        y: prices,
        type: 'scatter',
        mode: 'lines',
        name: 'Precio ' + tickerName,
        line: { color: '#00d4ff', width: 2 },
        hovertemplate: '<b>Fecha:</b> %{x}<br><b>Precio:</b> €%{y:.2f}<extra></extra>'
    };

    const trace2 = {
        x: buyPoints.map(p => p.date),
        y: buyPoints.map(p => p.price),
        type: 'scatter',
        mode: 'markers',
        name: 'Mis Compras',
        text: buyPoints.map(p => `Cant: ${p.numero}<br>Comis: €${(p.comision||0).toFixed(2)}`),
        marker: { color: '#00ff88', size: 10, line: { color: '#fff', width: 1 } },
        hovertemplate: '<b>Fecha:</b> %{x}<br><b>Precio:</b> €%{y:.2f}<br>%{text}<extra></extra>'
    };

    const trace3 = {
        x: dates,
        y: avgLine,
        type: 'scatter',
        mode: 'lines',
        name: 'Precio Medio',
        line: { color: '#ff6b6b', width: 1.5, dash: 'dash' }
    };

    const layout = {
        paper_bgcolor: '#16213e',
        plot_bgcolor: '#16213e',
        font: { color: '#eee' },
        margin: { t: 20, r: 20, b: 40, l: 60 },
        xaxis: { gridcolor: '#2a2a4a', rangeslider: { visible: false } },
        yaxis: { gridcolor: '#2a2a4a', tickprefix: '€' },
        hovermode: 'x unified'
    };

    Plotly.newPlot('chart', [trace1, trace2, trace3], layout);
}

async function applyChanges() {
    const csvFile = document.getElementById('csvFile').files[0];
    const isin = document.getElementById('isinInput').value.trim();
    const ticker = document.getElementById('tickerInput').value.trim();
    
    const errorEl = document.getElementById('error');
    const loadingEl = document.getElementById('loading');
    
    errorEl.style.display = 'none';
    loadingEl.style.display = 'block';
    Plotly.purge('chart');
    
    try {
        localStorage.setItem('portfolio_isin', isin);
        localStorage.setItem('portfolio_ticker', ticker);

        if (csvFile && isin) {
            const text = await csvFile.text();
            const extracted = processCSV(text, isin);
            if(extracted.points.length === 0) {
                throw new Error(`No se encontraron compras para el ISIN ${isin} en el CSV.`);
            }
            buyPoints = extracted.points;
            if(extracted.name) productName = extracted.name;
            earnedDividends = extracted.dividends;
            
            localStorage.setItem('portfolio_buyPoints', JSON.stringify(buyPoints));
            localStorage.setItem('portfolio_productName', productName);
            localStorage.setItem('portfolio_earnedDividends', earnedDividends);
            localStorage.setItem('portfolio_hasCustomData', 'true');
        } else {
            if (localStorage.getItem('portfolio_hasCustomData') === 'true') {
                const savedPoints = localStorage.getItem('portfolio_buyPoints');
                if (savedPoints) {
                    buyPoints = JSON.parse(savedPoints);
                    productName = localStorage.getItem('portfolio_productName') || productName;
                    earnedDividends = parseFloat(localStorage.getItem('portfolio_earnedDividends')) || 0;
                }
            } else {
                earnedDividends = 0; // Para el EQQQ por defecto sin CSV
            }
        }
        
        const rawHist = await fetchYahooData(ticker);
        if(rawHist.length === 0) throw new Error('No se recibieron datos históricos válidos.');
        
        historicalData = rawHist.slice(-1500);
        currentPrice = historicalData[historicalData.length - 1].price;
        
        document.getElementById('pageTitle').textContent = `📈 ${productName} (${ticker})`;
        
        updateStats();
        renderChart(ticker);
        loadingEl.style.display = 'none';
        document.getElementById('legend').style.display = 'flex';
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = err.message;
        console.error(err);
    }
}

// Cargar por defecto al iniciar o desde LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedIsin = localStorage.getItem('portfolio_isin');
    const savedTicker = localStorage.getItem('portfolio_ticker');
    if (savedIsin) document.getElementById('isinInput').value = savedIsin;
    if (savedTicker) document.getElementById('tickerInput').value = savedTicker;
    
    setTimeout(() => applyChanges(), 100);
});
