import { ObjectId } from "mongodb";

export default class Quote {
  constructor(public message: string, public id?: ObjectId) {}
}
