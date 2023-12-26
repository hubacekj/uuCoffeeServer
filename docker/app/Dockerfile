FROM oven/bun:1

WORKDIR /workspace

COPY package.json bun.lockb ./

RUN bun install --production --frozen-lockfile

COPY . .

ENTRYPOINT ["bun", "run", "prod"]