# Image Labeller for Salesforce Einstein Object Detection

## Installation

** /!\ This is work in progress so access to this tool is not secured yet: only work on a local installation. /!\ **

This tool requires the following:
- NPM
- Node.js 8.7 or above
- a PostgreSQL database
- a [Cloudinary](https://cloudinary.com/) account


Follow these steps to install the tool:

1. Create a new PostgreSQL database and initialize it with the content of the `db_init.sql` file.

2. Create a `.env` file with the following content and place it at the root of the project directory:

```
HTTPS=false
SESSION_SECRET_KEY='7#$rVXdTD86p'
DATABASE_URL='postgres://img:img@localhost:5432/img'
```

3. Replace the values of these keys according to your settings:

| Property           | Description |
| ------------------ |-------------|
| HTTPS              | whether you use HTTPS to secure the connection to your server (generally `false` on a local setup) |
| SESSION_SECRET_KEY | a random string used to secure your server sessions |
| DATABASE_URL       | URL to your PostgreSQL database |

4. Run the NPM installation script: `npm install`

5. Run the program locally with either of these commands:
- `npm run build-n-start`
- `heroku local` (requires the Heroku CLI)
