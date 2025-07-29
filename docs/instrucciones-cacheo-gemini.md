# Cómo cachear resultados de Gemini para reducir costes

## 1. ¿Por qué cachear?
- Gemini solo cobra por cada generación nueva.
- Si guardas el resultado y lo reutilizas, no pagas por mostrarlo de nuevo.
- Cachear es clave para ahorrar costes en horóscopos, consejos, cartas natales, etc.

---

## 2. ¿Dónde cachear?


### Opción A: Backend (recomendado)
- Guarda el resultado en tu base de datos (Firebase, MongoDB, SQL, etc.)
- Ventajas:
  - El usuario ve el mismo resultado en cualquier dispositivo.
  - Puedes servir el mismo contenido a todos los usuarios si corresponde (ej: horóscopos generales).



#### Pautas para implementar el cacheo de horóscopos generales en backend (ejemplo Firestore):

1. **Verifica la conexión a Firestore:**
   - Antes de cualquier operación, asegúrate de que la base de datos está disponible y lista para usarse.

2. **Busca el horóscopo:**
   - Intenta leer el documento correspondiente en la colección (por ejemplo, `dailyHoroscopes/{signo}_{fecha}`).
   - Si el documento existe:
     - Devuélvelo directamente al usuario (ahorras costes y evitas duplicados).

3. **Si NO lo encuentra:**
   - Llama a la IA de Gemini para generar un nuevo horóscopo para ese signo y fecha.
   - Guarda el resultado usando `docRef.set(...)` en la colección adecuada (esto crea la colección y el documento si no existen).
   - Devuelve el horóscopo recién creado al usuario.

4. **Este patrón debe repetirse para cada signo y cada día:**
   - Así, solo se paga una vez a Gemini por cada signo y día.
   - Todos los usuarios reciben el mismo contenido para ese signo y fecha.

5. **Ventajas de este enfoque:**
   - Reduces el coste de la API al mínimo necesario.
   - Mejoras la velocidad de respuesta para los usuarios posteriores.
   - El resultado es consistente para todos los usuarios ese día.

6. **Recomendaciones adicionales:**
   - Implementa un sistema de expiración o limpieza en la base de datos para eliminar horóscopos antiguos (por ejemplo, de semanas pasadas).
   - Aplica el mismo patrón a otros contenidos que sean iguales para todos los usuarios en un periodo (consejo del día, carta diaria, etc.).

#### Ejemplo de flujo (pseudocódigo):
```typescript
async function obtenerHoroscopoGeneral(signo, fecha) {
  // 1. Buscar en la base de datos
  const resultadoCacheado = await db.getHoroscopoGeneral(signo, fecha);
  if (resultadoCacheado) {
    return resultadoCacheado;
  }
  // 2. Si no existe, generar con Gemini
  const resultado = await gemini.generarHoroscopoGeneral(signo, fecha);
  // 3. Guardar en la base de datos
  await db.saveHoroscopoGeneral(signo, fecha, resultado);
  return resultado;
}
```

**Notas:**
- Este patrón se puede aplicar a cualquier contenido que sea igual para todos los usuarios en un periodo (ej: consejo del día, carta diaria, etc.).
- Así ahorras costes y todos los usuarios ven el mismo resultado, mejorando la eficiencia.

### Opción B: LocalStorage (solo para ese dispositivo)
- Guarda el resultado en el navegador o en la app móvil.
- Ventajas:
  - No necesitas backend.
  - Muy rápido.
- Desventajas:
  - Si el usuario cambia de dispositivo, se genera de nuevo y Gemini cobra otra vez.
- Ejemplo:
  - Guarda en localStorage con clave `horoscopo_personalizado_{fecha}`.
  - Si existe, muestra el resultado guardado.

---

## 3. Ejemplo de flujo para cachear en backend

```typescript
async function obtenerHoroscopoPersonalizado(usuarioId, fecha) {
  // 1. Buscar en la base de datos
  const resultadoCacheado = await db.getHoroscopo(usuarioId, fecha);
  if (resultadoCacheado) {
    return resultadoCacheado;
  }
  // 2. Si no existe, generar con Gemini
  const resultado = await gemini.generarHoroscopo(usuarioId, fecha);
  // 3. Guardar en la base de datos
  await db.saveHoroscopo(usuarioId, fecha, resultado);
  return resultado;
}
```

