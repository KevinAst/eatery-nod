import AuthServiceAPI from '../AuthServiceAPI';
import User           from '../User';

/**
 * AuthServiceMock is the **mock** AuthServiceAPI derivation.
 * 
 * NOTE: This represents a persistent service, where the active user
 *       is retained between service invocations.
 */
export default class AuthServiceMock extends AuthServiceAPI {

  /**
   * Our "current" active user, retained between service invocations,
   * null for none (i.e. signed-out).
   */
  currentAppUser = null; // type: User (our application User object)


  signIn(email, pass) { // ... see AuthServiceAPI

    return new Promise( (resolve, reject) => {

      // ?? stimulate various errors with variations in email/pass
      // ? return reject( // SAMPLE ONE <<< unexpected condition
      // ?   new Error(`***ERROR*** ?? Fill In`)
      // ?     .defineAttemptingToMsg('sign in to eatery-nod')
      // ? );
      // ? return reject( // SAMPLE TWO <<< expected condition
      // ?                new Error(`***ERROR*** Invalid Password`)
      // ?   .defineUserMsg('Invalid SignIn credentials.') // keep generic ... do NOT expose details to the user (e.g. Invalid Password)
      // ?   .defineAttemptingToMsg('sign in to eatery-nod')
      // ? );

      // very simple mock ... sign in the supplied user
      this.currentAppUser = new User({
        "name": "MockGuy",
        "email": email,
        "emailVerified": true,
        "pool": "mock"
      });
      return resolve(this.currentAppUser);

    });
  }


  refreshUser() { // ... see AuthServiceAPI
    return new Promise( (resolve, reject) => {

      // very simple mock ... sign in the supplied user
      this.currentAppUser = new User({
        "name": "MockGuy",
        "email": email,
        "emailVerified": true,
        "pool": "mock"
      });
      return resolve(this.currentAppUser);

    });
  }


  resendEmailVerification() { // ... see AuthServiceAPI
    // NOTHING TO DO :-)
  }


  signOut() { // ... see AuthServiceAPI
    return new Promise( (resolve, reject) => {
      this.currentAppUser = null; // reset our local User object, now that we are signed-out
      return resolve(undefined);
    });
  }

};
