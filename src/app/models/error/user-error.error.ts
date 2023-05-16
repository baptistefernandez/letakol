
export class UserError extends Error {
    constructor() {
      super('You need to be connected to interact with the firestore');
      this.name = 'User Error';
    }
  }
  