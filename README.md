# 🎀 Real-Time Team Productivity Dashboard
[![Dockerized](https://img.shields.io/badge/dockerized-yes-blue)](https://www.docker.com/)
[![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20Socket.IO-1f6feb)](#stack)

Aplicación full-stack para gestión de tareas y métricas de equipo en tiempo real.  
Incluye frontend, backend y base de datos, con despliegue local vía Docker Compose.

## 🧰 Stack

- Frontend: React, Socket.IO Client
- Backend: Node.js, Express, Socket.IO, Mongoose
- Infraestructura: MongoDB, Docker, Docker Compose

## ✨ Funcionalidades

- Lista de tareas con operaciones CRUD
- Métricas y gráficos de productividad
- Actualización en tiempo real con eventos Socket.IO
- Seed de datos de ejemplo para pruebas rápidas

## 🏗️ Estructura

```text
productivity-dashboard/
├── docker-compose.yml
├── productivity-dashboard-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── sample_data.json
└── productivity-dashboard-frontend/
    ├── src/
    └── public/
```

## 🚀 Ejecución rápida

```bash
git clone https://github.com/yiiingye/productivity-dashboard.git
cd productivity-dashboard
docker compose up --build
```

Servicios:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Seed de datos:
```bash
docker exec -it backend npm run seed
```

## 📸 Capturas

- Lista de tareas: `/screenshots/task-list.png`
- Gráficos: `/screenshots/productivity-charts.png`
- Añadir tarea: `/screenshots/add-task.png`
- Docker Compose: `/screenshots/docker-up.png`
