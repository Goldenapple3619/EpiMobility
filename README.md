# EpiMobility

Epitech project mobility platform


## Caddy setup

### Example Caddyfile

```
http://localhost {
    reverse_proxy web:8080 {
        header_up X-Real-IP {client_ip}
    }
}
```

## Using the project

### For developpement

#### Running

```
docker compose -f docker-compose.dev.yml up -d --build
```

#### Checking logs

```
docker compose -f docker-compose.dev.yml logs [service]
```

#### Stopping

```
docker compose -f docker-compose.dev.yml down --remove-orphans
```

#### Remove volumes

```
docker compose -f docker-compose.dev.yml down --remove-orphans -v
```


### In production

#### Running

```
docker compose up -d --build
```

#### Checking logs

```
docker compose logs [service]
```

#### Stopping

```
docker compose down --remove-orphans
```
