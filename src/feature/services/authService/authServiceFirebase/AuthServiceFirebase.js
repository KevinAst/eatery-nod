import firebase       from 'firebase';
import AuthServiceAPI from '../AuthServiceAPI';
import User           from '../User';

/**
 * AuthServiceFirebase is the **real** AuthServiceAPI derivation
 * using the Firebase service APIs.
 * 
 * This represents a persistent service, where the active user is
 * retained between service invocations.
 */
export default class AuthServiceFirebase extends AuthServiceAPI {

  // ***
  // *** NOTE: The persistance of this services is implicitly provided by firebase!
  // ***       ... via firebase.auth().currentUser 
  // ***           - null:                               (initial state or signed-out)
  // ***           - currentely signed-in firebase.user: (after successful sign-in)
  // ***

  // *** HOWEVER: We retain our last known User (currentAppUser) 
  // ***          in order to retain additional information accumulated
  // ***          from the app's DB userProfile.

  currentAppUser = null;

  /**
   * Sign in to our authorization provider (asynchronously).
   * 
   * @param {String} email the identifying user email
   * @param {String} pass the user password
   *
   * @returns {Promise} the signed-in eatery-nod User object.  
   * NOTE: The returned user may still be in an unverified state.
   */
  signIn(email, pass) {

    return new Promise( (resolve, reject) => {

      // signin through firebase authentication
      firebase.auth().signInWithEmailAndPassword(email, pass)
              .then( fbUser => { // fbUser: firebase.User (https://firebase.google.com/docs/reference/js/firebase.User)

                // ?? TEST: if true, use param AND document it as such
                console.log(`??? AuthServiceFirebase.signIn() parm fbUser is same as firebase.auth().currentUser: ${fbUser === firebase.auth().currentUser}`);

                // supplement the signed-in fbUser with our app's DB userProfile
                const dbRef = firebase.database().ref(`/userProfiles/${fbUser.uid}`);
                dbRef.once('value')
                     .then( snapshot => {

                       const userProfile = snapshot.val();
                       // console.log(`xx AuthServiceFirebase.signIn() userProfile: `, userProfile)

                       // communicate issue: missing userProfile
                       if (!userProfile) {
                         return reject(
                           new Error(`***ERROR*** No userProfile exists for user: ${fbUser.email}`)
                             .defineClientMsg('Your user profile does NOT exist.')
                             .defineAttemptingToMsg('sign in to eatery-nod')
                         );
                       }

                       // retain/communicate our user object, populated from both the fbUser and userProfile
                       this.currentAppUser = new User({
                         name:          userProfile.name,
                         email:         fbUser.email,
                         emailVerified: fbUser.emailVerified,
                         pool:          userProfile.pool,
                       });
                       return resolve(this.currentAppUser);
                     })

                     .catch( err => { // unexpected error
                       return reject(err.defineClientMsg('A problem was encountered fetching your user profile')
                                        .defineAttemptingToMsg('sign in to eatery-nod'));
                     });

              })

              .catch( (err) => {
                // NOTE: In this context, firebase provides an err.code
                //       - when .code is supplied, it enumerates a user specific credentials problem (like "invalid password")
                //         ... we do NOT expose this to the user (so as to NOT give hacker insight)
                //             rather we generalize it to the user ('Invalid SignIn credentials.')
                //       - when .code is NOT supplied, it represents an unexpected condition
                // KEY:  This err.code is an internal detail, interpret here, 
                //       and manifest through the err.clientMsg

                const userMsg = err.code ? 'Invalid SignIn credentials.' : 'A problem was encountered while signing in';

                return reject(err.defineClientMsg(userMsg));
              });
    });
  }


  /**
   * Refresh the current signed-in user.
   *
   * This method is typically used to unsure the authorization status
   * is up-to-date.
   * 
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   * 
   * @returns {Promise} the refreshed signed-in eatery-nod User object.
   * NOTE: The returned user may still be in an unverified state.
   */
  refreshUser() {
    return new Promise( (resolve, reject) => {

      // verify we have a current user to refresh
      if (this.currentAppUser === null) {
        return reject(
          new Error('***ERROR*** AuthServiceFirebase.refreshUser(): may only be called once a successful signIn() has completed.')
            .defineAttemptingToMsg('refresh a non-existent user (not yet signed in)')
        );
      }

      // refresh our current signed-in user
      firebase.auth().currentUser.reload()

              .then( fbUser => { // fbUser: firebase.User (https://firebase.google.com/docs/reference/js/firebase.User)

                // ?? TEST: if true, use param AND document it as such (?? NOT fbUserX)
                console.log(`??? AuthServiceFirebase.refreshUser() parm fbUser is same as firebase.auth().currentUser: ${fbUser === firebase.auth().currentUser}`);

                // refresh our signed-in user
                const fbUserX = firebase.auth().currentUser;
                this.currentAppUser.email         = fbUserX.email;
                this.currentAppUser.emailVerified = fbUserX.emailVerified;

                // communicate refreshed signed-in user
                return resolve(this.currentAppUser);
              })

              .catch( err => { // unexpected error
                return reject(err.defineAttemptingToMsg('refresh the signed-in user'));
              });

    });
  }



  /**
   * Resend an email notification to the current signed-in user.
   *
   * This method is used, upon user request, to resend the email
   * contining instructions on how to verify their identity.
   * 
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   */
  resendEmailVerification() {

    // verify we have a current user to resend to
    if (this.currentAppUser === null) {
      throw new Error('***ERROR*** AuthServiceFirebase.resendEmailVerification(): may only be called once a successful signIn() has completed.')
        .defineAttemptingToMsg('resend an email verification to a non-existent user (not yet signed in)');
    }

    // issue the email request
    firebase.auth().currentUser.sendEmailVerification();
    // console.log(`??? AuthServiceFirebase.resendEmailVerification() just sent email verification to firebase`);

  }


  /**
   * Sign-out the current signed-in user.
   *
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   * 
   * @returns {Promise} a void promise, used to capture async errors.
   */
  signOut() {
    return new Promise( (resolve, reject) => {

      // verify we have a current user to refresh
      if (this.currentAppUser === null) {
        return reject(
          new Error('***ERROR*** AuthServiceFirebase.signOut(): may only be called once a successful signIn() has completed.')
            .defineAttemptingToMsg('sign-out a non-existent user (not yet signed in)')
        );
      }

      // issue the signout request
      firebase.auth().signOut()
              .then( () => {
                this.currentAppUser = null; // reset, now that we are signed-out
              })
              .catch( err => { // unexpected error
                return reject(err.defineAttemptingToMsg('sign-out the user'));
              });
    });
  }

};
