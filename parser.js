function parseCSVRow(str) {
    return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g, '').trim());
}

function processCSV(csvText, isin) {
    const lines = csvText.split('\n');
    const newBuyPoints = [];
    let foundName = null;
    let totalDividends = 0;

    for(let i=1; i<lines.length; i++) {
        if(!lines[i].trim()) continue;
        const cols = parseCSVRow(lines[i]);
        if(cols.length < 16) continue;
        
        const rowIsin = cols[3];
        const rowDesc = cols[2] ? cols[2].toLowerCase() : '';
        const isDividend = rowDesc.includes('dividend'); // Degiro usa "Dividendo" o "Dividend"
        
        if(rowIsin === isin) {
            if(!foundName && !isDividend) foundName = cols[2];
            
            const dateParts = cols[0].split('-');
            if(dateParts.length !== 3) continue;
            const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            
            const total = parseFloat(cols[15].replace(',', '.')); // Total EUR
            
            if (isDividend && total > 0) {
                totalDividends += total;
                continue;
            }

            const priceStr = cols[7] ? cols[7].replace(',', '.') : '0';
            const numStr = cols[6] ? cols[6].replace(',', '.') : '0';
            
            const price = parseFloat(priceStr);
            const numero = parseFloat(numStr);
            
            let comision = 0;
            if(cols[14]) {
                comision = Math.abs(parseFloat(cols[14].replace(',', '.')));
            }
            
            if(numero > 0 && total < 0) {
                newBuyPoints.push({
                    date: date,
                    price: price,
                    total: Math.abs(total) - comision,
                    comision: comision,
                    numero: numero
                });
            }
        }
    }
    newBuyPoints.sort((a,b) => new Date(a.date) - new Date(b.date));
    return { points: newBuyPoints, name: foundName, dividends: totalDividends };
}
