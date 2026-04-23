FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY e2e-tests/package*.json ./e2e-tests/
RUN cd e2e-tests && npm ci --ignore-scripts

COPY e2e-tests/ ./e2e-tests/

WORKDIR /app/e2e-tests

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
