# Demo Lab — Aprendizajes

Documentación técnica de todo lo que construimos y por qué funciona.

---

## Técnica principal: Canvas Frame Scrubbing

### El problema con video + scroll

El enfoque ingenuo es usar un `<video>` y modificar `video.currentTime` al scrollear. **No funciona bien** porque:

- Los MP4 tienen keyframes cada N frames (generalmente cada 2-5 segundos)
- Cuando hacés seek a un frame que no es keyframe, el browser tiene que decodificar hacia atrás desde el keyframe anterior
- Esto genera el efecto "traba" o "salto" entre frames

Intentamos también `video.fastSeek()` (más liviano que `currentTime`) con `canplaythrough` para esperar el buffer completo — mejora, pero no elimina el problema en videos pesados.

### La solución: secuencia de imágenes en Canvas

Es la misma técnica que usa **Apple** en su web para el efecto del iPhone.

**Pasos:**
1. Extraer frames del video con `ffmpeg` a ~15fps como JPEG
2. Precargar todos los frames en memoria como objetos `Image`
3. En cada evento de scroll, calcular el índice del frame y hacer `ctx.drawImage()` en un `<canvas>`

```bash
# Extracción de frames con ffmpeg
ffmpeg -i video.mp4 -vf fps=15,scale=960:-2 -q:v 8 public/frames/frame_%04d.jpg
```

```jsx
// Render del frame correcto
useMotionValueEvent(scrollYProgress, 'change', (p) => {
  const index = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1)
  ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height)
})
```

**Por qué funciona:** `drawImage()` es instantáneo porque las imágenes ya están decodificadas en memoria RAM. No hay seek, no hay decodificación en tiempo real.

**Trade-off:** Hay que precargar todos los frames al inicio → pantalla de carga con porcentaje.

---

## Remoción de fondo blanco en PNGs

Cuando el PNG tiene fondo blanco real (no transparencia), hay dos opciones:

### Opción A — CSS `mix-blend-mode: multiply`
Hace que el blanco desaparezca visualmente sobre fondos oscuros. Rápido pero afecta los colores.

### Opción B — Python + Pillow (recomendada)
Elimina el fondo con alpha suave para no cortar bordes:

```python
from PIL import Image
import numpy as np

def remove_white_bg(path_in, path_out, threshold=240):
    img = Image.open(path_in).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    is_white = (r > threshold) & (g > threshold) & (b > threshold)
    whiteness = np.minimum(r, np.minimum(g, b))
    alpha_factor = 1.0 - np.clip((whiteness - (threshold - 30)) / 30.0, 0, 1)
    data[:,:,3] = np.where(is_white, alpha_factor * 255, a)
    Image.fromarray(data.astype(np.uint8), "RGBA").save(path_out, "PNG")
```

El `alpha_factor` genera un fade gradual en los bordes → la imagen no queda recortada de forma brusca.

---

## Scroll-driven animations con Framer Motion

### Hooks clave

```jsx
const { scrollYProgress } = useScroll({ target: containerRef })
// scrollYProgress va de 0 a 1 mientras el usuario scrollea dentro del target

const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
// Mapea el progreso a cualquier valor

useMotionValueEvent(scrollYProgress, 'change', (p) => {
  // Se ejecuta en cada frame de scroll, sin re-render de React
})
```

### Patrón sticky scroll

```jsx
<div ref={containerRef} style={{ height: '600vh' }}>
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
    {/* Contenido que queda fijo */}
  </div>
</div>
```

El container alto (`600vh`) da el espacio de scroll. El hijo sticky permanece visible mientras el usuario scrollea esa distancia.

### Rotación sincronizada con scroll

```jsx
const rotate = useTransform(scrollYProgress, [appearsAt, leavesAt], [-15, 15])
// La imagen rota de -15° a +15° mientras el elemento está visible
```

### Efecto flotante en loop (independiente del scroll)

```jsx
<motion.img
  animate={{ y: [0, -10, 0] }}
  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
/>
```

---

## Extracción de frames — referencia rápida

```bash
# Ver info del video
ffprobe -v error -select_streams v:0 \
  -show_entries stream=nb_frames,r_frame_rate,duration \
  -of default=noprint_wrappers=1 video.mp4

# Extraer frames (calidad balanceada)
ffmpeg -i video.mp4 -vf fps=15,scale=960:-2 -q:v 8 public/frames/frame_%04d.jpg

# Extraer frames (calidad alta, más pesado)
ffmpeg -i video.mp4 -vf fps=24,scale=1280:-2 -q:v 3 public/frames/frame_%04d.jpg

# Regla general:
# fps=15 → suficiente para scrubbing suave
# scale=960:-2 → buena calidad sin pesar demasiado
# q:v 8 → ~35KB por frame (balance ideal)
```

---

## Estructura del proyecto

```
scroll-video-landing/
├── public/
│   ├── frames/              # Frames del video café (259 JPEGs, 9MB)
│   ├── frames-iphone/       # Frames del video iPhone (243 JPEGs, 5.5MB)
│   ├── coffee.mp4           # Video original café
│   ├── *_t.png              # Imágenes de productos sin fondo blanco
│   └── remove_bg.py         # Script Python para remover fondos
├── src/
│   ├── demos/
│   │   ├── index.js         # Registro de todas las demos
│   │   ├── 01-scroll-coffee/
│   │   │   └── ScrollVideoLanding.jsx
│   │   └── 02-iphone-apple/
│   │       └── IphoneLanding.jsx
│   ├── App.jsx              # Router principal
│   ├── Home.jsx             # Demo Lab — grid de demos
│   └── index.css
└── LEARNINGS.md             # Este archivo
```

### Cómo agregar una nueva demo

1. Crear `src/demos/0N-nombre/MiDemo.jsx`
2. Agregar la entrada en `src/demos/index.js`
3. Agregar la ruta en `src/App.jsx`
4. Si usa frames: extraer con ffmpeg y poner en `public/frames-nombre/`

---

## Demos construidas

| # | Demo | Técnica principal | Video |
|---|------|-------------------|-------|
| 01 | Scroll Coffee Landing | Canvas scrubbing + cards con rotación | café 17s, 259 frames |
| 02 | iPhone 16 Pro Apple Style | Canvas scrubbing + copy dinámico por sección | iPhone 16s, 243 frames |

---

## Dependencias

```json
{
  "framer-motion": "^12.x",
  "react-router-dom": "^7.x"
}
```

**Herramientas externas:**
- `ffmpeg` — extracción de frames
- `python3` + `Pillow` + `numpy` — remoción de fondo en PNGs
