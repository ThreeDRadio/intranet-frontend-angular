import { ApiModel } from 'app/services/model-api';
import { Moment } from 'moment';

export class Supporter implements ApiModel {
  id: number;
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  town: string;
  state: string;
  postcode: string;
  country: string;
  phone_mobile: string;
  email: string;
  dob: Moment;
}
