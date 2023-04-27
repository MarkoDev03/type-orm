FROM node:16.10.0-alpine AS build

WORKDIR /app
COPY . ./
RUN npm ci && npm run build && npm prune --production


FROM node:16.10.0-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/resources /app/resources

EXPOSE 5000
CMD [ "node", "dist/index.js" ]