# 💰 Guía para Probar Compras y Suscripciones en Google Play SIN PAGAR

Para probar tus suscripciones y productos sin usar dinero real, debes configurar tu cuenta de Google como una **cuenta de tester** en la Google Play Console. Esto te permitirá "comprar" tus productos reales usando el flujo de pago de Google, pero sin que se realice ningún cargo.

## ✅ Pasos para Configurar el Testing

Sigue estos pasos en tu [Google Play Console](https://play.google.com/console/).

### Paso 1: Sube un APK o App Bundle a la Pista de Pruebas Internas

Antes de que puedas probar, Google necesita tener una versión de tu app.

1.  **Ve a tu App en la Play Console.**
2.  En el menú de la izquierda, ve a **Lanzamiento > Pruebas > Pruebas internas**.
3.  Asegúrate de tener al menos una versión de tu app (en formato `.aab` o `.apk`) subida a esta pista. Si no tienes ninguna, deberás generar una y subirla.

### Paso 2: Crea una Lista de Testers

Aquí es donde añades las cuentas de Google que podrán realizar compras de prueba.

1.  En la misma sección de **Pruebas internas**, ve a la pestaña **"Testers"**.
2.  Busca la sección de **"Listas de correo electrónico"**. Haz clic en **"Crear lista de correo electrónico"**.
3.  Dale un nombre a la lista (ej: "Equipo de Desarrollo").
4.  En el campo de "Direcciones de correo electrónico", **añade la dirección de Gmail de la cuenta que usas en tu dispositivo de prueba**. Puedes añadir varias, separadas por comas.
5.  Guarda los cambios.
6.  **IMPORTANTE:** Asegúrate de que la casilla junto a tu nueva lista de testers esté **marcada** para que la lista esté activa.

### Paso 3: Copia el Enlace de Aceptación

1.  Una vez que la lista de testers esté activa, aparecerá un **"Enlace para compartir"** en la parte inferior de la página.
2.  Copia este enlace.
3.  **Abre el enlace en el navegador de tu dispositivo de prueba** (el mismo dispositivo y cuenta de Google que usarás para probar).
4.  Acepta la invitación para convertirte en tester.

### Paso 4: ¡Realiza Compras de Prueba!

¡Ya está todo listo! Ahora puedes realizar compras en la versión de la app instalada en tu dispositivo de prueba.

1.  Abre tu aplicación en el dispositivo de prueba.
2.  Ve a la página **Premium** o a **Obtener Polvo Estelar**.
3.  Haz clic en el botón de comprar una suscripción o un producto.
4.  Verás la pantalla de pago de Google Play. **Debería indicar claramente que es una compra de prueba y que no se te cobrará.** (Ej: "Test card, always approves").
5.  Completa el flujo de compra.

## ⚡ Comportamiento de las Compras de Prueba

-   **Productos de Compra Única:** Se pueden comprar una y otra vez (a diferencia de las compras reales que solo se pueden hacer una vez, a menos que sean consumibles).
-   **Suscripciones:** Tienen un ciclo de renovación acelerado para facilitar las pruebas.
    -   Una suscripción mensual se renovará **cada 5 minutos**.
    -   Una suscripción anual se renovará **cada día**.
    -   Esto te permite probar rápidamente los ciclos de renovación, cancelaciones y recuperaciones sin tener que esperar meses.

## ⚠️ Puntos Importantes a Recordar

-   **Cuenta Correcta:** Asegúrate de que la cuenta principal de Google en tu dispositivo de prueba sea la misma que añadiste a la lista de testers.
-   **Caché de Google Play:** A veces, los cambios en la Play Console (como añadir un nuevo producto o cambiar un precio) tardan **varias horas** en propagarse. Si no ves tus productos, borra la caché de la app "Google Play Store" en los ajustes de tu dispositivo para forzar una actualización.
-   **Versión de la App:** Debes usar una versión de la app que haya sido firmada con tu clave de producción y subida a la Play Console (aunque sea en la pista interna). Las versiones de depuración directa desde Android Studio a veces no funcionan para las pruebas de facturación.

Siguiendo esta guía, podrás probar todo el flujo de monetización de forma segura y completa.