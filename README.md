# TIN_05

A web application built with **Node.js**, **Express.js** and vanilla JavaScript that demonstrates asynchronous client-server communication using the Fetch API.

The project includes a contact form with both client-side and server-side validation, a REST-style API, request logging and dynamically refreshed server statistics.

## Features

* Node.js and Express.js backend
* Static frontend served by Express
* Asynchronous communication using the Fetch API
* Contact form submitted without reloading the page
* Client-side form validation
* Server-side form validation
* JSON API responses
* Dynamic success and error messages
* Live server statistics refreshed every 5 seconds
* HTTP request logging middleware
* Responsive user interface
* Development mode with Nodemon

## Technologies

* Node.js
* Express.js 5
* JavaScript (ES6+)
* HTML5
* CSS3
* Fetch API
* REST API
* npm
* Nodemon

## Project Structure

```text
TIN_05/
└── src/
    ├── public/
    │   ├── index.html
    │   ├── contact.html
    │   ├── contact.js
    │   ├── stats.js
    │   └── style.css
    ├── app.js
    ├── package.json
    └── package-lock.json
```

## Application Overview

The application consists of two main views.

### Dashboard

The main page displays live data retrieved asynchronously from the server.

The following information is updated every **5 seconds**:

* server generation time,
* randomly generated value,
* simulated delay value.

The data is retrieved from:

```text
GET /api/random-stats
```

The server responds with JSON:

```json
{
  "generatedAt": "2026-01-01T12:00:00.000Z",
  "value": 42,
  "simulatedDelayMs": 250
}
```

JavaScript uses the Fetch API to retrieve the data and update the page dynamically without requiring a reload.

## Contact Form

The application also contains an asynchronous contact form.

The user provides:

* name or nickname,
* e-mail address,
* age,
* message.

The form is submitted to:

```text
POST /api/contact
```

using the Fetch API.

The page does not reload when the form is submitted.

## Validation

Form data is validated both in the browser and on the server.

### Name / Nickname

The value must:

* contain between 3 and 16 characters,
* contain only letters, numbers, underscores and hyphens,
* not contain spaces.

Example:

```text
ShadowWolf
user_123
john-doe
```

### E-mail

The entered value must match a valid e-mail address format.

Example:

```text
user@example.com
```

### Age

The user must be at least **18 years old**.

The application also limits accepted age values to a realistic upper range.

### Message

The message must contain at least **10 characters**.

## API

### `POST /api/contact`

Validates contact form data and returns a JSON response.

Example request:

```text
name=ShadowWolf
email=user@example.com
age=21
message=Hello from the contact form!
```

Example successful response:

```json
{
  "ok": true,
  "data": {
    "name": "ShadowWolf",
    "email": "user@example.com",
    "age": 21,
    "isAdult": true,
    "messageLength": 28,
    "receivedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

When validation fails, the server returns HTTP status `400` together with a list of validation errors.

Example:

```json
{
  "ok": false,
  "errors": [
    "Podaj poprawny adres e-mail.",
    "Wiadomość musi mieć co najmniej 10 znaków."
  ]
}
```

### `GET /api/random-stats`

Returns dynamically generated server statistics.

The endpoint generates:

* current server timestamp,
* random number between 1 and 100,
* simulated delay value.

The frontend requests this endpoint automatically every 5 seconds.

## Request Logging

The Express application contains custom middleware that records information about incoming requests.

Each request is logged in the console together with:

* timestamp,
* HTTP method,
* requested URL.

Example:

```text
[2026-01-01T12:00:00.000Z] GET /api/random-stats
[2026-01-01T12:00:05.000Z] POST /api/contact
```

The request timestamp is also attached to the request object and used when generating contact form responses.

## Installation

Make sure **Node.js** and **npm** are installed.

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the application directory:

```bash
cd TIN_05/src
```

Install dependencies:

```bash
npm install
```

## Running the Application

Start the server with:

```bash
npm start
```

The application will be available at:

```text
http://localhost:7777
```

For development with automatic server restarting, use:

```bash
npm run dev
```

This command uses **Nodemon**.

## npm Scripts

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## Dependencies

### Production

* `express` – web application framework for Node.js

### Development

* `nodemon` – automatically restarts the server after source code changes

## Concepts Demonstrated

The project demonstrates several fundamental web development concepts:

* Express.js server configuration
* static file serving
* custom middleware
* GET and POST endpoints
* REST-style API communication
* JSON responses
* HTTP status codes
* asynchronous JavaScript
* Fetch API
* form handling
* client-side validation
* server-side validation
* DOM manipulation
* periodic asynchronous data fetching
* error handling
* npm dependency management

## Purpose

The project was created for educational purposes as part of the **TIN05** coursework.

Its main goal is to demonstrate asynchronous communication between a browser and a Node.js server while combining frontend JavaScript with backend validation and REST-style endpoints.

## License

This project is intended for educational purposes.
