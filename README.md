# Tourism API

This API performs basic CRUD operation of a tourism web application where users get to choose a tour plan or category they are interested in and also create reviews regarding this tour plan.

This API also implements **Authentication**, **Authorization** of users.

## Installation

Clone this repository

```bash
  git clone https://github.com/mediat-100/tourism-api
```

Move into the project directory and install its dependencies

```bash
  npm install
```

## Setting up config

Create a `.env` file and copy the contents of `.env.example` into it;

- **NODE_ENV** : Set it to `development` or `production`.
- **PORT** : This is optional or you can set it to `3000`.
- **MONGO_URI** : Set it to your local mongoDB URL which should look like this; `mongodb://localhost:27017/**Database_name**`
- **JWT_SECRET** : This could be anything e.g `tourismWebApp`
- **JWT_EXPIRES_IN** : This signifies when the json web token expires, it should be in this form `30d`, which implies the token expires in 30days.
- **JWT_COOKIE_EXPIRES_IN** : This signifies when the cookie expires e.g `30` i.e the cookie expires in 30 days.

## Run Locally

1. Start up the server - Run `npm start` **or** `npm run start:prod`(for production)
2. Server should be running on http://localhost:8000/ by default

## Routes

| Routes                                    | Description                  | Auth roles         |
| ----------------------------------------- | ---------------------------- | ------------------ |
| [POST] /api/v1/auth/sign-up               | Create a new user            | none               |
| [POST] /api/v1/auth/login                 | Login a user                 | none               |
| [POST] /api/v1/auth/forgot-password       | Sends a password reset email | none               |
| [POST] /api/v1/auth/reset-password/:token | Reset password form handler  | none               |
| [POST] /api/v1/auth/update-password       | Update a user password       | user               |
| [GET] /api/v1/users/profile               | Get a user's profile         | user               |
| [PUT] /api/v1/users/edit-profile          | Update a user's profile      | user               |
| [DELETE] /api/v1/users/delete-profile     | Delete a user's profile      | user               |
| [GET] /api/v1/users/                      | Get all users                | admin              |
| [GET] /api/v1/users/:id                   | Get a user by Id             | admin              |
| [PUT] /api/v1/users/:id                   | Update a user's account      | admin              |
| [DELETE] /api/v1/users/:id                | Delete a user's account      | admin              |
| [GET] /api/v1/tours/                      | Get all tours                | none               |
| [GET] /api/v1/tours/:id                   | Get a tour By Id             | none               |
| [POST] /api/v1/tours                      | Create a tour                | admin & lead-guide |
| [PUT] /api/v1/tours/:id                   | Update a tour                | admin & lead-guide |
| [DELETE] /api/v1/tours/:id                | Delete a tour                | admin & lead-guide |
| [POST] /api/v1/tours/:tourId/reviews      | Create a review on a tour    | user               |
| [GET] /api/v1/reviews/:id                 | Get a review                 | user               |
| [PUT] /api/v1/reviews/:id                 | Update a review              | user & admin       |
| [DELETE] /api/v1/reviews/:id              | Delete a review              | user & admin       |

**N.B**: `user` in the auth roles above refers to all types of users be it admin, lead-guide and guide.