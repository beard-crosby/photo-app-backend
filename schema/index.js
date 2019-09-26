const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    "A User"
    type User {
        _id: ID!

        "Unique username"
        username: String!

        "A users full name. This is optional."
        name: String

        email: String!

        "Current JWT"
        token: String!

        "An array of posts by the user. Corresponds to 'author' in the Post model."
        posts: [Post]

        "Array of the users this user is following."
        following: [User]

        "Comments made by the user. Corresponds to 'author' in the Comment model."
        comments: [Comment]

        "Status of the users account. [active, banned, etc]. Always lowercase."
        status: String
    }

    "User Input - To create a new user."
    input UserInput {
        "Unique email address."
        email: String!

        "Unique username"
        username: String!

        "Password currently has no standards on the backend. For testing, I would suggest 'Password123' for now."
        password: String!

        "Must match the password field."
        confirm: String!
    }

    "A Post"
    type Post {
        _id: ID!

        "The title of a post is optional. Sometimes people don't title every image."
        title: String

        "Description is also optional."
        description: String

        "Will return a URL of the location of the main image. This is the large version of the image so don't call this for thumbnails."
        image: String

        "Will return a URL of the location of the thumbnail image. This is a small image."
        thumbnail: String

        "Author of the post. Corresponds to 'posts' in the User model."
        author: User!

        "Comments on this post. Corresponds to 'post' in the Comment model."
        comments: [Comment]

        "The date the post was uploaded."
        created_at: String!
    }

    "Post Input - To create a new post"
    input PostInput {
        "Will return null if there is no title"
        title: String

        "Will return null if there is no description"
        description: String

        "For now, we will use base64 to upload the image in JSON. This might change if we find a better way."
        image: String!

        "ID of the author of the post."
        author: ID!
    }

    "A Comment"
    type Comment {
        _id: ID!

        "Author. Corresponds to the 'comments' in the User model."
        author: User!

        "The actual text of the comment."
        body: String!

        "The post this comment is attached to. Corresponds to 'comments' in the Post model."
        post: Post!

        "Date the comment was posted"
        created_at: String!
    }

    "Comment Input - To create a new comment"
    input CommentInput {
        "ID of the current user"
        author: String!

        "ID of the current post"
        post: String!

        "Text of the comment"
        body: String!
    }

    "Root Queries"
    type RootQuery {
        "Basic Login"
        login(username: String!, password: String!): User

        "Get a Users Information"
        getUser(_id: ID!, token: String!): User

        "Get a users posts"
        getPosts(author: ID!): [Post]

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
