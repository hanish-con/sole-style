export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: string,
}

export type Product = {
    imageURL: string,
    photo_url: string,
    name: string,
    description: string,
    created_at: string,
    price: number,
    stock: number,
    id: number,
    category: string,
    updated_at: string,
};
