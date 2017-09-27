import React   from 'react';
import verify  from './verify';
import {Modal} from 'react-native';
import {Button,
        Text,
        View}  from 'native-base';

/**
 * The Notify component provides user notifications through a visual
 * message dialog.
 *
 * User messages are initiated through a programmatic invocation,
 * using the functional notify() API.  Supplied directives support
 * a variety of scenarios, including:
 *   - action buttons (for acknowledgment, or confirmation, etc.)
 *   - timed closure of the message
 *   - msg levels of info, warn, error (impacing the dialog style/color)
 *   - modal and non-modal
 *
 * Notify is the fundamental component which is the basis of various
 * UI notifications (i.e. Toasts, Alerts, Confirmations, etc.).  It
 * can be used stand-alone, or indirectly through various wrappers
 * (promoted through named exports).  The following functions are
 * summarized as:
 *
 * ```
 *                                                     position
 *               params                        modal  (via modal) notes
 *               ===================           ======  =========  ======================================
 * - notify .... (namedArgs)                   either  either     named parameters direct exact features
 * - toast ..... ({msg, duration=3, actions})  NO      bottom     uses duration
 * - alert ..... ({msg, actions})              YES     top        injects single OK action
 * - confirm ... ({msg, actions})              YES     top        requires client actions
 * ```
 *
 * **Setup**: The Notify component is tightly controlled as a single
 * instance within an entire app.  Therefore, one and only one Notify
 * instance must be pre-instantiated (initially hidden) somewhere at
 * the top-level of your app.
 *
 * ```
 *   <Notify/>
 * ```
 * 
 * **Usage**: see doc below: `notify()`, `toast()`, `alert()`, `confirm()`
 * 
 * **Module Note**:
 *
 *   This utility is housed in a lower-case `notify.js` module,
 *   because the general public API is a series of lower-case "named
 *   exported" functions: `notify()`, `toast()`, `alert()`,
 *   `confirm()`.
 * 
 *   There is a "default exported" Notify component (which is somewhat
 *   unusual to find in a lower-case module), but is only used once at
 *   app startup, so is therefore justified (in this case).
 */
export default class Notify extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(...args) {
    super(...args);

    // keep track of our one-and-only instance
    verify(!_singleton, '<Notify> only ONE Notify instance may be instantiated within the app.');
    _singleton = this;

    // define our initial state controlling what Notify displays
    // ... FIFO array of directives (supporting multiple notifications)
    this.state = { directives: [] };
  }

  display({msg,
           duration=null,
           level='info',
           modal=false,
           actions=[],
           ...unknownArgs}={}) {

    // validate the named parameters (i.e. the directive)
    const check = verify.prefix('notify() parameter violation: '); // NOTE: we pretend we are: notify() (the public access point)

    check(msg, 'directive.msg is required');
    // TODO: check duration (if supplied) is a number between 1 and 20
    // TODO: check actions is an array where each elm contains txt, and more (if you feel empowered)
    check(levelBackgroundColor[level],   `invalid level: '${level}', expecting one of ${Object.keys(levelBackgroundColor)}.`);
    check(modal===true || modal===false, `supplied modal (${modal}) must be a boolean true/false.`);


    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length===0,  `unrecognized directive attributes(s): ${unknownArgKeys}`);

    // encapsulate named arguments into a central directive object
    // ... cannot simply use arguments[0], as it does NOT pick up defaults (above)
    const directive = {
      msg,
      duration,
      level,
      modal,
      actions,
    };
    // console.log(`XX directive: `, directive);

    // add the newly supplied directive to our state
    this.setState( (state, props) => {

      // place directive at end (supporting multiple notifications)
      const nextState = {
        directives: [...state.directives, directive],
      };

      // when this is the first directive, we know it will be displayed
      // ... therefore we can interpret it's duration that auto closes our dialog
      // ... all other directive timers (i.e. multiple directives) are managed when the current directive is closed
      if (nextState.directives.length === 1) {
        this.applyDuration(nextState.directives[0]);
      }

      return nextState;
    });

  }

  close() {

    // console.log(`xx in close() with ${this.state.directives.length} directives`);

    // remove the directive currently being displayed
    this.setState( (state, props) => {

      // console.log(`xx in close()'s setState() with ${state.directives.length} directives`);

      // nix the first entry (the one being displayed)
      const nextState = {
        directives: state.directives.slice(1), // simplified because first elm, more generally: [...state.directives.slice(0, indx), ...state.directives.slice(indx+1)]
      };

      // when additional directives still remain, we know the next one up will be displayed
      // ... therefore we can interpret it's duration that auto closes our dialog
      const nextDirective = nextState.directives.length > 0 ? nextState.directives[0] : undefined;
      if (nextDirective) {
        this.applyDuration(nextDirective);
      }

      return nextState;
    });
  }

  applyDuration(directive) {
    // no-op when NO directive duration is supplied
    if (!directive.duration)
      return;

    // maintain our timer to close this directive
    this.timeoutId = setTimeout( () => { // we retain our timeoutId to clear it when an external button initiates close()
      this.timeoutId = undefined;        // ... because we are activated by our timer, prevent it's clearing in a button
      this.close();
    }, directive.duration*1000);
  }

  currentDirective() {
    return this.state.directives.length > 0 ? this.state.directives[0] : null;
  }

  render() {
    // no-op when NO notifications are active
    const directive = this.currentDirective();
    if (!directive)
      return null;

    const notifyStyle = {
      position:  'absolute',
      width:     '100%',
      elevation: 9, // android elevation API (z ordering) ... omit/1-2: below everything, 3-1000000: above all except sidebar (9 used by native-base Toast)
      padding:   10,
      top:       position(directive, 'top'),
      bottom:    position(directive, 'bottom'),
      backgroundColor:  levelBackgroundColor[directive.level],
    };

    // interpret any client-supplied actions
    const actions = directive.actions || [];
    // ... when NO duration and NO actions are defined, inject a default OK action
    if (!directive.duration && directive.actions.length===0)
      actions.push({txt: 'OK'});
    // ... morph supplied actions in to a series of buttons injected in our dialog
    const dialogActions = actions.length===0 ? null : (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
        {
          actions.map( (action) => {
            return (
              <Button key={action.txt}
                      transparent
                      onPress={()=> {
                          // always close self
                          // ... clearing any pending duration timer
                          if (this.timeoutId) {
                            clearTimeout(this.timeoutId);
                            this.timeoutId = undefined;
                          }
                          this.close();

                          // invoke client-function (when supplied)
                          if (action.action)
                            action.action();
                        }}>
                <Text>{action.txt}</Text>
              </Button>
            );
          })
        }
      </View>
    );

    // define the base dialog to display
    const baseDialog = (
      <View style={notifyStyle}>
        <Text>{directive.msg}</Text>
        {dialogActions}
      </View>
    );

    // wrap our base dialog with modality (as needed)
    const dialog = directive.modal ? <Modal animationType="fade"
                                            transparent={true}
                                            visible={true}
                                            onRequestClose={identityFn}>
                                       {baseDialog}
                                     </Modal>
                                   : baseDialog;

    return dialog;
  }
}


