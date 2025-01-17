export interface Todo {
    id: string;
    userId: string;
    description: string;
    done: boolean;
    editable: boolean;
  }
  
  export type Todos = Todo[];
