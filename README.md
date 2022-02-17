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

Go into the **frontend, api, data-manager** folder and run the command:

`npm install`

## How run

Before running the application we need to create a build of the frontend app and move it into the **api/src** folder

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

## Running services using Skupper

### Environment

  The following example uses *Openshift* to set our kubernetes clusters, but we can work with different cluster configurations

To run this tutorial you will need:

- The `kubectl` command-line tool, version 1.15 or later ([installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/))
- The `skupper` command-line tool, the latest version ([installation guide](https://skupper.io/start/index.html#step-1-install-the-skupper-command-line-tool-in-your-environment))

- Two Kubernetes namespaces, from any providers you choose, on any clusters you choose
- Two logged-in console terminals, one for each cluster or namespace

### Step 1: Configure 2 namespaces and setup skupper

- Open 2 terminal console tabs and type:  

Namespace `web-server` and `be-store`:

``` bash
skupper init
```

### Step 2: Deploy the application

Namespace `web-server`:

```bash
kubectl apply -f <rhea-http-app path>/api/web-server.yaml
```

#### Expose the web-server service with Openshift

```bash
kubectl expose deployment/web-server --port <web server port> --type LoadBalancer  // default port 3002
```

```bash
oc create route edge --service=web-server -n web-server 
```

Namespace `be-store`:

```bash
kubectl apply -f <rhea-http-app path>/data_manager/be-store.yaml  
```

**.yaml configurations shoud have the path of your  containers**

### Step 3: Expose the be-store service to the web-server

Namespace `web-server`:

``` bash
skupper service create datastore 5672
skupper service bind datastore deployment web-server --target-port 10000
```

### Step 4: Connect namespaces with a Skupper connection

Namespace `web-server`:

```bash
skupper token create <custom path> // ie: /tmp/web-server
```

Namespace `be-store`:

```bash
skupper link create <path token created in web server namespace>
```

*The console terminals in this demo are run by the same user on the same host.*

#### Check the status

Namespace `web-server`:

```bash
$ skupper status
Skupper is enabled for namespace "web-server" in interior mode. It is connected to 1 other site. It has 1 exposed service.
```

Namespace `be-store`:

```bash
$ skupper status
Skupper is enabled for namespace "be-store" in interior mode. It is connected to 1 other site. It has 1 exposed service.
```

### Show the application

Namespace `web-server`:

```bash
oc get route -n web-server
```

then get the public URL to show the app on the browser

### Cleaning up

Namespace `web-server`:

```bash
skupper delete
kubectl delete service/web-server
kubectl delete deployment/web-server
kubectl delete namespace web-server 
```

Namespace `be-stpre`:

```bash
skupper delete
kubectl delete service/be-store
kubectl delete deployment/be-store
kubectl delete namespace be-store 
```
