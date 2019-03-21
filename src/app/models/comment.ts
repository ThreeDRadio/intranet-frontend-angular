import { ApiModel } from 'app/services/model-api';

export class Comment implements ApiModel {
  id: number;
  comment: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    gravatarUrl: string;
  };
}
