# Photo App Backend

---

## Deployment :boom:

---

# Queries :question:

```
login( email: String!, password: String!) { # OR login( username: String!, password: String!)
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
      }
    }
  }
}
```

```
users {
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
      }
    }
  }
}
```

```
posts {
  _id
  img
  title
  description
  author
  comments {
    _id
    comment
  }
}
```

```
post(_id: ID) { # OR post(author: ID)
    _id
    img
    title
    description
    author
    comments {
      _id
      comment
    }
  }
```

---

# Mutations :exclamation:

```
createUser(userInput: { name: String!, username: String!, email: String!, password: String!, passConfirm: String! }) {
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
      }
    }
  }
}
```

```
createPost(postInput: { img: String!, title: String!, description: String!, author: ID! }) {
  _id
  img
  title
  description
  author
  comments {
    _id
    comment
  }
}
```
