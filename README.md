# Wanderlust

A full-stack Airbnb-style clone built with Node.js, Express, MongoDB, Passport authentication, and Cloudinary image uploads.

## Project Overview

Wanderlust is a rental listing application that allows users to create, view, edit, and delete property listings. It also supports user registration, login, review posting, and owner-based access control, making it a small-scale marketplace for booking rooms or homes.

## Key Features

- User registration and login using Passport.js
- Protected routes for authenticated users
- Create, view, edit, and delete listings
- Upload listing images using Cloudinary
- Add and remove reviews for listings
- Authorization checks for listing and review ownership
- Form validation with Joi
- Flash messages for success/error notifications
- EJS templating with `ejs-mate` for layouts

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Passport.js and passport-local-mongoose
- EJS and ejs-mate
- Multer + Cloudinary for image uploads
- Joi for request validation
- connect-flash for user notifications
- method-override for PUT/DELETE requests

## Project Structure

- `app.js` - Main application entry point
- `routes/` - Express route definitions
  - `listing.js` - Routes for listing management
  - `review.js` - Routes for review creation and deletion
  - `user.js` - Routes for signup, login, and logout
- `controller/` - Route handlers and business logic
  - `listing.js`
  - `reviews.js`
  - `user.js`
- `modals/` - Mongoose schemas/models
  - `listing.js`
  - `review.js`
  - `user.js`
- `schema.js` - Joi validation schemas
- `middleware.js` - Authentication, authorization, and validation middleware
- `cloudconfig.js` - Cloudinary storage configuration
- `view/` - EJS templates and partials
- `public/` - Static assets (CSS, client-side JS)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/airbnb-project.git
   cd airbnb-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the required environment variables:

   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret
   ```

4. Start MongoDB locally and ensure the app can connect to:

   ```text
   mongodb://127.0.0.1:27017/wanderlust
   ```

5. Start the application:

   ```bash
   node app.js
   ```

6. Open the app in your browser:

   ```text
   http://localhost:8080
   ```

## Usage

- Visit `/signup` to create a new account
- Visit `/login` to sign in
- Browse listings on the homepage at `/listings`
- Create a new listing at `/listings/new`
- View listing details at `/listings/:id`
- Add a review on the listing detail page
- Edit or delete listings if you are the owner

## Notes

- The app uses local MongoDB by default.
- Images are stored remotely via Cloudinary.
- The app runs on port `8080`.
- There is no automated test suite included at this time.

## Author

Aryan Yadav 

## License

ISC
