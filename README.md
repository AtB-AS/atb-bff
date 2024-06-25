# AtB BFF (oneclick-journey-planner)

Provides HTTP REST endpoints for consuming Entur services from mobile / web
applications. Built as a docker image and runs on GCP.

API documentation is generated at runtime and lives in `/documentation`
(Swagger).

## Installation

Clone this project:

`git clone https://github.com/atb-as/atb-bff.git`

### Docker

Build and run the docker image, for local development:

```
docker build --target=dev -t atb-bff:dev .
docker run --rm -it -e PORT=8080 -p 8080:8080 -v $PWD:/app atb-bff:dev
```

### Starting locally

#### Requirements

- Node.js >=18

Install node packages

`npm install`

Start the development server

`npm run start:dev`

## Architecture

The runtime is written in TypeScript and runs on Node.js

- HTTP server framework: [Hapi](https://hapi.dev)
    - Request and response validation is performed by
      [Joi](https://hapi.dev/family/joi/)
    - Swagger documentation is generated by
      [hapi-swagger](https://github.com/glennjones/hapi-swagger)
- Testing framework: [Jest](https://jestjs.io/) and [k6](https://k6.io/) (see [test/README.md](test/README.md))

Hapi was chosen because it is battle-tested, has a magnitude of features
supported out of the box, and has few external dependencies. Most of its
dependencies are handled by the same team that maintains Hapi.

Service interfaces lives in `service/`, implementations in `service/impl`

API endpoints live in `api/`.

## GraphQL Code Generation

For endpoints that uses GraphQL directly we generate types and code using
`graphql-code-gen`. GraphQL queries against journey planner must be put in
folders named `journey-gql`.

If the queries, scheme, operations or fragments change, generate the code using
the script:

```
npm run gql-gen
```

This will make a TypeScript representation of the `.graphql` file in the same
location but with `.graphql-gen.ts` extension. You can use these directly as
queries.

## Deploy to staging

Changes to `main` branch will automatically be deployed to staging.

You can see the status of each deploy [here](https://github.com/AtB-AS/atb-bff/actions/workflows/docker_gcp-infra.yaml).

## Deploy to prod

1. Go to [Releases](https://github.com/AtB-AS/atb-bff/releases)
2. Click "Draft a new release"
3. Create a new tag (formatted something like "v1.9.0"). When selecting version number, follow these guidelines:
    - **Major**: Breaking change. This version breaks functionality for older clients.
    - **Minor**: This version extends functionality.
    - **Patch**: This version affects no APIs at all, just changes to existing code.
4. Click "Generate release notes"
5. Click "Publish release"

You can see the status of the deploy [here](https://github.com/AtB-AS/atb-bff/actions/workflows/docker_gcp-infra.yaml).
