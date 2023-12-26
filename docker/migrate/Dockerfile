FROM oven/bun:1 AS deps

WORKDIR /workspace

RUN bun install drizzle-orm

FROM oven/bun:1 AS builder

WORKDIR /workspace

COPY --from=deps /workspace/node_modules ./node_modules

COPY . .

CMD ["bun", "run", "drizzle:migrate"]