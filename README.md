# Photo App Backend

---

## Deployment :boom:

---

# Queries :question:

```
login( email: String!, password: String!") { # OR login( username: String!, password: String!)
  _id
  token
  tokenExpiry
  name
  username
  email
  bio
  profileImg
  posts {
    _id
    img
    title
    description
    comments {
      _id
      comment
      author {
        _id
      }
    }
  }
  following {
    _id
    name
    username
    email
    bio
    profileImg
    posts {
      _id
      img
      title
      description
      comments {
        _id
        comment
        author {
          _id
        }
      }
    }
  }
}
```

```
allUsers {
  _id
  name
  username
  email
  bio
  profileImg
  posts {
    _id
    img
    title
    description
    comments {
      _id
      comment
      author {
        _id
      }
    }
  }
  following {
    _id
    name
    username
    email
    bio
    profileImg
    posts {
      _id
      img
      title
      description
      comments {
        _id
        comment
        author {
          _id
        }
      }
    }
  }
}
```

```
user(_id: ID!) {
  _id
  name
  username
  email
  bio
  profileImg
  posts {
    _id
    img
    title
    description
    comments {
      _id
      comment
      author {
        _id
      }
    }
  }
  following {
    _id
    name
    username
    email
    bio
    profileImg
    posts {
      _id
      img
      title
      description
      comments {
        _id
        comment
        author {
          _id
        }
      }
    }
  }
}
```

```
allPosts {
  _id
  img
  title
  description
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
  comments {
    _id
    comment
    author {
      _id
      name
      username
      email
      bio
      profileImg
    }
  }
}
```

```
post(_id: ID) { # OR post(author: ID)
  _id
  img
  title
  description
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
  comments {
    _id
    comment
    author {
      _id
      name
      username
      email
      bio
      profileImg
    }
  }
}
```

```
allComments {
  _id
  post {
    _id
    img
    title
    description
  }
  comment
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
}
```

```
comment(_id: ID!) { # OR comment(post: ID!) # OR comment(author: ID!)
  _id
  post {
    _id
    img
    title
    description
  }
  comment
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
}
```
---

# Mutations :exclamation:

```
createUser(userInput: { name: String!, username: String!, email: String!, password: String!, passConfirm: String!, bio: String, profileImg: String }) {
  _id
  token
  tokenExpiry
  name
  username
  email
  bio  
  profileImg
  posts {
    _id
  }
  following {
    _id
  }
}
```

```
createPost(postInput: { img: String!, title: String!, description: String!, author: ID! }) {
  _id
  img
  title
  description
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
  comments {
    _id
  }
}
```

```
createComment(post: ID!, comment: String!, author: ID!) {
  _id
  post {
    _id
    img
    title
    description
  }
  comment
  author {
    _id
    name
    username
    email
    bio
    profileImg
  }
}
```
