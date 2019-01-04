// ***
// *** Provide value-added extension to the Error class (originally from GeekU)
// ***


if (!Error.prototype.defineClientMsg) { // key off of one of several extension points

  /**
   * Define a client-specific message, that is applicable for client
   * consumption:
   *  - both in meaning, 
   *  - and in sanitization (so as to not reveal any internal architecture).
   *
   * @param {String} clientMsg the client message to define
   *
   * @return {Error} self, supporting convenient Error method chaining.
   */
  Error.prototype.defineClientMsg = function(clientMsg) {
    this.clientMsg = clientMsg;
    return this;
  };
  Error.prototype.clientMsg = "Unexpected Condition"; // prototype provides the default


  /**
   * Define a client-specific 'attempting to' message, that provides
   * additional details of what was being attempted.
   *
   * Errors with this context are prefixed with ' ... attempting to: ',
   * so word your phrasing appropriatly.
   * 
   * Multiple attempting-to phrases can be used, which will be
   * combined with the ', -and- ' phrase.
   *
   * @param {String} attemptingToMsg the client-specific attempting
   * to' message.
   *
   * @return {Error} self, supporting convenient Error method chaining.
   */
  Error.prototype.defineAttemptingToMsg = function(attemptingToMsg) {
    if (this.attemptingToMsg) // append multiples
      this.attemptingToMsg += `, -and- ${attemptingToMsg}`;
    else                      // initial definition
      this.attemptingToMsg += ` ... attempting to: ${attemptingToMsg}`;
    return this;
  };
  Error.prototype.attemptingToMsg = ''; // prototype provides the default


  /**
   * Format a client-specific message, combining all client-specific contexts.
   *
   * @return {string} formatted client message.
   */
  Error.prototype.formatClientMsg = function() {
    return this.clientMsg + this.attemptingToMsg;
  };


  // L8TR:
  // /**
  //  * Define an http status, allowing self to direct the status to be
  //  * defined to an http client.
  //  *
  //  * @param {int} httpStatus the http status to define.
  //  *
  //  * @return {Error} self, supporting convenient Error method chaining.
  //  */
  // Error.prototype.defineHttpStatus = function(httpStatus) {
  //   this.httpStatus = httpStatus;
  //   return this;
  // };
  // 
  // 
  // /**
  //  * Define an indicator as to the cause of this error ... used to apply
  //  * various heuristics, such as whether logging is necessary.
  //  *
  //  * The following indicators are available:
  //  *   Error.Cause {
  //  *     UNEXPECTED_CONDITION        [default]
  //  *     RECOGNIZED_CLIENT_ERROR
  //  *   }
  //  *
  //  * @param {String} cause one of Error.Cause.
  //  *
  //  * @return {Error} self, supporting convenient Error method chaining.
  //  */
  // Error.prototype.defineCause = function(cause) {
  //   this.cause = cause;
  //   return this;
  // };
  // 
  // Error.Cause = {
  //   UNEXPECTED_CONDITION:    'UNEXPECTED_CONDITION',
  //   RECOGNIZED_CLIENT_ERROR: 'RECOGNIZED_CLIENT_ERROR'
  // };
  // 
  // Error.prototype.cause = Error.Cause.UNEXPECTED_CONDITION; // prototype provides the default
  // 
  // 
  // 
  // /**
  //  * Define a URL that is appropriate to this context.
  //  *
  //  * @param {ServerRequest} req the Express request object
  //  *
  //  * @return {Error} self, supporting convenient Error method chaining.
  //  */
  // Error.prototype.defineUrl = function(req) {
  //   this.url = decodeURIComponent(req.originalUrl);
  //   return this;
  // };

}
