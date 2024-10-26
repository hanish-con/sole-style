import { Product, UserModel } from "@/models/user";

export async function registerUser(userData: UserModel) {
    const resp = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return resp;
}


export async function loginUser(userData: UserModel) {
    const resp = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return resp;
}

export async function getProducts(filters): Promise<
    { totalProducts: number, products: Product[] }
> {
    // const resp = await fetch("http://localhost:3002/products", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userData),
    // });

    const resp = {
        totalProducts: 100,
        products: [
            {
                id: 1,
                name: "Men's Running Sneakers",
                description: "Lightweight and breathable running shoes with excellent traction.",
                category: "Men",
                price: 89.99,
                imageURL: "https://images.unsplash.com/photo-1580927752452-3fb5ef8fafe0?ixlib=rb-4.0.3&q=80&auto=format&fit=crop&w=500&h=500",
                photo_url: "https://images.unsplash.com/photo-1580927752452-3fb5ef8fafe0",
                created_at: "2024-10-01T10:00:00Z",
                updated_at: "2024-10-20T15:00:00Z"
            },
            {
                id: 2,
                name: "Women's White Sneakers",
                description: "Stylish and comfortable sneakers for casual wear.",
                category: "Women",
                price: 79.99,
                imageURL: "https://images.unsplash.com/photo-1600181947925-3b4bbf9b420b?ixlib=rb-4.0.3&q=80&auto=format&fit=crop&w=500&h=500",
                photo_url: "https://images.unsplash.com/photo-1600181947925-3b4bbf9b420b",
                created_at: "2024-09-15T12:00:00Z",
                updated_at: "2024-10-18T18:00:00Z"
            },
            {
                id: 3,
                name: "Children's Sports Shoes",
                description: "Durable shoes designed for kids, perfect for school and play.",
                category: "Children",
                price: 49.99,
                imageURL: "https://images.unsplash.com/photo-1526146806203-6da413ad9f7f?ixlib=rb-4.0.3&q=80&auto=format&fit=crop&w=500&h=500",
                photo_url: "https://images.unsplash.com/photo-1526146806203-6da413ad9f7f",
                created_at: "2024-08-10T09:30:00Z",
                updated_at: "2024-10-22T10:30:00Z"
            }
        ]
    };
    return resp;
}

