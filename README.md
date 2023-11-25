# :mushroom: Cat Tiny Store :cat:

My cat tiny store, small API built with NestJS.

## :mushroom:  Features

- Authentication and authorization protection for endpoints.
- Authorization roles: Client, Manager.
- Refresh token functionality
- Forgot/Reset password funcionality
- Send email after password reset.

## :mushroom: Tech

- PostgreSQL and Prisma
- NestJs
- Typescript
- Jest
- Prettier
- ESLint
- REST

## :mushroom: Instalation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## :mushroom: Database
![alt text](https://drive.google.com/file/d/10CX5C3hlMezyKXhO6b0dKIt7uvB9hmFJ/view?usp=drive_link)

## :mushroom: Operations
1. Authentication endpoints (sign up, sign in, sign out)
```
POST: /auth/login
POST: /auth/sign-up
POST:/auth/sign-out
GET: /auth/refresh
```
2. List products with pagination
3. Search products by category
4. User actions:
    1. Manager:
        1. Create products
        ```
        GET: /products
        ```
        2. Update products
        ```
        PATCH: /products/:productId
        ```
        3. Delete products
        ```
        DELETE: /products/:productId
        ```
        4. Disable products
        ```
        PATCH: /products/disable/:productId
        ```
        5. Show client orders
        ```
        GET: /orders/show-all-orders?userId=1
        ```
        6. Upload images per product
        ```
        product/upload-image/:productId
        ```
    2. Client:
        1. See products
        ```
        GET /products
        ```
        2. See the product details
        ```
        GET: /product/:productId
        ```
        3. Buy products
        ```
        POST: /orders
        ```
        4. Add products to cart
        ```
        POST /carts
        ```
        5. Like products
        ```
        POST /product-likes
        ```
        6. Show my order
        ```
        GET: orders/:orderId
        ```
5. Public general actions:
```
GET: /products
GET: /products/:productId
```
6. Swagger/Postman documentation
```
api/
```