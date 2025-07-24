

export interface IUser {
  name?: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    _id: string;
  };
    email: string;
    avatar?: string;
    phone?: string;
}



export interface ISession {
  user: IUser;
  message?: string;
  accessToken: string;
  refreshToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

