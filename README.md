# Rhea http app demo

## Prerequisites

- [Skupper router](https://github.com/skupperproject/skupper-router)

in the root folder of the project run:
```docker build -t <name_container> .```
```docker run --rm --net=host <name_container>```

## How install

Go into the ***frontend, api, data-manager** folder and run the command:

```npm install```

## How run

Before running the application we need to create a build of the frontend app and move it into the **api** folder (hour http server)

To do that go into the frontend folder and run the command:

```npm run build```

then you can go into the **api** and **data-manager** folder and run the command:

```npm run start```

then open the browser at `http://localhost:3002`

### Development

Go into the **frontend, api, data-manager**  folder and run the command:

```npm run start-dev```

then open the browser at `http://localhost:3000`

