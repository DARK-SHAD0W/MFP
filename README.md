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

## Getting Started

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

## Quick Start

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

## Docker Management

### Docker Images

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

### Docker Containers
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

### Docker Networks
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

### Docker Volumes
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

### System Cleanup

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

## Practical Examples

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

## CI/CD Pipeline

### Overview

The project implements automated Docker image building and publishing through GitHub Actions workflows. Images are automatically built on code changes and pushed to GitHub Container Registry (GHCR).

### Workflows

Two main workflows handle the build and push pipeline:

- **`build.client.yml`**: Builds and pushes the React frontend image
- **`build.serveur.yml`**: Builds and pushes the Node.js backend image

#### Trigger Conditions

Workflows trigger on:
- Push to `main` or `dev` branches
- Only when relevant files change (client files for frontend, server files for backend)
- Any changes to the workflow file itself

#### Image Tagging Strategy

Each build generates multiple tags for flexibility:
- **Branch name tag**: `main` or `dev`
- **Commit SHA tag**: `main-a1b2c3d` or `dev-x9y8z7w` (for version tracking)
- **Latest tag**: Added only on `main` branch
- **Dev tag**: Added only on `dev` branch

#### Build Pipeline Steps

1. Checkout code from repository
2. Authenticate with GitHub Container Registry
3. Extract and generate image metadata and tags
4. Build Docker image and push to GHCR
5. Generate security attestation (proves GitHub Actions built the image)

### Production Deployment

The `compose.prod.yml` file pulls pre-built images from GHCR instead of building locally:

```bash
docker compose -f compose.prod.yml up
```

This separates development (local builds) from production (pre-built images):

| Scenario | Command | What Happens |
|----------|---------|--------------|
| **Local Development** | `docker compose up --build` | Builds images locally from Dockerfile |
| **Production** | `docker compose -f compose.prod.yml up` | Pulls pre-built images from GHCR |
| **Dev Branch Images** | Edit image tags to `:dev` in compose.prod.yml | Pulls development branch images |

### Update Images in Production

```bash
# Pull latest images from registry
docker compose -f compose.prod.yml pull

# Restart services with updated images
docker compose -f compose.prod.yml up -d
```

### Fixing Docker Hub Rate Limiting

#### Problem

Docker Hub limits unauthenticated image pulls to 25 requests per 6 hours per IP address. When GitHub Actions tries to pull base images (e.g., `node:20-alpine`) during builds, it hits this rate limit error:

```
429 Too Many Requests: too many failed login attempts for username or IP address
```

#### Solution: Docker Hub Authentication

To avoid rate limiting, add Docker Hub credentials to the workflows:

#### Step 1: Create Docker Hub Access Token

1. Go to Docker Hub: https://app.docker.com/settings/personal-access-tokens
2. Click **"Generate new token"**
3. Give it a name (e.g., `github-actions`)
4. Set permissions to **Read, Write, Delete**
5. Copy the token (displayed only once!)

#### Step 2: Add GitHub Secrets

1. Go to your GitHub repo settings: https://github.com/DARK-SHAD0W/MFP/settings/secrets/actions
2. Click **"New repository secret"**
3. Add secret #1:
   - **Name:** `DOCKERHUB_USERNAME`
   - **Value:** Your Docker Hub username
4. Add secret #2:
   - **Name:** `DOCKERHUB_TOKEN`
   - **Value:** Your Docker Hub access token

#### Step 3: Update Workflows

Both workflow files (`build.client.yml` and `build.serveur.yml`) include this step:

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

This step authenticates with Docker Hub BEFORE pulling base images, avoiding the rate limit.

#### Updated Build Pipeline Steps

1. Checkout code from repository
2. **Authenticate with Docker Hub** (avoids rate limiting)
3. Authenticate with GitHub Container Registry
4. **Read version number** from VERSION file
5. Extract and generate image metadata and tags
6. Build Docker image and push to GHCR
7. Generate security attestation

---

### Semantic Versioning

#### How It Works

The project uses a **VERSION** file at the root to manage semantic versioning:

```
VERSION file: 1.0.0
```

Each build automatically generates images with the following tags:
- `v1.0.0` (semantic version)
- `main-a1b2c3d` (commit SHA on main)
- `latest` (on main branch only)
- `dev` (on dev branch only)

#### Managing Versions

To bump the version:

1. Edit the `VERSION` file:
   ```bash
   # For patch release (bug fix)
   1.0.0 → 1.0.1

   # For minor release (new feature)
   1.0.0 → 1.1.0

   # For major release (breaking change)
   1.0.0 → 2.0.0
   ```

2. Commit the change:
   ```bash
   git add VERSION
   git commit -m "Bump version to 1.1.0"
   git push origin main
   ```

3. The workflow will automatically:
   - Build new images
   - Tag them with `v1.1.0`
   - Push to GHCR

#### Image Tags Example

For version `1.0.0`:
- `ghcr.io/owner/mfp/client:v1.0.0` ← Semantic version tag
- `ghcr.io/owner/mfp/client:main-a1b2c3d` ← Commit SHA
- `ghcr.io/owner/mfp/client:latest` ← Latest on main
- `ghcr.io/owner/mfp/client:main` ← Branch name

For dev branch with version `1.0.0`:
- `ghcr.io/owner/mfp/client:v1.0.0` ← Semantic version (shared)
- `ghcr.io/owner/mfp/client:dev-x9y8z7w` ← Dev commit SHA
- `ghcr.io/owner/mfp/client:dev` ← Dev branch tag