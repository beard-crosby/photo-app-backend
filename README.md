# Photo App Backend

---

## Endpoints

Check out everything GraphQL at https://photo-app-backend.samuelbeard.now.sh/graphql

All queries and mutations can be explored in the Docs Explorer (Top Right of /graphql page)

```
/status -- 
GET - Get the status of the API.

/graphql --
POST - All graphQL queries.
GET - Access GraphiQL in the browser.
```

---

## GraphQL Models

### User
- _id: ID!
- username: String!
- name: String!
- email: String!
- password: String!
- posts: [Post!]!
- comments: [Comment!]!
- followers: [User!]!
- status: String | The status of the account. ['active', 'banned', etc]
- logged_in_at: Date! | This will be updated every time a user logs in.
- created_at: Date!
- updated_at Date!
- deleted_at Date!

### Post
- _id: ID!
- author: User!
- title: String
- description: String
- comments: [Comment!]!
- image: String!
- status: String | The status of the image. ['processing', 'removed', etc]
- created_at: Date!
- updated_at: Date!
- deleted_at: Date!

### Comment
- _id: ID!
- author: User!
- post: Post!
- body: String!
- created_at: Date!
- updated_at: Date!
- deleted_at: Date!

## GraphQL Schema

### UserInput | Used to create a new user.
- email
- username
- password
- confirm | Used to confirm the password. Can be confirmed on the frontend but still needs to be chaked on the backend.

---

## Deployment

Currently, the backend is deployed on Zeit Now. So assuming you are logged in to the correct account, run this command to deploy:

```sh
now -e JWT_SECRET=@jwt_secret -e DB_USERNAME=@db_username -e DB_PASSWORD=@db_password -e DB_HOST=@db_host

# OR

npm run deploy
```
