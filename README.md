# Photo App Backend

---

## Endpoints

```
https://photo-app-backend.samuelbeard.now.sh


/status -- Get the status of the API.

/graphql -- Everything else.

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
