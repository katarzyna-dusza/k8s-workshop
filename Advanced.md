### Play with MongoDB

```bash
# list all pods
kubectl get po

# enter the container 
kubectl exec -it pod-name bash

#--------- inside mongo container

# run mongo shell
mongo

# list all databases
show dbs

# select movies-db database
use movies-db

# add new movie to the collection
db.movies.insert({ title: 'title', genres: 'genres', cast: 'cast', rate: 8, runtime: 120 })

# list all movies
db.movies.find().pretty()

```

> You can do the same to list your logs inside backend/frontend app, for example:
>
> All you need to do is to run the same command:
>
> `kubectl exec -it pod-name bash`



### Other useful commands

#### Dry-run

- Kubernetes

  ```bash
  # example: kubectly run name --image=backend:v1 --expose --port=4000 --dry-run -o yaml
  kubectly run name --image=imageName:imageVersion --expose --port=PORT --dry-run -o yaml
  ```

- Helm

  ```bash
  # example: helm install --debug --dry-run ./helm-deployment
  helm install --debug --dry-run name-of-helm-deployment
  ```



#### Delete

- Helm

```
helm delete --purge helm-deployment
```



#### Cheatsheet

- [Kubernetes](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)