const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    "A User"
    type User {
        _id: ID!
        "Unique username"
        username: String!
        name: String!
        email: String!
        token: String!
        posts: [Post]
        comments: [Comment]
        status: String
    }

    input UserInput {
        email: String!
        username: String!
        password: String!
        confirm: String!
    }

    type Post {
        _id: ID!
        title: String!
        description: String!
        image: String!
        author: User!
        comments: [Comment]
        updated_at: String!
        created_at: String!
    }

    input PostInput {
        title: String!
        description: String!
        image: String!
        author: ID!
    }

    type Comment {
        _id: ID!
        author: User!
        body: String!
        post: Post!
        updated_at: String!
        created_at: String!
    }

    input CommentInput {
        author: ID!
        post: ID!
        body: String!
    }

    "Root Queries"
    type RootQuery {
        "Basic Login"
        login(username: String!, password: String!): User

        "Get a Users Information"
        getUser(_id: ID!, token: String!): User

        "Verify a Token"
        verifyToken(token: String!): User
    }

    "Root Mutations"
    type RootMutation {
        "Create a User"
        createUser(userInput: UserInput): User

        "Create a Post"
        createPost(postInput: PostInput): Post

        "Create a Comment"
        createComment(commentInput: CommentInput): Comment
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
