// Import the original Request object
import { Request } from 'express';

// Define the structure of your custom properties
interface TFUser {
    email: string;
    picture: string;
    name: string;
    user_id: string;
    uid
}


// Use declaration merging to add the new properties to the Express Request
declare global {
  namespace Express {
    export interface Request {
      user?: TFUser;
      sessionID?: any;
      logout?: () => void;
    }
  }
}