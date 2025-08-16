export interface UserResponse {
    id: string;
    name: string;
    email: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserResponse {
    id: string;
    name: string;
    email: string;
}