---

## 4. Ejemplo de flujo para cachear en localStorage

```javascript
function obtenerHoroscopoPersonalizadoLocal(fecha) {
  const clave = `horoscopo_personalizado_${fecha}`;
  const resultadoCacheado = localStorage.getItem(clave);
  if (resultadoCacheado) {
    return JSON.parse(resultadoCacheado);
  }
  // Si no existe, generar con Gemini y guardar
  const resultado = generarConGemini();
  localStorage.setItem(clave, JSON.stringify(resultado));
  return resultado;
}
```

---


## 5. Recomendaciones
- Cachea siempre los resultados generados por IA que no cambian durante el día.
- Guarda solo lo necesario: por ejemplo, el horóscopo del día, no el histórico completo.
- Elimina datos antiguos que el usuario no consulta (por ejemplo, horóscopos de días pasados).
- Para horóscopos generales, guarda el resultado por signo y fecha.
- Para consejos del día, guarda el resultado por fecha.
- Para cartas natales, guarda el resultado por usuario y no vuelvas a generar.
- Si usas backend, puedes compartir resultados entre usuarios y dispositivos.
- Si usas localStorage, el ahorro es solo para ese dispositivo.


### Ejemplo para limpiar datos antiguos en localStorage (general):
```javascript
function limpiarCacheAntiguo(prefijo, diasMaximos = 7) {
  const hoy = new Date();
  for (let clave in localStorage) {
    if (clave.startsWith(prefijo)) {
      // Extrae la fecha del nombre de la clave
      const partes = clave.split('_');
      const fechaStr = partes[partes.length - 1];
      const fecha = new Date(fechaStr);
      const diffDias = (hoy - fecha) / (1000 * 60 * 60 * 24);
      if (diffDias > diasMaximos) {
        localStorage.removeItem(clave);
      }
    }
  }
}
// Ejemplo de uso:
// limpiarCacheAntiguo('horoscopo_personalizado_', 7);
// limpiarCacheAntiguo('consejo_dia_', 3);
// limpiarCacheAntiguo('tarot_diario_', 5);
// Llama a esta función al iniciar la app o antes de guardar nuevos datos
```

---


---

## 6. Instrucciones para implementar el cacheo y limpieza en localStorage

1. **Define el prefijo para cada tipo de dato cacheado**
   - Ejemplo: 'horoscopo_personalizado_', 'consejo_dia_', 'tarot_diario_'

2. **Al guardar un resultado generado por IA:**
   - Usa una clave con el prefijo y la fecha (o identificador único si aplica)
   - Guarda el resultado usando `localStorage.setItem(clave, JSON.stringify(resultado))`

3. **Al consultar un resultado:**
   - Busca en localStorage usando la clave correspondiente
   - Si existe, muestra el resultado guardado
   - Si no existe, genera con Gemini y guarda


4. **Limpia datos antiguos semanalmente (cada 7 días):**
   - Usa la función `limpiarCacheAntiguo(prefijo, 7)`
   - Llama a esta función al iniciar la app o antes de guardar nuevos datos
   - Así solo se eliminan datos de más de una semana, manteniendo los actuales y recientes

5. **Revisa el tamaño ocupado en localStorage si tu app crece mucho**
   - Si te acercas al límite, elimina más datos antiguos o considera usar IndexedDB/backend

---

**Ejemplo de flujo completo:**

```javascript
// Guardar resultado
const clave = `horoscopo_personalizado_${fecha}`;
localStorage.setItem(clave, JSON.stringify(resultado));

// Consultar resultado
const resultadoCacheado = localStorage.getItem(clave);
if (resultadoCacheado) {
  mostrarResultado(JSON.parse(resultadoCacheado));
} else {
  const resultado = generarConGemini();
  localStorage.setItem(clave, JSON.stringify(resultado));
  mostrarResultado(resultado);
}

// Limpiar datos antiguos (cada semana)
limpiarCacheAntiguo('horoscopo_personalizado_', 7);
```

---

**Sigue estos pasos para implementar un sistema de cacheo eficiente y mantener localStorage optimizado.**
