# Sole-Style

An awesome ecommerce store for shoes for everyone written using React + TypeScript + TailwindCSS + Vite

## Install
`npm install`


## Run

`npm run dev`


## Contributor Guide
- Create an issue in the issues with a description of what we are trying to add or fix
- Pull from main branch
    `git checkout main`
    `git pull origin main`
- Create a new branch. Use `feat/` prefix for feature and `fix/` prefix for bugs. Eg: branch name `feat/login-form` or something nice.
    `git checkout -b feat/some-feature`
- Push to the remote branch
    `git push -u origin feat/some-feature`
- Create a PR to fix the respective issue.
- ⚠️ **Donot push to the main branch**


## Database Schema
* User
```
    User {
        id: String,
        firstName: String,
        lastName: String,
        email: String primary key,
        password: String,
        role: {
            type: Role,
            default: User,
        },
        address: Address,
    }

    Address {
        street: "String",
        city: "String",
        state: "String",
        postal_code: "String"
    }

    Role {
        User,
        Admin
    }
```

* Product
```
    Product {
        id: String,
        category: Category,
        imageAlt: String,
        imageSrc: String,
        name: String,
        description: String,
        color: String,
        price: Decimal,
        rating: 4,
        stock: Number,
    }

    Category {
        id: String,
        name: String,
        title: String,
    }
```

* Order
```
    Order {
        id: String,
        userId: String,
        orderDate: Date,
        status: {
            type: OrderStatus,
            default: Pending,
        },
        total_amount: Number,
        OrderItems: OrderItem[],

    }

    OrderItem {
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
    }

    OrderStatus {
        Pending,
        Returned,
        Shipped,
        Completed,
    }
```