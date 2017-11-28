import {Costcenter} from './costcenter';

export interface Item {
    name: string;
    amount: number;
    costcenter: Costcenter;
    price: number;
}