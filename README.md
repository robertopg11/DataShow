# DataShow

Visualizador de cartera de inversiones.

## Estructura

```
/                   → Redirección automática
/desktop/           → Versión escritorio
/mobile/            → Versión móvil (PWA)
/mobile/index.html → Versión móvil directa
```

## Cómo funciona

- El `index.html` raíz detecta si el dispositivo es móvil
- Si es Android/iOS → redirige a `/mobile/`
- Si es desktop → redirige a `/desktop/`

## Uso

1. Abre la web (raíz)
2. Sube tu CSV de Degiro
3. Introduce ISIN y ticker Yahoo
4. Toca "Cargar Datos"

## Instalación móvil

1. Abre desde **Chrome** en Android
2. Toca "📲 Instalar App" o Menú → "Añadir a pantalla de inicio"
3. Se installará como app native