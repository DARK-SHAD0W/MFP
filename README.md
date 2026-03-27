# My Favorite Places App

A modern web application to discover, save, and manage your favorite places. Built with React, Node.js/Express, and PostgreSQL.

## Requirements

- **Docker** & **Docker Compose**
- Node.js 18+ (for local development without Docker)

## Project Architecture

```bash
MFP (My Favorite Places)
├── client/          # React 18 + Vite frontend (Port 5173)
├── server/          # Node.js/Express backend (Port 3000)
└── compose.yml      # Docker Compose configuration
```

- **Frontend (Client)**: React application with Vite
- **Backend (Server)**: Express.js with TypeORM and PostgreSQL
- **Database**: PostgreSQL 16 Alpine

---

Testing main branch workflow

## Docker Fundamentals

### What is a Dockerfile?
A **Dockerfile** is a blueprint that defines:
- Base image to use
- Dependencies to install
- Files to copy
- Commands to run
- Ports to expose
- Default command to execute

It creates a **Docker image** (a static template/snapshot).

**Example**: `server/Dockerfile` defines how to build the backend image.

### What is Docker Compose?
**Docker Compose** (compose.yml) is an orchestration tool that:
- Defines and runs **multiple containers** as a single application
- Sets up networking between containers
- Manages volumes and environment variables
- Simplifies multi-service deployments with a single command

**Key difference**:
- `Dockerfile` → defines ONE container/image
- `compose.yml` → runs MULTIPLE containers together

---

## Quick Start with Docker Compose

### Start the application
```bash
docker compose up
```
Builds and starts all services: PostgreSQL, Express server, React client.

### Start with fresh builds (rebuild images)
```bash
docker compose up --build
```
Use after updating code, dependencies, or Dockerfiles.

### Start in background (detached mode)
```bash
docker compose up -d
```

### Stop all services (keeps volumes)
```bash
docker compose down
```

### Stop and delete everything (including data)
```bash
docker compose down -v
```
⚠️ **Warning**: Removes database volumes.

### Access the application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

---

## Docker Images Management

### List all images
```bash
docker images
docker image ls
```

### Build an image from Dockerfile
```bash
docker build -t my-image-name:1.0 ./server
```

### Tag an image
```bash
docker tag my-image-name:1.0 my-image-name:latest
docker tag my-image-name:1.0 username/my-image-name:1.0
```

### Remove a specific image
```bash
docker rmi image-name:tag
docker rmi image-id
```

### Remove an image forcefully
```bash
docker rmi -f image-name:tag
```

### Delete all unused images
```bash
docker image prune
```

### Delete all images (including used ones)
```bash
docker rmi $(docker images -q)
```

### Delete all images forcefully
```bash
docker rmi -f $(docker images -q)
```

### Search for an image (from Docker Hub)
```bash
docker search ubuntu
```

### Pull an image from Docker Hub
```bash
docker pull postgres:16-alpine
```

---

## Docker Containers Management

### List running containers
```bash
docker ps
docker container ls
```

### List all containers (including stopped)
```bash
docker ps -a
docker container ls -a
```

### Run a container
```bash
docker run -d --name my-container -p 8080:80 nginx
```

### Start a stopped container
```bash
docker start container-name
docker start container-id
```

### Stop a running container
```bash
docker stop container-name
```

### Kill a container (force stop)
```bash
docker kill container-name
```

### Remove a stopped container
```bash
docker rm container-name
```

### Remove a running container (force)
```bash
docker rm -f container-name
```

### Delete all stopped containers
```bash
docker container prune
```

### Delete all containers (stopped and running)
```bash
docker rm $(docker ps -aq)
```

### Delete all containers forcefully
```bash
docker rm -f $(docker ps -aq)
```

### View container logs
```bash
docker logs container-name
docker logs -f container-name        # Follow logs
docker logs --tail 100 container-name # Last 100 lines
```

### Execute a command in a running container
```bash
docker exec -it container-name bash
docker exec -it container-name sh
```

### Inspect container details
```bash
docker inspect container-name
```

---

## Docker Networks Management

### List all networks
```bash
docker network ls
```

### Create a network
```bash
docker network create my-network
docker network create --driver bridge my-network
```

### Connect a container to a network
```bash
docker network connect my-network container-name
```

### Disconnect a container from a network
```bash
docker network disconnect my-network container-name
```

### Remove a network
```bash
docker network rm my-network
```

### Remove all unused networks
```bash
docker network prune
```

### Inspect a network (see connected containers)
```bash
docker network inspect my-network
```

---

## Docker Volumes Management

### List all volumes
```bash
docker volume ls
```

### Create a volume
```bash
docker volume create my-volume
```

### Inspect a volume
```bash
docker volume inspect my-volume
```

### Remove a volume
```bash
docker volume rm my-volume
```

### Remove all unused volumes
```bash
docker volume prune
```

### Remove all volumes (including used)
```bash
docker volume rm $(docker volume ls -q)
```

### Mount a volume when running a container
```bash
docker run -d -v my-volume:/data --name my-container nginx
```

---

## System Cleanup & Disk Space

### Show Docker disk usage
```bash
docker system df
```

### Remove all unused data (images, containers, networks, volumes)
```bash
docker system prune
```

### Aggressive cleanup (removes all unused data forcefully)
```bash
docker system prune -a --volumes
```

---

## Practical Examples for This Project

### Clean and rebuild everything
```bash
# Stop all services
docker compose down -v

# Remove all dangling images/containers
docker system prune

# Rebuild and start fresh
docker compose up --build
```

### Access the database
```bash
# Option 1: Connect via docker exec
docker exec -it mfp-db-1 psql -U mfp-user -d mfp-db

# Option 2: Use psql from your machine
psql -h localhost -U mfp-user -d mfp-db
```

### Rebuild only the server
```bash
docker compose up --build server
```

### Remove only the database and restart (keep server/client)
```bash
docker volume rm mfp-db-data
docker compose up db
```

### Tag and push images to Docker Hub
```bash
docker tag mfp-server:latest username/mfp-server:1.0
docker push username/mfp-server:1.0
```

---

## Using Production Compose File

The `compose.prod.yml` file pulls pre-built images from GitHub Container Registry (GHCR) instead of building locally.

### Run Production Compose File
```bash
docker compose -f compose.prod.yml up
```

### Run with Specific Version Tag
```bash
# Use latest production build
docker compose -f compose.prod.yml up

# Use specific SHA tag
docker compose -f compose.prod.yml up
```

### Rebuild Local Images (Development)
```bash
# Use local compose.yml to build and run locally
docker compose up --build
```

### Key Differences

| Scenario | Command | What Happens |
|----------|---------|--------------|
| **Local Development** | `docker compose up --build` | Builds images locally from Dockerfile |
| **Production** | `docker compose -f compose.prod.yml up` | Pulls pre-built images from GHCR |
| **Dev Branch Images** | `docker compose -f compose.prod.yml up` + edit image tags to `:dev` | Pulls development branch images |

### Update Images in Production
```bash
# Pull latest images from registry
docker compose -f compose.prod.yml pull

# Then restart services
docker compose -f compose.prod.yml up -d
```