// keep track of our one-and-only instance
let _singleton = null;


// algoritm encapsolating notification position (top/bottom)
// ... based on our modality
function position(directive, styleAttr) {
  // base our position on modality
  const directivePos = directive.modal ? 'top' : 'bottom';

  // no-op if we are NOT specifying the style attribute for the position of interest
  if (styleAttr !== directivePos) {
    return undefined;
  }

  // resolve different offsets for top/bottom
  return directivePos==='top' ? 0 : 0; // works for Android (may need to adjust for Platform.OS==='ios' (top WAS 24, but may be impacted by <Modal> wrapper)
}


// our background colors associated to the msg level
const levelBackgroundColor = {
  info:  '#5cb85c', // light green   (black foreground looks good)
  warn:  '#f0ad4e', // orangy yellow (black foreground looks good)
  error: '#d9534f', // redish        (black foreground looks good)
};

const identityFn = (p)=>p;


/**
 * Display a user notification - the general purpose access point,
 * using named directives.
 *
 * @param {string} directive.msg the message to be displayed. CR/LF
 * are supported to add spacing.
 *
 * @param {number} [directive.duration] the number of seconds to
 * display the msg before automatically closing the dialog.  If not
 * supplied, the dialog must be explicitly closed through a button
 * click.
 *
 * @param {string} [directive.level] the category level associated
 * with this notification (impacting background color).  One of
 *  - 'info' ... the default
 *  - 'warn'
 *  - 'error'
 *
 * @param {boolean} [directive.modal] an indicator as to whether the
 * notification dialog is modal (true) or not (false) the default.
 * NOTE: modality determines the position of the notification
 * dialog:
 *   - modal:     top
 *   - non-modal: bottom
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO duration and NO actions are defined, a default OK 
 *       action is injected that will close the dialog when clicked.
 *
 * Example:
 * ```
 *   notify({
 *     msg:      'You have un-saved changes.\nif you leave, your changes will NOT be saved!',
 *     duration: seconds,
 *     level:    'warn',
 *     modal:    true,
 *     actions: [
 *       { txt: 'Discard Changes', action: () => ...callback-logic-here... },
 *       { txt: 'Go Back' }
 *     ]
 *   });
 * ```
 */
export function notify(directive) {
  // validate that an <Notify> has been instantiated
  verify(_singleton, 'notify(): NO <Notify> instance has been established within the app.');

  // pass-through to our instance method
  _singleton.display(directive);
}


