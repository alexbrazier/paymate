// declare namespace NodeJS {
//   interface ProcessEnv {
//     NODE_ENV: 'development' | 'production' | 'test';
//     PORT?: string;
//     JWT_SECRET: string;
//   }
// }

declare namespace Express {
  interface User {
    id: string;
    email: string;
  }

  export interface Request {
    user?: User;
  }
}
