# 🌌 Kiruna Explorer

**Welcome to Kiruna Explorer**, a platform designed to showcase the documents and information related to the relocation of Kiruna. This project aims to be the official website proposal if Kiruna is chosen as the **European Capital of Culture**. 🌟

Developed by **Team 19** of the Politecnico di Torino, comprising **Diego**, **Francesco**, **Mariam**, **Mina**, **Paolo** and **Sergio**, Kiruna Explorer is a tribute to the resilience and innovation of this unique city.

---

## 🚀 About the Project

Kiruna Explorer is an interactive platform that tells the story of Kiruna's relocation—a monumental endeavor to preserve the city as it adapts to mining activities and evolving urban needs. The application features historical records, urban planning documents, and cultural highlights, offering an engaging way to explore Kiruna's past, present, and future.

Built with **modular web technologies**, the project ensures scalability and adaptability for future enhancements. It consists of **four independent servers**, each managing specific parts of the application.

---

## 🛠️ Deployment with Docker Compose

We’ve made deployment incredibly simple using a **Docker Compose file**. This file pulls four pre-built images from **DockerHub**—one for each server—and orchestrates them into a fully functional stack.

### 🔑 Key Features:

- **Pre-built Docker Images**: Each server is packaged as a separate Docker image, promoting modularity and maintainability.
- **Cross-Platform Compatibility**: The Docker images are pre-built to support both ARM and AMD architectures, ensuring compatibility across different platforms.
- **Quick Setup**: All you need is the `docker-compose.yml` file to get started—no additional cloning or setup required.
- **Accessible Locally**: Once the services are up and running, the application is accessible at **[localhost:5173](http://localhost:5173)**.

---

## 📦 How to Run Kiruna Explorer

1. **Install Docker & Docker Compose**:  
   Ensure you have Docker and Docker Compose installed on your system.  
   👉 [Install Docker](https://docs.docker.com/get-docker/)  
   👉 [Install Docker Compose](https://docs.docker.com/compose/install/)

2. **Download the `docker-compose.yml` File**:  
   Save the provided `docker-compose.yml` file to a directory on your machine.

3. **Run Docker Compose**:  
   Launch all services with a single command:
   ```bash
   docker-compose up
   ```
4. **Access the Application**:
   Open your browser and navigate to **[localhost:5173](http://localhost:5173)** to explore Kiruna.

---


## 👤 Adding New Users

To add new users, you can use the [create-user.sh](./create-user.sh) script. Follow these steps:

1. Give Execute Permissions:<br>
   First, give execute permissions to the script:
   ```bash
   chmod +x create-user.sh
   ```
2. Run the Script: <br>
   Execute the script to create a new user:
   ```bash
   ./create-user.sh
   ```
3. Follow the Instructions:<br>
   Follow the on-screen instructions to enter the user details and select a role.

<br>
By following these steps, you can create as many users as you need.

---

## 🧩 Project Architecture

🖥️ **Servers**:

- **Server**: Handles core application logic and API integrations.
- **Client**: Manages user interactions and UI components.
- **CDN**: Processes and serves static files for real-time updates.
- **Database (MongoDB)**: Oversees data storage.

By splitting the project into these dedicated services, we ensure a **scalable**, **maintainable**, and **efficient** system.

📂 **Docker Images**:

Each of the above servers has its own Docker image, hosted on **DockerHub**. The docker-compose.yml file references these images to simplify deployment.

---

## ✨ Team 19 Acknowledgments

A big thank you to the Politecnico di Torino for the opportunity to bring this project to life. 🌍

Created with ❤️ by **Diego**, **Francesco**, **Mariam**, **Mina**, **Paolo** and **Sergio**

**Team 19** - Politecnico di Torino<br>
SE2 2024/25

---

## 📫 Contact Us

Have feedback or questions? Reach out to us:

- [Diego](https://github.com/akhre)
- [Francesco](https://github.com/fra2404)
- [Mariam](https://github.com/mariamtelly)
- [Mina](https://github.com/minasamadi)
- [Paolo](https://github.com/Paolino01)
- [Sergio](https://github.com/SergioCic1)

Enjoy exploring Kiruna with **Kiruna Explorer**! 🌟
