import urllib.request
import json
import csv
from datetime import datetime

url = 'https://query1.finance.yahoo.com/v8/finance/chart/EQQQ.MI?range=5y&interval=1d'

print("Descargando datos de Yahoo Finance...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    
    result = data['chart']['result'][0]
    timestamps = result['timestamp']
    closes = result['indicators']['quote'][0]['close']
    
    historicalData = []
    for t, c in zip(timestamps, closes):
        if c is not None:
            dt = datetime.fromtimestamp(t).strftime('%Y-%m-%d')
            historicalData.append({'date': dt, 'price': round(c, 2)})
    
    js_content = "const historicalDataStr = " + json.dumps(historicalData) + ";"
    
    with open('qqq_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("Datos actualizados correctamente en qqq_data.js. Ya puedes abrir qqq_chart.html")
    
except Exception as e:
    print("Error al descargar los datos:", e)
