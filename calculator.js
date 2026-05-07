function calculateTaxes(netProfit) {
    if (netProfit <= 0) return 0;
    
    let remaining = netProfit;
    let taxes = 0;
    
    // Tramos IRPF ahorro España 2023+
    if (remaining > 0) {
        let taxable = Math.min(remaining, 6000);
        taxes += taxable * 0.19;
        remaining -= taxable;
    }
    
    if (remaining > 0) {
        let taxable = Math.min(remaining, 44000); // 50000 - 6000
        taxes += taxable * 0.21;
        remaining -= taxable;
    }
    
    if (remaining > 0) {
        let taxable = Math.min(remaining, 150000); // 200000 - 50000
        taxes += taxable * 0.23;
        remaining -= taxable;
    }
    
    if (remaining > 0) {
        let taxable = Math.min(remaining, 100000); // 300000 - 200000
        taxes += taxable * 0.27;
        remaining -= taxable;
    }
    
    if (remaining > 0) {
        taxes += remaining * 0.28;
    }
    
    return taxes;
}

function calculateXIRR(cashFlows) {
    if (!cashFlows || cashFlows.length < 2) return 0;
    
    cashFlows.sort((a, b) => a.date - b.date);
    
    const xnpv = (rate, flows) => {
        let npv = 0;
        const d0 = flows[0].date;
        for (let i = 0; i < flows.length; i++) {
            const t = (flows[i].date - d0) / (1000 * 60 * 60 * 24 * 365);
            npv += flows[i].amount / Math.pow(1 + rate, t);
        }
        return npv;
    };

    const xnpvDerivative = (rate, flows) => {
        let npvPrime = 0;
        const d0 = flows[0].date;
        for (let i = 0; i < flows.length; i++) {
            const t = (flows[i].date - d0) / (1000 * 60 * 60 * 24 * 365);
            npvPrime -= (t * flows[i].amount) / Math.pow(1 + rate, t + 1);
        }
        return npvPrime;
    };

    let rate = 0.1;
    let maxIter = 100;
    let tol = 1e-6;

    for (let i = 0; i < maxIter; i++) {
        let fValue = xnpv(rate, cashFlows);
        let fPrime = xnpvDerivative(rate, cashFlows);
        
        if (Math.abs(fPrime) < 1e-10) break;
        
        let newRate = rate - fValue / fPrime;
        
        if (Math.abs(newRate - rate) < tol) {
            return newRate;
        }
        rate = newRate;
    }
    
    return rate;
}
