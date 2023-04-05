<h1 align="center">
    <br>
    <a href="https://g-tasker.vercel.app"><img src="https://raw.githubusercontent.com/Fiona1121/g-tasker/master/src/assets/logo.png" alt="G-Tasker" width="200"></a>
    <br>
    G-Tasker
    <br>
</h1>

<h4 align="center">A simple task manager for GitHub issues.</h4>

<p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#how-to-use">How To Use</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#technologies-used">Technologies Used</a>
</p>

![screenshot](https://raw.githubusercontent.com/Fiona1121/g-tasker/master/src/assets/demo.gif)

## Key Features

-   Login with GitHub
-   Create, edit, delete issues
-   Change labels to issues
-   Search issues

## How To Use

### Live Demo

[https://g-tasker.vercel.app](https://g-tasker.vercel.app)

### Local Development

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Fiona1121/g-tasker.git

# Go into the repository
$ cd g-tasker

# Create a .env file in the root directory
$ touch .env

# Add the following to the .env file
# VITE_CLIENT_ID={ouath app client id}
# VITE_CLIENT_SECRET={ouath app client secret}
# VITE_REDIRECT_URI={ouath app redirect uri}

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

## Project Structure

```bash
├── public
├── src
│   ├── api/                // GitHub API calls
│   ├── assets/             // Images, icons, etc.
│   ├── components/         // Reusable components
│   ├── containers/         // Page components
│   ├── store/              // Context API
│   ├── styles/             // Global styles
│   ├── themes/             // MUI theme
│   ├── App.tsx
│   └── main.tsx
└── .env                    // Environment variables
```

## Technologies Used

-   [React](https://reactjs.org/)
-   [React Router](https://reactrouter.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Material-UI](https://material-ui.com/)
