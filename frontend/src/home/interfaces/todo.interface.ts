import { IHistory } from './history.interface';

export interface ITodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  deleted: boolean;
  updated: boolean;
  currentHistoryId: string;
  History: IHistory[];
}
