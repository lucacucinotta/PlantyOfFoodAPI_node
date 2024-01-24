<h1 align="center">🥦 Planty Of Food API</h1>

## 🗂️ Table of contents

- [Introduction to Project](#introduction-to-project)
  - [Requirements](#requirements)
- [Technologies](#technologies)
  - [Framework and libraries](#framework-and-libraries)
- [Instructions](#instructions)
- [API](#api)
- [Author](#author)

## 🌐 Introduction to Project

Planty of Food (POF) is a company that aims to make plant-based food more accessible, especially thanks to its purchasing groups.
My task will be to create RESTful JSON APIs that will allow you to manage these purchasing groups.

### 📋 Requirements

The API must allow the insertion, modification and deletion of various entities, including products sold, users records and sales orders. Each of these entities have specific attributes like name's product, name,last name and email of the users and the composition of products and users for each order. Functions will need to be implemented to view all orders, with the possibility of filtering them by date of entry and the products they contain.

The API must follow the REST standards, including naming, the correct use of HTTP methods and good management of response status codes.
We have the flexibility to choose between to using a relational database like MySQL or a NoSQL database like MongoDb to store information.

## 🛠️ Technologies

### 🧑‍💻 IDE

<p align="left">
  <img src="https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white"/>
</p>

### 💻 Languages

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
</p>

### 📚 Frameworks and libraries

<p align="left">  
  <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=for-the-badge&logo=dotenv&logoColor=black"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mongoose-880000.svg?style=for-the-badge&logo=Mongoose&logoColor=white"/>

- [Helmet](https://www.npmjs.com/package/helmet)
- [Joi](https://www.npmjs.com/package/joi)
- [Supertest](https://www.npmjs.com/package/supertest)
</p>

## ❗Instructions

**1. Clone the repository:**

`git clone https://github.com/lucacucinotta/PlantyOfFoodAPI_node.git`

**2. Install the dependencies:**

`npm install`

**3. Create a .env file:**

Create an account on [MongoDb Atlas](https://www.mongodb.com/it-it/cloud/atlas/register) or install [MongoDb Compass](https://www.mongodb.com/try/download/compass) and create an .env file like this :

```bash
PORT=insert here the port number of your server
DATABASE=insert here the URI of your DB
```

**4. Start the server:**

`npm start`

or, if you prefer to use Nodemon to have a server that updates automatically, type:

`npm run dev`

**5. Test it:**

You can use a client for your test, like [Postman](https://www.postman.com/).

## 🚀 API

### Endpoints

#### Product

| Method | Endpoint          | Result                                                |
| ------ | ----------------- | ----------------------------------------------------- |
| GET    | api/products/:id? | Show all products or the only one that matches the ID |
| POST   | api/product       | Create a new product                                  |
| PUT    | api/product/:id   | Modify the existing product that matches the ID       |
| DELETE | api/product/:id   | Delete the existing product that matches the ID       |

#### User

| Method | Endpoint       | Result                                             |
| ------ | -------------- | -------------------------------------------------- |
| GET    | api/users/:id? | Show all users or the only one that matches the ID |
| POST   | api/user       | Create a new user                                  |
| PUT    | api/user/:id   | Modify the existing user that matches the ID       |
| DELETE | api/user/:id   | Delete the existing user that matches the ID       |

#### Order

| Method | Endpoint       | Result                                        |
| ------ | -------------- | --------------------------------------------- |
| GET    | api/orders     | Show all orders                               |
| GET    | api/orders/:id | Show the only one order that matches the ID   |
| POST   | api/order      | Create a new order                            |
| PUT    | api/order/:id  | Modify the existing order that matches the ID |
| DELETE | api/order/:id  | Delete the existing order that matches the ID |

##### Order - Filters

| Method | Endpoint                     | Result                              |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | api/orders?date=YYYY-MM-DD   | Show orders filtered by date        |
| GET    | api/orders?product=productID | Show orders with a specific product |
| GET    | api/order?user=userID        | Show orders made by a specific user |

### Usage

#### **Product**

You can get the entire list of products or get a specific product with his ID with a `GET` request :

`GET /api/products` or `GET /api/products/:id`

You can add a new product with a `POST` request:

`POST /api/product`

```bash
{
  "name":"product's name"
}
```

You can modify an existing product with a `PUT` request:

`PUT /api/product/:id`

```bash
{
  "name":"new product's name"
}
```

You can delete an existing product with a `DELETE` request:

`DELETE /api/product/:id`

#### **User**

You can get the entire list of users or get a specific user with his ID with a `GET` request :

`GET /api/users` or `GET /api/users/:id`

You can add a new user with a `POST` request:

`POST /api/user`

```bash
{
  "name":"user's name",
  "lastName":"user's last name",
  "email":"user's email"
}
```

You can modify an existing user with a `PUT` request:

`PUT /api/user/:id`

```bash
{
  "email":"new user's email"
}
```

You can delete an existing user with a `DELETE` request:

`DELETE /api/user/:id`

#### **Order**

You can get the entire list of orders or get a specific order with his ID with a `GET` request :

`GET /api/orders` or `GET /api/orders/:id`

You can also get a specific order with a query :

`GET /api/orders?date=YYYY-MM-DD` or `GET /api/orders?product=productId` or `GET /api/orders?user=userID`

You can add a new order with a `POST` request:

`POST /api/order`

```bash
{
  "products":["product's id"],
  "users":["user's id"]
}
```

You can modify an existing order with a `PUT` request:

`PUT /api/order/:id`

```bash
{
  "products":["new product's ID"]
}
```

You can delete an existing order with a `DELETE` request:

`DELETE /api/order/:id`

## 👤 Author

Luca Cucinotta

<p align="left">
  <a href="https://github.com/lucacucinotta">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
  <a href="https://www.linkedin.com/in/luca-cucinotta-4b836b278/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
</p>
