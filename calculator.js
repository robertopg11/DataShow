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
