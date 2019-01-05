/**
 * featureFlags (see description below)
 */

export default {
  useWIFI: true,  // should app use WIFI? ... regulates various services: real/mocked
  mockGPS: true,  // should app mock GPS? ... regulates locationService:  real/mocked
  log:     false, // should app emit diagnostic logs?
  sandbox: false, // should app enable diagnostic sandbox controls?
};
