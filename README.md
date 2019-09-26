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

## Deployment

Currently, the backend is deployed on Zeit Now. So assuming you are logged in to the correct account, run this command to deploy:

```sh
now -e JWT_SECRET=@jwt_secret -e DB_USERNAME=@db_username -e DB_PASSWORD=@db_password -e DB_HOST=@db_host

# OR

npm run deploy
```
