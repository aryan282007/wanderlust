# Wanderlust

A full-stack Airbnb-style clone built with Node.js, Express, MongoDB, Passport authentication, and Cloudinary image uploads.

## Project Overview

Wanderlust is a rental listing application that allows users to create, view, edit, and delete property listings. It also supports user registration, login, review posting, and owner-based access control, making it a small-scale marketplace for booking rooms or homes.

## Live Demo

 **Visit the live application**: [https://wanderlust-ay.onrender.com](https://wanderlust-ay.onrender.com)

## Prerequisites

- **Node.js**: v22.20.0 or higher
- **MongoDB**: Running locally on default port (27017)
- **Cloudinary Account**: For image storage (optional for basic functionality)

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
- Session persistence with MongoDB store

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with passport-local-mongoose
- **Session Store**: connect-mongo for session persistence
- **Frontend**: EJS templating engine with ejs-mate
- **Image Upload**: Multer + Cloudinary
- **Validation**: Joi for request validation
- **Session Management**: express-session
- **Notifications**: connect-flash
- **HTTP Methods**: method-override for PUT/DELETE requests

## Project Structure

```
├── app.js                 # Main application entry point
├── cloudconfig.js         # Cloudinary storage configuration
├── middleware.js          # Authentication, authorization, and validation middleware
├── schema.js             # Joi validation schemas
├── package.json          # Project dependencies and scripts
├── controller/           # Route handlers and business logic
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── init/                 # Database initialization and seeding
│   ├── data.js          # Sample data for seeding
│   └── index.js         # Database initialization script
├── modals/              # Mongoose schemas/models
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/              # Static assets
│   ├── css/
│   │   ├── rating.css
│   │   └── style.css
│   └── js/
│       └── script.js
├── routes/              # Express route definitions
│   ├── listing.js       # Routes for listing management
│   ├── review.js        # Routes for review creation and deletion
│   └── user.js          # Routes for signup, login, and logout
├── utils/               # Utility functions
│   ├── asyncWrap.js     # Async error handling wrapper
│   └── ExpressError.js  # Custom error class
└── view/                # EJS templates and partials
    ├── include/         # Reusable template partials
    │   ├── flash.ejs
    │   ├── footer.ejs
    │   └── navbar.ejs
    └── listing/         # Listing-specific templates
        ├── edit.ejs
        ├── error.ejs
        ├── index.ejs
        ├── new.ejs
        ├── show.ejs
        └── layout/
            └── boilerplate.ejs
        └── user/         # User authentication templates
            ├── login.ejs
            └── signup.ejs
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/airbnb-project.git
   cd airbnb-project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root and add the required environment variables:

   ```env
   # Database Configuration
   ATLAS_URI=mongodb://127.0.0.1:27017/wanderlust

   # Cloudinary Configuration (for image uploads)
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret
   ```

4. **Set up MongoDB:**

   Ensure MongoDB is running locally on the default port (27017). The app connects to:
   ```
   mongodb://127.0.0.1:27017/wanderlust
   ```

5. **Seed the database (optional):**

   To populate the database with sample listings, run:

   ```bash
   node init/index.js
   ```

6. **Start the application:**

   ```bash
   node app.js
   ```

7. **Open the app in your browser:**

   ```
   http://localhost:8080
   ```

## Usage

- **Sign up**: Visit `/signup` to create a new account
- **Log in**: Visit `/login` to sign in to your account
- **Browse listings**: View all listings on the homepage at `/listings`
- **Create listing**: Add a new listing at `/listings/new` (requires authentication)
- **View details**: Click on any listing to view details at `/listings/:id`
- **Add reviews**: Leave reviews on listing detail pages (requires authentication)
- **Edit/Delete**: Edit or delete your own listings and reviews

## API Endpoints

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Show new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Show signup form
- `POST /signup` - Create new user
- `GET /login` - Show login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## Scripts

- `npm test` - Run tests (currently just echoes an error message)

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `ATLAS_URI` | MongoDB connection string | Yes |
| `CLOUD_NAME` | Cloudinary cloud name | No (for image uploads) |
| `CLOUDINARY_KEY` | Cloudinary API key | No (for image uploads) |
| `CLOUDINARY_SECRET` | Cloudinary API secret | No (for image uploads) |

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check that the connection string in `.env` is correct
   - Verify MongoDB is running on port 27017

2. **Session Store Error**
   - Ensure `ATLAS_URI` is set in your `.env` file
   - Check that MongoDB is accessible

3. **Image Upload Issues**
   - Verify Cloudinary credentials in `.env`
   - Check internet connection for image uploads

4. **Port Already in Use**
   - Kill any process using port 8080
   - Or modify the port in `app.js`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Notes

- The app uses local MongoDB by default
- Images are stored remotely via Cloudinary
- The app runs on port `8080`
- Session cookies expire after 7 days
- Sessions are persisted in MongoDB using connect-mongo
- There is no automated test suite included at this time
- Database seeding script assigns all sample listings to a default owner ID

## Author

Aryan Yadav

## License

ISC
