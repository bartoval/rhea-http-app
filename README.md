# Rhea http app demo

![Design](https://user-images.githubusercontent.com/79913332/154068275-7225840e-eea0-4968-9904-1fac966562d6.png)

## Prerequisites

- [Skupper router](https://github.com/skupperproject/skupper-router)

in the root folder of the project run:
`docker build -t <name_container> .`

Then we need add a connector to communicate with the http api server.

``` javascript
connector {
    host: 127.0.0.1
    port: 10000
    saslMechanisms: ANONYMOUS
    role: normal
}
```

Here a possible example:

- create a file called **qdrouterd.json**

``` javascript
  [
    [
        "router",
        {
            "id": "local-router",
            "mode": "interior"
        }
    ],
    [
        "listener",
        {
            "name": "amqp",
            "host": "0.0.0.0",
            "port": 5672
        }
    ],
    [
        "connector",
        {
            "host": "127.0.0.1", 
            "port": 10000,
            "saslMechanisms": "ANONYMOUS",
            "role": "normal"
        }
    ]
  ]
```

then add this file when you run your container

``` bash
docker run --rm --name router -v <path of your config file>/qdrouterd.json:/tmp/qdrouterd.json:Z -e QDROUTERD_CONF_TYPE=json --network host  <name container>
```

## How install

Go into the ***frontend, api, data-manager** folder and run the command:

`npm install`

## How run

Before running the application we need to create a build of the frontend app and move it into the **api/src** folder (hour http server)

To do that go into the **frontend** folder and run the command:

```npm run build```

then you can go into the **api** and **data-manager** folder and run the command:

`npm run start`

then open the browser at `http://localhost:3002`

### Development

Go into the **frontend, api, data-manager**  folder and run the command:

`npm run start-dev`

then open the browser at `http://localhost:3000`

### Running services from containers

Go into **data-manager** and **api** folders and run

`docker build -t <name_container> .`
`docker run --rm --network host <name_container>`

then open the browser at `http://localhost:3002`

## MAC differences

On the Mac the option **--network=host** doesn't work: The docker daemon is actually running in a virtual machine, not your actual machine. Thus, it’s not connecting to host ports for your Mac, but rather it’s connecting to host ports for that specific virtual machine.

The connector should be

``` javascript
connector {
    host: "host.docker.internal",
    port: 10000
    saslMechanisms: ANONYMOUS
    role: normal
}
```

moreover the Skupper-router container should expose the port (by default 5672)

``` bash
docker run --rm --name router -v <path of your config file>/qdrouterd.json:/tmp/qdrouterd.json:Z -e QDROUTERD_CONF_TYPE=json -p <BROKER_PORT_HOST>:<BROKER_PORT_CONTAINER>  <name container>
```

then the api server

``` bash
docker run --rm -p 10000:10000 -p 3002:3002 <name http api server container>
```

before running the datastore server container we need to pass the right host to connect

```bash
RHEA_DATASTORE_HOST="host.docker.internal" docker run --rm <name container>
```
