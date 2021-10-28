
# Blog Sharing Website (SPM Group-32)

This is project created as a part of IT414 Software Project Management course project. 
It is a website on which users can share their thoughts and ideas as blog posts, they can comment on existing blogs, up-vote and down-vote blogs depending on their liking, follow their favorite authors and many more functioanilities are there.

## Demo

Backend: https://spm-group32-bsw.herokuapp.com/

## Deployment

### Frontend:
To deploy this project run

```bash
  npm run deploy
```

### Backend:

```bash
git add .
git commit -m "<YOUR_COMMIT_MSG>"
git push heroku <YOUR_BRANCH>
```


## API Reference

| HTTP Method | Path                                | Remarks                                           | Login required? |
| ----------- | ----------------------------------- | ------------------------------------------------- | --------------- |
| GET         | /api                                | Base page of website-show published blogs         | No              |
| POST        | /api/register                       | Submission of sign-up form                        | No              |
| POST        | /api/logout                         | Logout                                            | Yes             |
| POST        | /api/login                          | Submission of login form                          | No              |
| GET         | /api/posts                          | Redirect to base page                             | No              |
| GET         | /api/posts/:postId                  | See blog with postId and comments by users on it  | No              |
| POST        | /api/posts/:postId/comments         | Post comment on the blog with postId              | Yes             |
| GET         | /api/posts                          | Show published as well as unpublished blogs       | Yes             |


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ACCESS_TOKEN_SECRET`

`DBURI`

`ADMIN_KEY`


## Run Locally

Clone the project

```bash
  git clone https://github.com/Harsh-Modi278/spm-group32-blog-sharing-website.git
```

Go to the project directory

```bash
  cd spm-group32-blog-sharing-website
```

Install dependencies for both client and server

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Start the client

```bash
npm start
```


## Tech Stack

**Client:** React, HTML5, CSS3

**Server:** Node, Express, MongoDB

