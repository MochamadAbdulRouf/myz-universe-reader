# Welcome to Lovable project
This Project Manage By Lovable and Mochamad Abdul Rouf\

<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn-ui" />
  </a>
  <a href="https://supabase.com" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://www.docker.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </a>
  <a href="https://kubernetes.io" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  </a>
</p>

## How can I edit this code?

There are several ways of editing your application.


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Backend/Database: Supabase (dikelola melalui layanan eksternal Lovable Cloud)
- Containerization: Docker
- Orchestration: Kubernetes

## How To Containerization this Application

1. Create Dockerfile After following the steps above
```bash
vi Dockerfile
```

2. Copy code Dockerfile
```bash
FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
```

3. Build the Image
```bash
docker build -t yourname/nameyourapp:tag .
```

4. Need Spesifik File?
```bash
docker build -f Dockerfile -t yourname/nameyourapp:tag ./folder
```

5. Run your Container
```bash
docker run -d -p 8080:8080 --name name-container yourname/nameyourapp:tag
```

## OR YOU CAN USE MY IMAGE NOW!!!

1. Pull my image
```bash
docker pull mochabdulrouf/react-comic-app:2.0-development
```

2. Run the container 
```bash
docker run -d -p 8080:8080 --name name-container mochabdulrouf/react-comic-app:2.0-development
```

### Visit the Production Version for my Kubernetes Project
https://github.com/MochamadAbdulRouf/myz-universe-reader/tree/main/Production 

EST. 2025 

