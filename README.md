# 🧾 Sistema de Ventas

Aplicación web utilizada por negocios locales para administrar productos, ventas, caja y clientes. Incluye módulos de usuarios y roles, productos y categorías, registro y seguimiento de ventas con múltiples opciones de productos, caja para gestionar ingresos y egresos, y cocina para organizar los pedidos según su estado. También ofrece reportes en tiempo real que facilitan la administración diaria del negocio.

---

## 🚀 Tecnologías utilizadas

### 🔹 Frontend
- Angular  
- Bootstrap  
- HTML / CSS  
- TypeScript  

### 🔹 Backend
- Node.js  
- Express.js  
- PostgreSQL  
- Sequelize (ORM)  

---

## ⚙️ Funcionalidades principales

- Gestión de usuarios y roles con permisos personalizados  
- Administración de productos 
- Registro de ventas y seguimiento de pedidos  
- Control de caja con ingresos, egresos y cierre diario   
- Cocina: organización y preparación de pedidos según su estado  

---

## 🧩 Estructura del proyecto

```bash
Sales-Management-System/
│
├── backend/ # API REST construida con Node.js y Express
│ ├── src/
│ │ ├── controllers/ # Controladores para cada módulo
│ │ ├── models/ # Modelos de Sequelize (tablas)
│ │ ├── routes/ # Rutas API
│ │ ├── database/ # Conexión a PostgreSQL
│ │ └── app.js # Configuración principal del servidor
│ └── package.json
│
├── frontend/ # Aplicación Angular
│ ├── src/
│ │ ├── app/ # Componentes, servicios y módulos
│ │ ├── assets/ # Recursos estáticos
│ │ └── environments/ # Configuraciones del entorno
│ └── package.json
│
└── README.md
```
## 🗄️ Configuración de la Base de Datos (PostgreSQL)
Este proyecto incluye un **backup completo de la base de datos** con las tablas y un usuario administrador ya configurado.

#### 1. Instalar PostgreSQL v7.2 en adelante (si aún no está instalado).
#### 2. Crear la base de datos (si aún no existe):
   ```sql
   CREATE DATABASE sistema_ventas;
  ```
#### 3. Importar el backup incluido en la carpeta "database": 
   ```sql
psql -U postgres -d Proyecto_Restaurante -f ./backend/database/sistema_ventas_backup.sql
  ```
## 🧰 Instalación y ejecución del proyecto
#### 1. Clonar el repositorio
```bash
git clone https://github.com/JordanArias/Sales-Management-System.git
```
#### 2. Instalar dependencias del backend
```bash
cd backend
npm install

```
#### 3. Configurar la conexión a la base de datos
En el archivo src/database/config.js (o .env, si usas uno), ajusta tus credenciales de PostgreSQL.

#### 4. Ejecutar el servidor backend
```bash
npm start
```
El servidor se iniciará en:
```bash
http://localhost:3800
```
#### 5. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```
#### 6. Ejecutar la aplicación Angular
```bash
ng serve
```
Abrir en el navegador:
```bash
http://localhost:4200
```
---

## 🖥️ Demo
🔗 [Ver Demo](https://youtu.be/VcgF9fBmzpk)

---

## 👨‍💻 Autor
**Fabrizio Jordan Arias Marca**  
📧 ariasjordan943@gmail.com  
🌐 [jordandeveloper.netlify.app](https://jordandeveloper.netlify.app)
