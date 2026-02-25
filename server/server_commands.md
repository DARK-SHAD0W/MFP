
# Quick commands — install, run, and Docker
## Local development

- Install dependencies (npm):

```bash
npm install
```

- Start in development (use ts-node + nodemon):

```bash
npx nodemon --exec ts-node src/index.ts
# or, if you prefer package script
npm run dev
```

- Yarn alternative:

```bash
yarn     # installs deps
yarn dev    # if `dev` script in package.json is present
```

Notes:
- The server is mounted under `/api` and listens on port `3000` by default (see `src/index.ts`).
- `npm run dev` in this project runs `nodemon src/index.ts`. 
- If `nodemon` doesn't run TypeScript directly, use the `npx nodemon --exec ts-node src/index.ts` form.
---

## Docker: build, run, inspect, and cleanup

Below are common Docker commands you can use to build an image for the server, run it, inspect containers/images, and clean up.

- Build an image from the current directory (tag it `mfp-server:local`):

```bash
docker build 
```
- List local images:

```bash
docker images
```
What it outputs:
- Columns: `REPOSITORY`, `TAG`, `IMAGE ID`, `CREATED`, `SIZE`. Look for `mfp-server` and the `local` tag.

- Run the image as a detached container, mapping port 3000:

```bash
docker run 
```

What it outputs:
- The container will run in the background. 
- Use `docker ps` to see it.

- Show running containers:

```bash
docker ps
```

What it outputs:
- Columns: `CONTAINER ID`, `IMAGE`, `COMMAND`, `CREATED`, `STATUS`, `PORTS`, `NAMES`.

- Show all containers (including stopped ones):

```bash
docker ps -a
```

- View logs (follow):

```bash
docker logs -f mfp-server
```

What it outputs:
- The container stdout/stderr stream. `-f` follows the logs.

- Stop a running container:

```bash
docker stop mfp-server
```

What it outputs:
- Returns the container name or id after requesting a graceful stop.

- Remove a container (stopped):

```bash
docker rm mfp-server
```

What it outputs:
- Returns the removed container name/id. If container is running, stop it first.

- Remove an image:

```bash
docker rmi mfp-server
```

What it outputs:
- Returns the image id(s) removed. If image is used by containers, you must remove containers first.

---

- Remove unused images, containers, networks, and build cache (be careful):

```bash
docker system prune -a
```

What it outputs:
- Prompts for confirmation and then frees disk space by removing unused images, containers and networks.

- List Docker images (again):

```bash
docker images
```

- List Docker volumes:

```bash
docker volume ls
```

- List Docker networks:

```bash
docker network ls
```

- Pull an image from Docker Hub:

```bash
docker pull node:18
```

What it outputs:
- Downloads image layers and prints progress for each layer. At the end you'll have `node:18` locally.

- Tag an image (create a new tag):

```bash
docker tag mfp-server:local myrepo/mfp-server:latest
```

What it outputs:
- No output on success; `docker images` will show the new tag.
---