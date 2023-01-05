
# Backend End Assignment

api route: https://assignment-ti7v.onrender.com

## API Reference
### Post routes
#### Get all posts

```http
  GET /https://assignment-ti7v.onrender.com/posts
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|           |          | Gives back app post in database |

#### Create Post 

```http
  POST /https://assignment-ti7v.onrender.com/posts
```
Parameter
 
* jwt token in **req.headers.authorization**
* json data in formate of

```json

{
    "creatorName": "userName",
    "postData": "DummyData"
}

```
Response
```json
{
    "creatorName": "UserName",
    "postData": "DummyData",
    "creatorId": "xxxxxxxxxxxxxxx",
    "_id": "xxxxxxxxxxxxxxxxx",
}

```


#### Update Post 

```http
  PATCH /https://assignment-ti7v.onrender.com/posts/:id
```
Parameter
* post id should be add in **req.params**
* jwt token in **req.headers.authorization**
* json data in formate of

```json

{
    "postData": "UpdatedData"
}

```
Response
```json
{
    "creatorName": "UserName",
    "postData": "UpdatedData",
    "creatorId": "xxxxxxxxxxxxxxx",
    "_id": "xxxxxxxxxxxxxxxxx",
}

```


#### Delete Post 

```http
  DELETE /https://assignment-ti7v.onrender.com/posts/:id
```
Parameter
* post id should be add in **req.params**
* jwt token in **req.headers.authorization**

Response(Deleted post data)
```json
{
    "creatorName": "UserName",
    "postData": "DummyData",
    "creatorId": "xxxxxxxxxxxxxxx",
    "_id": "xxxxxxxxxxxxxxxxx",
}

```

### UserRoutes


#### User Signup 

```http
  POST /https://assignment-ti7v.onrender.com/user/signUp
```
Parameter

```json


{
    "userName": "UserName",
    "email": "szqajkdjakmgzxbcgn@tmmbt.net",
    "password": "password",
    "confirmPassword": "password"
}


```

Response
```json
{
    "status": "Pending", // Email Verification Status
    "massage": "Verification Otp is sent to your email",
    "data": {
        "userId": "UserId",
        "email": "szqajkdjakmgzxbcgn@tmmbt.net"
    },
    "token": JWTTOKEN
}

```
#### User SignIn 

```http
  GEt /https://assignment-ti7v.onrender.com/user/signIn
```
Parameter

```json

{
  "email": "szqajkdjakmgzxbcgn@tmmbt.net",
  "password": "password",
}


```

Response
```json
{
    "token": JWTTOKEN
}

```

#### OTP Verification 

```http
  GEt /https://assignment-ti7v.onrender.com/user/verifyotp
```
Parameter

```json

{
  {
    "userId": "UserId",
    "otp": "OTP"
}
}


```

Response
```json
{
    "message": "Success/Failure",
    "data": {
        "id": "userId",
        "userName": "userName",
        "email": "email",
        "verified": true
    }
}
```
