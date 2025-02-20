# 🚀 Node.js Server with Docker

This project runs a **Node.js server** inside a Docker container. Follow the steps below to get the server running locally.

---

## 📥 Clone the Repository

First, clone this GitHub repository:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
```

Move into the project directory:

```sh
cd YOUR_REPOSITORY_NAME
```

---

## 🐳 Install Docker (Windows Only)

If you're on **Windows**, you need to install **Docker Desktop**:

1. Download Docker Desktop from [Docker's official site](https://www.docker.com/products/docker-desktop/).
2. Follow the installation instructions and ensure Docker is running.
3. Enable **WSL 2 backend** from Docker Desktop settings.

---

## 🔧 Build the Docker Image

Once Docker is installed and running, build the Docker image using the following command:

```sh
docker build -t my-node-server .
```

---

## ▶️ Run the Docker Container

After building the image, start your Node.js server:

```sh
docker run -p 3000:3000 my-node-server
```

- This command maps port **3000** inside the container to port **3000** on your local machine.

---

## 🌐 Accessing the Server

Once the container is running, open your browser and navigate to:

```
http://localhost:3000/
```

Or use **curl** to test the server:

```sh
curl http://localhost:3000/
```

---

## 🛑 Stopping and Removing the Container

To stop the running container:

```sh
docker ps  # Get the container ID
docker stop CONTAINER_ID
```

To remove the container:

```sh
docker rm CONTAINER_ID
```

---

## 🧹 Clean Up Docker Images (Optional)

To remove the Docker image:

```sh
docker rmi my-node-server
```

---

## 🔍 Verify Running Containers

To check if your container is running:

```sh
docker ps
```

---

## 👨‍💻 Author

- **Ankush Choudhary** - [GitHub](https://github.com/ankush-anonymous)

