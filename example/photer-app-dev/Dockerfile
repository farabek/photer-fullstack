#Устанавливаем зависимости
FROM node:23-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm@latest-10 && pnpm install

#Билдим приложение
#Кэширование зависимостей — если файлы в проекте изменились,
#но package.json остался неизменным, то стейдж с установкой зависимостей повторно не выполняется, что экономит время.
FROM node:23-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm install -g pnpm@latest-10 && pnpm run build:production

#Стейдж запуска
FROM node:23-alpine as runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/ ./
EXPOSE 3000
RUN npm install -g pnpm@latest-10
CMD ["pnpm", "start"]
