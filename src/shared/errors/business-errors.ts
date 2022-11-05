/* eslint-disable prettier/prettier */
export function BusinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}
export enum BusinessErrors {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST
}
