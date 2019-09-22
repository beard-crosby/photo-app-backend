# Photo App Backend

---

## Endpoints

```
https://photo-app-backend.samuelbeard.now.sh


/status -- Get the status of the API.

/graphql -- Everything else.

```

---

## GraphQL Schema

### User
- _id: ID!
- username: String!
- name: String!
- email: String!
- password: String!
- posts: [Post!]!
- comments: [Comment!]!
- followers: [User!]!
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
- created_at: Date!
- updated_at: Date!
- deleted_at: Date!

### Comment
- _id: ID!
- author: User!
- body: String!
- created_at: Date!
- updated_at: Date!
- deleted_at: Date!
