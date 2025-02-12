FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["bun", "start"] 