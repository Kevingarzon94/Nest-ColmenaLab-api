# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar los archivos de dependencias
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias (usando cache eficiente)
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación NestJS
RUN pnpm run build


# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar los archivos de dependencias
COPY pnpm-lock.yaml package.json ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar el build desde el primer stage
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Ejecutar como usuario no root
USER node

# Comando de inicio
CMD ["node", "dist/main"]