/**
 * The toast() function is a convenience wrapper around notify() that
 * displays the supplied msg as a "toast" ... a non-modal dialog
 * located at the bottom of the screen, which is typically closed
 * after 3 seconds.
 *
 * Various levels can be accomplished via toast.info(), toast.warn(),
 * toast.error() ... all of which have the same signature.  NOTE:
 * toast() is the same as toast.info().
 *
 * @param {string} directive.msg the message to be displayed. CR/LF are
 * supported to add spacing.
 *
 * @param {number} [directive.duration] the number of seconds before
 * automatically closing the dialog (default: 3).  A zero (0) derfers to
 * supplied actions to close (which in turn defaults to an OK).
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO duration and NO actions are defined, a default OK 
 *       action is injected that will close the dialog when clicked.
 *
 * Example:
 * ```
 *   toast({ msg:'Hello World' }); // will close in 3 secs
 *   toast.error({ msg:     `An error occurred: ${err}`, 
 *                 duration: 0 }); // OK button will close
 *   toast.warn({                  // will close in 3 secs -OR- when "undo" is clicked
 *     msg: 'Your item was deleted', 
 *     actions: [
 *       { txt: 'undo', action: () => ...callback-logic-here... },
 *     ]
 * ```
 */
function toastBase({msg, duration=3, actions, ...unknownArgs}, level) {

  // validate toast-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`toast${funcQual}() parameter violation: `);

  // checking msg explicitly avoids unknownArgKeys weirdnsess (below) when msg is passed as a non-named param
  check(msg, 'directive.msg is required');

  // ... NOTE: most validations are provided by the root notify()

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `following directive()s are not allowed by toast: ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    duration,
    actions,
    level, // NOTE: level is defaulted by the root notify()
    modal: false,
  });
}
export function  toast(directive) { toastBase(directive);          }
toast.info  = function(directive) { toastBase(directive, 'info');  }
toast.warn  = function(directive) { toastBase(directive, 'warn');  }
toast.error = function(directive) { toastBase(directive, 'error'); }




/**
 * The alert() function is a convenience wrapper around notify() that
 * displays the supplied msg as a "alert" ... a modal dialog located
 * at the top of the screen, that must be acknowledged by the user with
 * either the default OK button, or a client-supplied action.
 *
 * Various levels can be accomplished via alert.info(), alert.warn(),
 * alert.error() ... all of which have the same signature.  NOTE:
 * alert() is the same as alert.info().
 *
 * @param {string} directive.msg the message to be displayed. CR/LF are
 * supported to add spacing.
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO actions are defined, a default OK  action is injected
 *       that will close the dialog when clicked.
 *
 * Example:
 * ```
 *   alert({ msg:'Hello World' });
 *   alert.warn({ msg:`Your limit (${limit}) has been reached!` });
 * ```
 */
function alertBase({msg, actions, ...unknownArgs}, level) {

  // validate alert-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`alert${funcQual}() parameter violation: `);

  // checking msg explicitly avoids unknownArgKeys weirdnsess (below) when msg is passed as a non-named param
  check(msg, 'directive.msg is required');

  // ... NOTE: most validations are provided by the root notify()

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `following directive()s are not allowed by alert: ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    actions,
    level, // NOTE: level is defaulted by the root notify()
    modal: true,
  });
}
export function  alert(directive) { alertBase(directive);          }
alert.info  = function(directive) { alertBase(directive, 'info');  }
alert.warn  = function(directive) { alertBase(directive, 'warn');  }
alert.error = function(directive) { alertBase(directive, 'error'); }


/**
 * The confirm() function is a convenience wrapper around notify()
 * that displays the supplied msg as a "confirmation" ... a modal
 * dialog located at the top of the screen, that must be acknowledged
 * through client-supplied action buttons.
 *
 * Various levels can be accomplished via confirm.info(), confirm.warn(),
 * confirm.error() ... all of which have the same signature.  NOTE:
 * confirm() is the same as confirm.info().
 *
 * @param {string} directive.msg the message to be displayed. CR/LF are
 * supported to add spacing.
 *
 * @param {Action[]} directive.actions one or more actions - button/action
 * combinations.  The required Action.txt defines the button label,
 * and the Action.action is an option client-supplied callback.  Each
 * defined action will implicitly close the dialog, in addition to
 * invoking the optional client-supplied callback.
 *
 * Example:
 * ```
 *   confirm.warn({ 
 *     msg: 'This is an confirm warning.\nYou must explicitly acknowledge it.', 
 *     actions: [
 *       { txt: 'Discard Changes', action: () => console.log('xx Discarding Changes') },
 *       { txt: 'Go Back' }
 *     ]
 *   });
 * ```
 */
function confirmBase({msg, actions, ...unknownArgs}, level) {

  // validate confirm-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`confirm${funcQual}() parameter violation: `);

  // checking msg explicitly avoids unknownArgKeys weirdnsess (below) when msg is passed as a non-named param
  check(msg, 'directive.msg is required');

  // confirm() requires client-supp0lied actions
  check(actions && actions.length>0, 'client-specific actions are required.');

  // ... NOTE: most validations are provided by the root notify()

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `following directive()s are not allowed by confirm: ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    level, // NOTE: level is defaulted by the root notify()
    modal: true,
    actions,
  });
}
export function  confirm(directive) { confirmBase(directive);          }
confirm.info  = function(directive) { confirmBase(directive, 'info');  }
confirm.warn  = function(directive) { confirmBase(directive, 'warn');  }
confirm.error = function(directive) { confirmBase(directive, 'error'); }
