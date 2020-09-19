export class IUser {
    id: string;
    name: string;
    details: UserDetail[]
}

export class UserDetail {
    age: number;
    job: string;
}