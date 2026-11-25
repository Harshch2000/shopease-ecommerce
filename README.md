# ShopEase: E-commerce Store

**Created by Harsh Chourasia**

Full-stack e-commerce app: **Spring Boot 3 (Java 17)** REST API + **Angular 17** frontend.

## Features
- Register and log in with JWT authentication, roles `USER` and `ADMIN`
- Product catalog with search, category filter and pagination
- Shopping cart (add, change quantity, remove) with stock checks
- Checkout creates an order, reduces stock and clears the cart (payment is mocked)
- Order history for customers
- Admin panel: add, edit and delete products; view all orders and update their status

## Structure
```
ecommerce/
├── backend/    Spring Boot (entity, repository, dto, service, controller, security, config)
└── frontend/   Angular (core services, guards, interceptor, features/*)
```

## Run the backend
Requirements: JDK 17+, Maven 3.8+
```
cd backend
mvn spring-boot:run
```
API runs on http://localhost:8080. It uses an in-memory H2 database by default, seeded with sample data.

To use MySQL instead, edit `src/main/resources/application-mysql.properties` and run:
```
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## Run the frontend
Requirements: Node 18.19+ or 20+
```
cd frontend
npm install
npm start
```
Open http://localhost:4200.

## Demo admin account
Email `admin@shop.com`, password `Admin@123`. Change it before any real deployment, and set a new `app.jwt.secret`.

## API overview
| Method | Path | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/products?q=&categoryId=&page=&size= | public |
| GET | /api/categories | public |
| POST / PUT / DELETE | /api/products[/{id}] | ADMIN |
| GET / POST | /api/cart | user |
| PUT / DELETE | /api/cart/{itemId} | user |
| POST | /api/orders/checkout | user |
| GET | /api/orders | user |
| GET | /api/admin/orders | ADMIN |
| PUT | /api/admin/orders/{id}/status?status= | ADMIN |

## Next steps
Real payments (Stripe or Razorpay), product detail page, image upload, email notifications, Docker Compose.
