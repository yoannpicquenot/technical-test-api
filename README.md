# Technical-test-api

Url: https://technical-test-api.onrender.com

# Authentification

**accessToken** : Un jeton utilisé pour accéder aux API sécurisées, qui expire  rapidement pour minimiser le risque en cas de compromission. Il contient généralement des informations d'identification de l'utilisateur et des droits d'accès.

**refreshToken** : Un jeton plus durable utilisé pour obtenir un nouvel accessToken une fois que l'accessToken initial a expiré. Son utilisation renforce la sécurité en limitant la fréquence de saisie des informations d'authentification par l'utilisateur.

**Processus d'utilisation** : L'utilisateur se connecte, reçoit à la fois un accessToken et un refreshToken. L'accessToken est utilisé pour les requêtes subséquentes jusqu'à son expiration.

**Renouvellement** : À l'expiration de l'accessToken, le refreshToken est envoyé à un point d'API spécifique pour obtenir un nouvel accessToken sans que l'utilisateur n'ait le besoin de se reconnecter.

### Connexion
```json
POST /signin
content-type: application/json
```
#### Payload
```json
{
  "email": string,
  "password": string
}
```
#### Responses
```json
200:
{
  "accessToken": string,
  "refreshToken": string
}

400:
{
  "error": "incorrect_credentials",
  "message": "Email or password is not correct. Check them twice",
}
```
<br>
<br>

## Renouvellement du token
Demande un nouvel accessToken et refreshToken.

```json
POST /refresh
content-type: application/json
```
#### Payload
```json
{
  "refreshToken": string
}
```
#### Responses
```json
200:
{
  "accessToken": string,
  "refreshToken": string
}

401:
{
  "error": "no_token",
  "message": "User must provide a token",
}

401:
{
  "error": "expired_token",
  "message": "Token is expired",
}
```

<br>
<br>

## Récuperer les utilisateurs
```json
GET /users
content-type: application/json
headers:
  - authorization: accessToken

```

### Responses
```json

200:
[{
  "id": string,
  "firstName": string,
  "lastName": string,
  "position": string
}]
```
<br>
<br>

## Créer un nouvel utilisateur
```json
POST /users
content-type: application/json
headers:
  - authorization: accessToken
```
### Payload
```json
{
  "firstName": string,
  "lastName": string,
  "position": string
}
```
### Responses
```json
200:
{
  "id": string,
  "firstName": string,
  "lastName": string,
  "position": string
}

400:
{
  "error": "invalid_data",
  "message": "Data are not correct",
}
```
<br>
<br>

## Modifier un utilisateur
```json
PATCH /users/:id
content-type: application/json
headers:
  - authorization: accessToken
```
### Payload
```json
{
  "firstName": string, // nullable
  "lastName": string, // nullable
  "position": string // nullable
}
```
### Response
```json
200:
{
  "id": string,
  "firstName": string,
  "lastName": string,
  "position": string
}

404:
{
  "error": "user_not_found",
  "message": "User not found",
}
```

```json
DELETE /users/:id
content-type: application/json
headers:
  - authorization: accessToken

201: Ok

404:
{
  "error": "user_not_found",
  "message": "User not found",
}
```
---
## Error
```json
{
  "error": string,
  "message": string
}
```
