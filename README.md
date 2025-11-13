# Módulo de Grupos

Este documento explica cómo funciona el módulo de Grupos: su modelo de datos, validaciones (helper), controlador y rutas disponibles. El módulo organiza grupos académicos dentro de una **sede** (`Headquarters`), con director de grupo (usuario con rol `instructor`), año, ciclo, nivel, grado, jornada y periodos.

## Modelos

- `models/groups.js` (`Group`)
  - `headquarters`: `ObjectId` → referencia a `Headquarters` (sede).
  - `year`: `Number` → año del grupo.
  - `cycle`: `String` → enum `['normal', 'semestral']`.
  - `level`: `String` → enum `['PREESCOLAR', 'PRIMARIA', 'SECUNDARIA', 'ESCUELA_SECUNDARIA']`.
  - `grade`: `String` → grado (texto, requerido).
  - `groupIdentifier`: `String` → identificador dentro del grado, ej. `A`, `B`, `C`.
  - `session`: `String` → enum `['MAÑANA', 'TARDE', 'NOCHE']`.
  - `groupDirector`: `ObjectId` → referencia a `ModelUser` (usuario con rol `instructor`).
  - `periodData`: `[{ period: Number }]` → arreglo de periodos académicos.
  - `isActive`: `Boolean` → activo/inactivo (default: `true`).
  - `timestamps`: `createdAt`, `updatedAt` → fechas automáticas.
  - Índice único: (`headquarters`, `year`, `grade`, `groupIdentifier`). Evita duplicados.

- `models/Headquarters.js` (`Headquarters`)
  - Modelo de **sede**; se utiliza para el campo `headquarters` en `Group`.

- `models/ModelUser.js` (`ModelUser`)
  - Usuarios de la institución. El director de grupo debe tener rol `instructor`.

## Validaciones (Helper)

Archivo: `helpers/helpergroup.js`

- `validateHeadquarters(headquartersId)`
  - Verifica `ObjectId` válido y existencia en la colección `Headquarters`.
  - Error claro si no existe la sede.

- `validateGroupDirector(directorId)`
  - Verifica `ObjectId` válido.
  - Busca al usuario por ID y valida que tenga rol `instructor` (acepta arreglo o cadena).
  - Mensajes diferenciados: "no existe" vs "no tiene rol requerido".

- `validateYear(year)`
  - Acepta cadenas numéricas y números.
  - Debe ser entero.

- `validateLevel(level)` / `validateCycle(cycle)` / `validateSession(session)`
  - Validan contra sus respectivos enums.

- `validateGrade(grade)`
  - Rechaza cadenas vacías.

## Controlador

Archivo: `controllers/groupscontroller.js`

- `createGroup(req, res)`
  - Crea un grupo a partir del body ya validado.
  - Maneja conflicto de índice único (409) y errores de servidor.

- `createGroupInHeadquarters(req, res)`
  - Variante que arma el objeto con `headquarters` desde `params`. Útil si la ruta anida grupos bajo una sede específica.

- `getGroupsByYear(req, res)`
  - Lista grupos por año. `populate` opcional de `headquarters` y `groupDirector`.

- `getGroupsByHeadquarters(req, res)`
  - Lista grupos por `headquarters` (sede).

- `getGroupById(req, res)`
  - Obtiene un grupo por ID con `populate` de sede y director.

- `updateGroup(req, res)`
  - Actualiza un grupo con validaciones (`runValidators: true`). Maneja 409 por índice único y errores de formato de ID.

- `activateGroup(req, res)` / `deactivateGroup(req, res)`
  - Cambian `isActive`.

- `deleteGroup(req, res)`
  - Elimina por ID.

- `getStudentsByGroup(req, res)`
  - Lista usuarios del rol `estudiante` de la misma sede del grupo.

- `getGuardiansByGroup(req, res)`
  - Lista usuarios del rol `acudiente` de la sede del grupo.

- `getInstructorsByGroup(req, res)`
  - Lista usuarios del rol `instructor` de la sede del grupo.

## Rutas

Archivo: `routes/groups.js`

- `POST /api/groups`
  - Body validado:
    - `headquarters` (ObjectId de `Headquarters`).
    - `year` (número entero).
    - `cycle`, `level`, `grade` (requeridos + enums en helper).
    - `groupIdentifier` (requerido).
    - `session` (enum).
    - `groupDirector` (ObjectId de `ModelUser` con rol `instructor`).
    - `periodData` (opcional, arreglo de objetos con `period`).

- `GET /api/groups/year/:year`
  - Valida `:year` como entero.

- `GET /api/groups/:id/students`
  - Valida `:id` como `MongoId`. Devuelve estudiantes por sede del grupo.

- `GET /api/groups/:id/guardians`
  - Valida `:id`. Devuelve acudientes por sede del grupo.

- `GET /api/groups/:id/instructors`
  - Valida `:id`. Devuelve instructores por sede del grupo.

- `GET /api/groups/:id`
  - Obtiene un grupo por ID.

- `PUT /api/groups/:id`
  - Valida `:id`. Campos del body son opcionales y validados.

- `PUT /api/groups/:id/activate` / `PUT /api/groups/:id/deactivate`
  - Activar/desactivar.

- `DELETE /api/groups/:id`
  - Eliminar por ID.

## Ejemplo de creación de grupo

Request:

```json
POST /api/groups
Content-Type: application/json

{
  "headquarters": "68efe6f8c42ec3fc5ac5931a",
  "year": 2025,
  "cycle": "normal",
  "level": "PRIMARIA",
  "grade": "2do",
  "groupIdentifier": "A",
  "session": "TARDE",
  "groupDirector": "6923ab774cfecc7bbfe55d89",
  "periodData": [{ "period": 1 }]
}
```

Notas:
- `groupDirector` debe existir en `ModelUser` y contener el rol `instructor`.
- `headquarters` debe existir en `Headquarters`.
- Los timestamps (`createdAt`, `updatedAt`) se generan automáticamente.

## Requisitos / Consideraciones

- Configuración de base de datos (`.env` → `MONGO_URL`).
- Índice único en grupos evita duplicados por sede/año/grado/identificador.

## Troubleshooting rápido

- "The Director … does not exist" → el ID no está en `ModelUser`.
- "does not have the required 'instructor' role" → el usuario existe pero no tiene rol `instructor`.
- "The Headquarters … does not exist" → el ID de sede no existe en `Headquarters`.