# k8s workshop

## Overview

This repo contains exercises, which will help you start working with Kubernetes (k8s). It consists of:

- the source code with yaml files
- presentation with the theory and tips, how to use k8s in your daily work.



## Prerequisites

- [Docker](<https://docs.docker.com/>)
- [Minikube](<https://kubernetes.io/docs/tasks/tools/install-minikube/>)
  - macOs: `brew cask install minikube`
- [VirtualBox](<https://www.virtualbox.org/>) (for minikube)
  - macOs: `brew cask install virtualbox`
- [Helm](<https://helm.sh/docs/using_helm/#installing-helm>)
  - macOs: `brew install kubernetes-helm`



Check the tools:

```bash
# --- check docker: running containers ---
docker ps 

# output:
CONTAINER ID	IMAGE	COMMAND		CREATED		STATUS		PORTS		NAMES

# --- check minikube: version & run minikube ---
minikube -v
minikube start
kubectl get all

# output:
There is a newer version of minikube available (v1.0.0).  Download it here:
https://github.com/kubernetes/minikube/releases/tag/v1.0.0

To disable this notification, run the following:
minikube config set WantUpdateNotification false
😄  minikube v0.35.0 on darwin (amd64)
🔥  Creating virtualbox VM (CPUs=2, Memory=2048MB, Disk=20000MB) ...
💿  Downloading Minikube ISO ...
 184.42 MB / 184.42 MB [============================================] 100.00% 0s
📶  "minikube" IP address is 192.168.99.100
🐳  Configuring Docker as the container runtime ...
✨  Preparing Kubernetes environment ...
💾  Downloading kubelet v1.13.4
💾  Downloading kubeadm v1.13.4
🚜  Pulling images required by Kubernetes v1.13.4 ...
🚀  Launching Kubernetes v1.13.4 using kubeadm ...
⌛  Waiting for pods: apiserver proxy etcd scheduler controller addon-manager dns
🔑  Configuring cluster permissions ...
🤔  Verifying component health .....
💗  kubectl is now configured to use "minikube"
🏄  Done! Thank you for using minikube!


NAME				TYPE		CLUSTER-IP		EXTERNAL-IP		PORT(S)		AGE
service/kubernetes  ClusterIP	x.x.x.x			<none>			443/TCP		2m

# --- check helm: init & version ----
helm init
helm version

# output:
Client: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}

```





## Branches (steps/bites)

The repository has 4 branches, called bites. Each of them provides some improvements, i.e deployments have some additional annotations. To get the most out of it, go through all the branches (bites) in a right order (`bite1 -> bite2 -> bite3 -> bite4 -> bite5` ).



## Prepare your environment

To start working with k8s, run these commands:

```bash
# start minikube
minikube start

# bind your local docker to the minikube one
eval $(minikube docker-env)

# enable ingress
minikube addons enable ingress

# then check 
kc get po -n kube-system

# build backend docker image
cd backend
docker build -t backend:v1

# add this line to your /etc/hosts
...
192.168.99.100       backend.domain.com frontend.domain.com

```



### Bite1

In the first bite, we will deploy the database and backend. 

Run these commands to create your first _deployments, services, and ingress_:

```bash
kubectl apply -f database/deployment/database-deployment.yaml
kubectl apply -f database/deployment/service-deployment.yaml

kubectl apply -f backend/deployment/backend-deployment.yaml
kubectl apply -f backend/deployment/backend-service.yaml
kubectl apply -f backend/deployment/backend-ingress.yaml
```



##### Proof:

```bash
# display all resources deployed on k8s
kubectl get all

# display deployments/pods/services/ingresses deployed on k8s
kubectl deployment # or kubectl deployments or kubectl deploy
kubectl pod # or kubectl pods or kubectl po
kubectl service # or kubectl services or kubectl svc
kubecrl ingress # or kubectl ingresses or kubectl ing
```



##### Proof:

Go to minikube [dashboard](<http://127.0.0.1:52686/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/#!/overview?namespace=default>) and see your deployments there.



##### Proof:

Go to **backend.domain.com**. Under the main root (`/`), you should see: _"backend works"_. 

If you are familiar with MongoDB and want to add some data to the running mongo container, go to **Play with Mongo** in Advanced.md file.



### Bite2

In the _bite2_, we will deploy frontend using similar commands as in the first bite. Before that, we need to build a docker image for the frontend application:

```bash
# build backend docker image
cd frontend
docker build -t frontend:v1
```

This docker images can take some time since `npm install` is running inside. If you want to save your time in the future (you will build the image a couple of times), replace the Dockerfile with the following one: 

```dockerfile
FROM nginx

COPY ./build /etc/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /etc/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

and then run:

```bash
cd frontend

# install dependencies
npm install

# build production code
npm run build

# build backend docker image
docker build -t frontend:v1
```

At the end, deploy the frontend app:

```
kubectl apply -f frontend/deployment/frontend-deployment.yaml
kubectl apply -f frontend/deployment/frontend-service.yaml
kubectl apply -f frontend/deployment/frontend-ingress.yaml
```



##### Proof:

Go to **frontend.domain.com** . Now, we should be able to open the frontend app in the browser. The problem will be (as always ;)) with the CORS. Go to _bite3_ to learn how to fix it.



### Bite3

We have 2 options to fix the issue with CORS and allow the frontend app to fetch the data from the backend:

- we can install [cors](<https://expressjs.com/en/resources/middleware/cors.html>) library and use it in the `server.js` file, in the backend,
- or, we can put the [annotation](<https://imti.co/kubernetes-ingress-nginx-cors/>) in the backend ingress, which will turn on the CORS for us. In the _bite3_, we will go with the second approach.

Rebuild your ingress:

```bash
# deploy new ingress (with cors)
kubectl apply -f backend/deployment/backend-ingress.yaml
```



##### Proof:

Go to **frontend.domain.com** . Now, we should not have any CORS problem. 



### Bite4

The _bite4_ is about **Helm**, which is a package manager for Kubernetes. In this small project, we have 3 deployments (database, backend, frontend), where each of them has 2 - 3 files. To have the whole application working as we suspect, we have to run `kubectl apply` ~8 times. 

Let's imagine, that you have more than one app, more than one service, more than one database. Do you want to deploy them (every service, ingress, deployment, and so on) as you did it before? Helm comes for the rescue!

```bash
# run tiller
helm init

# deploy everything at once 
helm install helm-deployment
```



##### Proof:

```bash
# display all resources deployed on k8s
kubectl get all

# display list of helm releases
helm list
```



### Bite5

The last bite is an exercise for you. Inside the **exercise** directory, you will find a small service with Dockerfile. All you need to do is build the image and create yamls to deploy the app on k8s! 

Good luck! 







