# Schema Stitching z Hive Gateway

Projekt demonstracyjny pokazujący jak zbudować unified GraphQL Gateway przy użyciu GraphQL Hive Gateway i GraphQL Yoga, łączący wiele subgrafów GraphQL w jeden spójny endpoint.

## 📋 Spis treści

- [Opis projektu](#opis-projektu)
- [Architektura](#architektura)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Uruchomienie](#uruchomienie)
- [Struktura projektu](#struktura-projektu)

## 🎯 Opis projektu

Projekt składa się z dwóch głównych serwisów:

1. **Yoga Service** - Własny serwis GraphQL zbudowany z GraphQL Yoga
2. **Gateway Service** - Unified gateway używający Hive Gateway do łączenia wielu subgrafów

Gateway łączy następujące subgrafy:
- **Yoga Service** - Twój własny serwis GraphQL
- **Countries API** - Publiczne API z danymi o krajach

## 🏗️ Architektura

```
┌─────────────────┐
│                 │
│    Klient       │
│                 │
└────────┬────────┘
         │
         │ Port 4002
         │
┌────────▼─────────────────────┐
│                              │
│    Gateway Service           │
│    (Hive Gateway)            │
│                              │
└──────┬──────────┬────────────┘
       │          │
       │          │ https://countries.trevorblades.com
       │          │
       │          └──────────────┐
       │                         │
       │ Port 4000              │
       │                         │
┌──────▼────────┐         ┌────▼──────────┐
│               │         │               │
│ Yoga Service  │         │ Countries API │
│               │         │ (External)    │
└───────────────┘         └───────────────┘
```

## ⚙️ Wymagania

- [Bun](https://bun.sh/) >= 1.0
- Docker i Docker Compose (opcjonalnie)

## 📦 Instalacja

### Instalacja lokalna

1. Sklonuj repozytorium:
```bash
git clone <url-repozytorium>
cd SchemaStitchingWithGateway
```

2. Zainstaluj zależności dla obu serwisów:

```bash
# Yoga Service
cd yoga-service
bun install

# Gateway Service
cd ../gateway-service
bun install
```

## 🚀 Uruchomienie

### Opcja 1: Docker Compose (Zalecane)

Najprostszy sposób uruchomienia całego stacku:

```bash
docker-compose up
```

Serwisy będą dostępne pod:
- **Gateway**: http://localhost:4002/graphql
- **Yoga Service**: http://localhost:4000/graphql

### Opcja 2: Uruchomienie lokalne

#### Uruchom Yoga Service (Terminal 1):
```bash
cd yoga-service
bun run dev
```

Serwis uruchomi się na `http://localhost:4000/graphql`

#### Uruchom Gateway Service (Terminal 2):
```bash
cd gateway-service
YOGA_SERVICE_URL=http://localhost:4000/graphql bun run dev
```

Gateway uruchomi się na `http://localhost:4002/graphql`

## 📁 Struktura projektu

```
SchemaStitchingWithGateway/
├── docker-compose.yml          # Konfiguracja Docker Compose
├── gateway-service/            # Serwis Gateway
│   ├── gateway.config.ts       # Główna konfiguracja gateway
│   ├── package.json
│   └── src/
│       ├── gateway.config.ts   # Konfiguracja Hive Gateway
│       └── mesh-config.ts      # Konfiguracja subgrafów
└── yoga-service/               # Serwis GraphQL Yoga
    ├── package.json
    └── src/
        ├── schema.ts           # Definicja schematu GraphQL
        └── server.ts           # Konfiguracja serwera
```

## 🔍 API

### Przykładowe zapytania

#### 1. Zapytanie do Yoga Service przez Gateway:

```graphql
query {
  hello
}
```

Odpowiedź:
```json
{
  "data": {
    "hello": "world"
  }
}
```

#### 2. Zapytanie do Countries API przez Gateway:

```graphql
query {
  countries {
    name
    code
    capital
    currency
  }
}
```

#### 3. Zapytanie introspection (sprawdzenie schematu):

```graphql
query {
  __schema {
    queryType {
      name
    }
    types {
      name
    }
  }
}
```

### Testowanie z curl

```bash
# Test Yoga Service
curl -X POST http://localhost:4002/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ hello }"}'

# Test Countries API
curl -X POST http://localhost:4002/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ countries { name code } }"}'
```

### GraphQL Playground

Otwórz przeglądarkę i wejdź na:
- Gateway: http://localhost:4002/graphql
- Yoga Service (bezpośrednio): http://localhost:4000/graphql

## 🛠️ Rozwój

### Dodawanie nowego subgrafu

1. Edytuj `gateway-service/src/mesh-config.ts`:

```typescript
export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph('NowySubgraf', {
        endpoint: 'http://twoj-endpoint/graphql'
      })
    },
    // ... pozostałe subgrafy
  ]
});
```

2. Zrestartuj Gateway Service

### Rozszerzanie schematu Yoga Service

1. Edytuj `yoga-service/src/schema.ts`:

```typescript
export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
      nowePole: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'world',
      nowePole: () => 'wartość'
    }
  }
})
```

2. Serwis automatycznie się przeładuje w trybie watch

### Tryb watch (auto-reload)

```bash
# Yoga Service z auto-reload
cd yoga-service
bun run dev:watch
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

#### Gateway Service:
- `YOGA_SERVICE_URL` - URL endpointu Yoga Service (domyślnie: `http://localhost:4000/graphql`)
- `PORT` - Port na którym działa gateway (domyślnie: `4002`)

#### Yoga Service:
- `PORT` - Port na którym działa serwis (domyślnie: `4000`)

### Docker Compose

Możesz modyfikować porty i zmienne środowiskowe w `docker-compose.yml`:

```yaml
services:
  gateway-service:
    ports:
      - 4002:4002  # host:container
    environment:
      - YOGA_SERVICE_URL=http://yoga-service:4000/graphql
```

## 📚 Przydatne linki

- [GraphQL Hive Gateway](https://the-guild.dev/graphql/hive/docs/gateway)
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)
- [GraphQL Mesh](https://the-guild.dev/graphql/mesh)
- [Bun Documentation](https://bun.sh/docs)

