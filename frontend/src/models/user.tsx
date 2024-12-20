export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: string,
}

export type Product = {
    imageURL: string,
    name: string,
    description: string,
    createdAt?: string,
    price: number,
    stock: number,
    _id?: string,
    category: string,
    subcategory: string, 
    sizes: string,
    updatedAt?: string,
    featuredFlag: boolean,
};

export interface CartItem {
    _id: string;   
    productId: string;    
    productName: string;  
    productImage: string; 
    productPrice: number; 
    size: string;         
    quantity: number;     
  }