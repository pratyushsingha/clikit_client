# clikit-short urls in seconds

This is a URL shortener utility. It provides user authentication, URL analytics, and custom domain integration. The application operates on a freemium model.

## Features

- **User Authentication**: Secure user registration and login.
- **URL Shortening**: Shorten long URLs for easier sharing.
- **URL Analytics**: Track usage statistics of shortened URLs.
- **Custom Domain Integration**: Add custom domains for shortened URLs.
- **Freemium Model**: Free users can add one custom domain; premium users can add multiple.

## Environment Variables

Before running the application, rename the `.env.example` file to `.env` and fill all the environment variables.



## Run Locally

Clone the project

```bash
  git clone https://github.com/pratyushsingha/clikit_client
```

Go to the project directory

```bash
  cd clikit_client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
the client should be accessable at `http://localhost:5173`.

or

## Using Docker

Clone the project

```bash
  git clone https://github.com/pratyushsingha/clikit_client
```

Go to the project directory

```bash
  cd clikit_client
```

Build the docker image

```bash
  docker build -t clikit_client .
```

Start the server

```bash
  docker run -p 5173:5173 clikit_client
```
## server
For setting up the django backend server of this project, navigate to https://github.com/pratyushsingha/clikit_server & follow the Setup Instructions.

