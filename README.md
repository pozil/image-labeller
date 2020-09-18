<img src="public/gfx/logo-rect.png" alt="Logo" width="300" align="right"/>

# Image Labeller for Salesforce Einstein Object Detection
This tool allows to label images in order to train a [Salesforce Einstein Object Detection](https://metamind.readme.io/docs/od_qs_scenario) model.

**Features:**
- Easy online installation via Heroku, local installation is also possible
- Exports a zip file compatible with Salesforce Einstein Object Detection
- Images hosted on Cloudinary
- Responsive app build with Salesforce Lightning Design System
- Proven to work on a [project](http://pozil.github.io/#/post/2018-05-22) with 500 images and 700 tags

This tool is provided “as is“ without any warranty or support. Salesforce does not officially endorse it.

<table border="0">
  <tr>
    <td><img src="screenshots/editor.png" alt="Editor screenshot" width="300"/></td>
    <td><img src="screenshots/images.png" alt="Images screenshot" width="300"/></td>
  <tr>
  <tr>
    <td><img src="screenshots/labels.png" alt="Labels screenshot" width="300"/></td>
    <td><img src="screenshots/export.png" alt="Export screenshot" width="300"/></td>
  <tr>
</table>


## Installation

### Heroku deploy (recommended)
Click on this button and follow the instructions to deploy the app:

<p align="center">
  <a href="https://heroku.com/deploy">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
<p>

<p align="center">
  <img src="screenshots/setup.png" alt="Setup screenshot" width="400"/>
</p>

### Local installation

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
| HTTPS              | Whether you use HTTPS to secure the connection to your server (generally `false` on a local setup) |
| SESSION_SECRET_KEY | A random string used to secure your server sessions |
| DATABASE_URL       | URL to your PostgreSQL database |

4. Run the NPM installation script: `npm install`

5. Run the program locally with either of these commands:
- `npm run build-n-start`
- `heroku local` (requires the Heroku CLI)
