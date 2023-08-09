### Uso de async/await y el método then() en JavaScript:
En JavaScript, tanto async/await como el método .then() son herramientas utilizadas para trabajar con código asíncrono, como peticiones a servidores, operaciones de E/S, entre otros. Aquí exploraremos sus características y diferencias.

### Uso de async/await:
async/await es una forma más legible y estructurada de manejar operaciones asíncronas en comparación con las clásicas devoluciones de llamada (callbacks) o incluso el uso de .then(). Al declarar una función con la palabra clave async, se convierte automáticamente en una función asíncrona que devuelve una Promesa. Dentro de una función asíncrona, puedes usar la palabra clave await antes de una expresión que devuelve una Promesa para pausar la ejecución de la función hasta que la Promesa se resuelva. Esto evita la anidación excesiva y facilita la lectura del código.

### Uso del método then():
El método .then() se utiliza en Promesas para encadenar acciones que deben realizarse después de que la Promesa se resuelva o rechace. Aunque sigue siendo una forma válida de trabajar con código asíncrono, puede resultar en una estructura anidada y menos legible cuando se encadenan múltiples operaciones.

### Diferencias entre async/await y el método then():
Legibilidad y estructura: async/await permite una estructura más lineal y fácil de leer en comparación con las cadenas de .then(), especialmente cuando se manejan múltiples operaciones asíncronas secuenciales.

Manejo de errores: En async/await, los errores se manejan usando bloques try...catch, lo que hace que sea más sencillo identificar y tratar problemas. En .then(), los errores se capturan utilizando el método .catch() al final de la cadena.

Encadenamiento: Si bien ambos enfoques permiten encadenar operaciones asíncronas, async/await tiende a ser más intuitivo y menos propenso a errores de anidación profunda.

Devolver valores: En async/await, la función puede devolver directamente un valor que se resuelve como una Promesa. Con .then(), es necesario utilizar return en cada bloque .then() para mantener la cadena de Promesas.
