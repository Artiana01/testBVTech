FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app/e2e-tests

COPY e2e-tests/ .

RUN npm ci

ENV PORT=3000
EXPOSE 3000

CMD ["node", "test-runner-ui/server.js"]
