# Welcome to Lovable project
This Project Manage By Lovable and Mochamad Abdul Rouf\

<p align="left">
  <img src="https://skillicons.dev/icons?i=vite" alt="Vite" />
  <img src="https://skillicons.dev/icons?i=react" alt="React" />
  <img src="https://skillicons.dev/icons?i=typescript" alt="TypeScript" />
  <img src="https://skillicons.dev/icons?i=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat&logoColor=white&labelColor=000000&color=000000&message=" alt="shadcn-ui" />
  <img src="https://skillicons.dev/icons?i=supabase" alt="Supabase" />
  <img src="https://skillicons.dev/icons?i=docker" alt="Docker" />
  <img src="https://skillicons.dev/icons?i=kubernetes" alt="Kubernetes" />
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

