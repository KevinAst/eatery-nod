import firebase    from 'firebase';
import runFirebase from './runFirebase';

runFirebase( {

  userChangedFn(user) {
    if (user) {
      console.log(`firebaseDoodle.userChanged: signed in: `, user);
    }
    else {
      console.log(`firebaseDoodle.userChanged: NOT signed in`);
    }
  },


  sandboxFn() {
    console.log(`firebaseDoodle.sandbox: here I am in my sandbox`);

    //***
    //*** play with email verification process
    //***

    const user = firebase.auth().currentUser;
    if (!user.emailVerified) {
      console.log(`firebaseDoodle.sandbox: email UNVERIFIED - issuing verification of email`);

      user.sendEmailVerification();
      // NOTES:
      //  1) this works with an email link that must be clicked (which is processed internally)
      //     ... i.e. NO code is supplied to us to process here
      //  2) firebase DOES NOT pro-actively notify you when your email is verified
      //     ... see: https://stackoverflow.com/questions/37912615/firebase-get-notified-when-user-confirmed-an-email-sent-with-sendemailverifica
      //     ... only choice is to a) re-login, b) issue currentUser.reload() (say via an auth.check.verify action)

    }
    else {
      console.log(`firebaseDoodle.sandbox: email VERIFIED`);
    }



    //***
    //*** play with setting up pool (in my DB) WITHOUT touching other attributes (if any)
    //***

    // ? const ref = firebase.database().ref('/users/jonDOTsnowATgmailDOTcom');
    // ? 
    // ? ref.update({
    // ?   moreNesting: {
    // ?     level1: {
    // ?       level2: 'hey'
    // ?     }
    // ?   }
    // ? }, () => {
    // ?   console.log(`UPDATE complete`); // ?? any diff from this and .then()
    // ? })
    // ? .then( () => {
    // ?   console.log(`UPDATE then!!`);
    // ? })
    // ? .catch( err => {
    // ?   console.log(`UPDATE FAILED: `, err);
    // ? });
  },

});
