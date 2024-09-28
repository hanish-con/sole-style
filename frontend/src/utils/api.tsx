import { UserModel } from "@/models/user";

export default async function registerUser(userData: UserModel) {
    const resp = await fetch("http://localhost:3002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(userData),
    });
    const data = await resp.json();
    return data;
}
