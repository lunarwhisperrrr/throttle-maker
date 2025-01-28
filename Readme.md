# Throttle Maker in TypeScript with Express.js

## Overview

This repository contains a simple implementation of a throttler (rate limiter) built using TypeScript and Express.js. The throttler is designed to manage the rate of incoming requests to HTTP endpoints, ensuring they adhere to predefined limits. This project serves as a proof of concept for testing throttling mechanisms in a Node.js environment without blocking the event loop.

## Features

- Rate Limiting: Control the maximum number of requests that can be processed over a specified time interval.
- Queue Management: Incoming requests are queued and processed as capacity allows, avoiding overload and ensuring smooth operation.
- Asynchronous Handling: Utilizes asynchronous techniques for non-blocking request processing.
- Customizable Limits: Easily adjust the number of allowed requests and the time window for throttling.

## Tech Stack

- TypeScript: For type safety and improved developer experience.
- Express.js: Web framework for building APIs.
- Node.js: JavaScript runtime for executing server-side code.

## Getting Started

To run this project, follow these steps:

Clone the Repository

```bash
git clone https://github.com/yourusername/throttle-maker.git
cd throttle-maker
Install Dependencies
```

```bash
npm install
Run the Application
```

```bash
npm start
```

## Test the Endpoints

You can test the throttled endpoints using a tool like Postman or curl.

Example Requests:

To trigger the process1 endpoint:

```bash
curl -X POST http://localhost:3000/process1
```

To trigger the process2 endpoint:

```bash
curl -X POST http://localhost:3000/process2
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
