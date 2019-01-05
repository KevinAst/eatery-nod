import {createFeature}     from 'feature-u';
import featureFlags        from '../../../../util/featureFlags';
import LocationServiceMock from './LocationServiceMock';

/**
 * The **'locationServiceMock'** feature **defines** the **mock**
 * 'locationService' implementation.
 * 
 * This service is conditionally promoted when we **are** mocking.
 */
export default createFeature({
  name:    'locationServiceMock',

  enabled: featureFlags.mockGPS,

  fassets: {
    defineUse: {
      'locationService': new LocationServiceMock(),
    },
  }
});
