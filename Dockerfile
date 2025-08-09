# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Instalar dependências necessárias para o build
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Remover dependência local problemática se existir
RUN npm uninstall projeto-bytebank-grupo-30 || true

# Debug: listar arquivos e scripts disponíveis
RUN ls -la && npm run

# Build da aplicação para produção
RUN npm run build:prod || npm run build

# Debug: verificar se o build foi criado
RUN ls -la dist/

# Stage de produção com nginx
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY --from=builder /app/dist/*/browser /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
