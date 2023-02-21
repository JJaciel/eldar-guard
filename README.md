# Eldar Guard

Node service to provide authentication for Eldar Face client

### Setup

Install dependencies

```sh
npm i
```

Add necessary env vars, follow .env.sample

### Run locally

Development

```sh
npm run dev
```

### Extra

For EADDINUSE error
´´´sh
lsof -i tcp:4000
kill -9 PID
´´´
