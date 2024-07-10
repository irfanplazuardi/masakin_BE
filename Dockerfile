
# Base stage
FROM node:22-alpine3.19 as base

WORKDIR /usr/src/app


# buil the environment stage, on this stage i omit the dev dependency
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# build nest api stage, on this stage we use all dependency to build the api
FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build



# on the final stage we use env from deps stage  and api from bild

FROM base as final

WORKDIR /usr/src/app
ENV NODE_ENV production
# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main"]







