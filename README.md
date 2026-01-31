# 🎀 Real-Time Team Productivity Dashboard
![Dockerized](https://img.shields.io/badge/dockerized-yes-blue)
![Live Demo](https://img.shields.io/badge/demo-vercel-green)
![Made with Love](https://img.shields.io/badge/made%20with-love-ff69b4)


Un dashboard de productividad en tiempo real construido con **React**, **Node.js**, **Express**, **MongoDB** y **Socket.IO**, diseñado para visualizar tareas, métricas y actividad del equipo de forma clara, rápida y agradable.  
Cute por fuera, profesional por dentro ✨.

El proyecto está completamente **dockerizado**, por lo que cualquier persona puede levantarlo con un solo comando.

---

##  Screenshots

### <img src="./productivity-dashboard-frontend/public/apple.png" width="22" /> Lista de tareas
![Task List](/screenshots/task-list.png)

### <img src="./productivity-dashboard-frontend/public/apple.png" width="22" /> Gráficos de productividad
![Productivity Charts](/screenshots/productivity-charts.png)

### <img src="./productivity-dashboard-frontend/public/apple.png" width="22" /> Añadir una tarea
![Add Task](/screenshots/add-task.png)

### <img src="./productivity-dashboard-frontend/public/apple.png" width="22" /> Docker Compose levantando servicios
![Docker Up](/screenshots/docker-up.png)
---

#  Arquitectura del proyecto
```
productivity-dashboard/
│
├── docker-compose.yml
│
├── productivity-dashboard-backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── seed.js
│   ├── sample_data.json
│   ├── package.json
│   └── .env
│
└── productivity-dashboard-frontend/
├── Dockerfile
├── public/
│   └── apple.png
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
└── package.json
```
---

# Características principales

- Visualización en tiempo real de tareas y métricas
- Actualización instantánea con Socket.IO
- Interfaz clara, rápida y agradable
- Dockerizado para levantar con un solo comando
- Seed de datos para pruebas inmediatas
- Frontend desplegado en Vercel como demo visual

---
# Tecnologías utilizadas

### **Frontend**

-  React
-  React Hooks
-  CSS
-  Socket.IO Client

### **Backend**

-  Node.js
-  Express
-  Socket.IO
-  Mongoose

### **Infraestructura**

-  Docker
-  Docker Compose
-  MongoDB local con volumen persistente

---

## Real‑Time con Socket.IO

El dashboard se actualiza automáticamente cuando:

- Se crea una tarea
- Se completa
- Se modifica

El backend emite eventos y el frontend los recibe al instante.  
Cada instancia Docker actúa como un teams independiente, ideal para demos y desarrollo local.

---

## Instalación con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/yiiingye/productivity-dashboard.git
cd productivity-dashboard
```

### 2.Levantar todo
```
docker-compose up --build
```
### 3. Acceder
Frontend: http://localhost:3000

Backend: http://localhost:5000

### 4. Poblar datos de ejemplo
```
docker exec -it backend npm run seed
```
---

## Seed de datos

El backend incluye un script que:

- Limpia la colección
- Inserta datos de ejemplo desde _sample_data.json_

## Dockerfiles

**Backend** — productivity-dashboard-backend/Dockerfile
```
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend** — productivity-dashboard-frontend/Dockerfile
```
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

```
## docker-compose.yml

```
services:
  mongo:
    image: mongo:6
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./productivity-dashboard-backend
    container_name: backend
    restart: always
    ports:
      - "5000:5000"
    env_file:
      - ./productivity-dashboard-backend/.env
    depends_on:
      - mongo

  frontend:
    build: ./productivity-dashboard-frontend
    container_name: frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo_data:

```
---
## Despliegue del frontend en Vercel

1. Subir el repo a GitHub
2. En Vercel → “New Project”
3. Seleccionar el repo
4. Elegir la carpeta: _productivity-dashboard-frontend_
5. Deploy automático
    - El backend se ejecuta localmente con Docker.
    - El despliegue en Vercel sirve como demo visual del frontend.
