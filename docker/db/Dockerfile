FROM alpine:latest

ARG DATABASE_LOCATION

WORKDIR /workspace

RUN apk add --no-cache sqlite

RUN mkdir -p ${DATABASE_LOCATION}

ENTRYPOINT ["sqlite3"]
CMD ["uucoffeedb.db"]