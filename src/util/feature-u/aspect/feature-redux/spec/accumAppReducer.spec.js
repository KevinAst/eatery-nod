import createFeature     from '../../../createFeature'; // ?? need to retrofit createFeature in order to test accumAppReducer
import slicedReducer     from '../slicedReducer';
import {accumAppReducer} from '../reducerAspect'; // function under test

// ? const anyAction = {type: 'any'};
// ? 
// ? function applyAppState(features) {
// ?   // accumulate our top-level app state reducer
// ?   // ... function under test
// ?   appReducerFn = accumAppReducer(features);
// ? 
// ?   // return the appStat from running the reducer
// ?   appState = appReducerFn(undefined, anyAction);
// ?   return appState;
// ? }
// ? 
// ? const feature1 = createFeature({
// ?   name:    'feature1',
// ?   reducer: (state='default-feature1', action) => 'state-for-feature1',
// ? });
// ? 
// ? const feature2 = createFeature({
// ?   name:    'feature2',
// ?   reducer: (state='default-feature2', action) => 'state-for-feature2',
// ? });
// ? 
// ? const feature3 = createFeature({
// ?   name:    'feature3',
// ?   reducer: slicedReducer('complex.slice.feature3',
// ?                          (state='default-feature3', action) => 'state-for-feature3'),
// ? });
// ? 
// ? const feature4 = createFeature({
// ?   name:    'feature4',
// ?   reducer: slicedReducer('complex.slice', // is an intermediate duplicate from feature3
// ?                          (state='default-feature4', action) => 'state-for-feature4'),
// ? });
// ? 
// ? const disabledFeature = createFeature({
// ?   name:    'disabledFeature',
// ?   enabled: false,
// ?   reducer: (state='default-disabledFeature', action) => 'state-for-disabledFeature',
// ? });
// ? 
// ? const featureWithoutState = createFeature({
// ?   name: 'featureWithoutState',
// ? });

describe('feature-u accumAppReducer() tests', () => {

  test('placebo till we can isolate tests without UI (with krapola native-base-shoutem-theme)', () => {
    expect(1).toEqual(1);
  });

  // ?   test('simple merge', () => {
  // ?     expect(applyAppState([feature1, feature2]))
  // ?       .toEqual({
  // ?         feature1: 'state-for-feature1',
  // ?         feature2: 'state-for-feature2',
  // ?       });
  // ?   });
  // ? 
  // ?   test('merge complex slices', () => {
  // ?     expect(applyAppState([feature1, feature3]))
  // ?       .toEqual({
  // ?         feature1: 'state-for-feature1',
  // ?         complex: {
  // ?           slice: {
  // ?             feature3: 'state-for-feature3',
  // ?           },
  // ?         },
  // ?       });
  // ?   });
  // ? 
  // ?   test('disabled feature', () => {
  // ?     expect(applyAppState([feature1, disabledFeature, feature2]))
  // ?       .toEqual({
  // ?         feature1: 'state-for-feature1',
  // ?         feature2: 'state-for-feature2',
  // ?       });
  // ?   });
  // ? 
  // ?   test('some features without state', () => {
  // ?     expect(applyAppState([feature1, featureWithoutState, feature2]))
  // ?       .toEqual({
  // ?         feature1: 'state-for-feature1',
  // ?         feature2: 'state-for-feature2',
  // ?       });
  // ?   });
  // ? 
  // ?   test('NO state in all features', () => {
  // ?     expect(applyAppState([featureWithoutState]))
  // ?       .toEqual(undefined);
  // ?   });
  // ? 
  // ? 
  // ?   test('Error detected for duplicate slices', () => {
  // ?     expect(()=>applyAppState([feature1, feature1]))
  // ?       .toThrow(/cannot be specified by multiple features/);
  // ?   });
  // ? 
  // ?   test('Error detected for duplicate intermediate slices', () => {
  // ?     expect(()=>applyAppState([feature4, feature3]))
  // ?       .toThrow(/cannot be specified by multiple features/);
  // ?   });
  // ? 
  // ?   test('Error detected for duplicate intermediate slices (in any order)', () => {
  // ?     expect(()=>applyAppState([feature3, feature4]))
  // ?       .toThrow(/cannot be specified by multiple features/);
  // ?   });
  // ? 
  // ?   test('Expected real-world case', () => {
  // ? 
  // ?     const manageViews = createFeature({
  // ?       name:    'manageViews',
  // ?       reducer: slicedReducer('views.curView',
  // ?                              (state='default-manageViews', action) => 'state-for-manageViews'),
  // ?     });
  // ? 
  // ?     const eateries = createFeature({
  // ?       name:    'eateries',
  // ?       reducer: slicedReducer('views.eateries',
  // ?                              (state='default-eateries', action) => 'state-for-eateries'),
  // ?     });
  // ? 
  // ?     const discovery = createFeature({
  // ?       name:    'discovery',
  // ?       reducer: slicedReducer('views.discovery',
  // ?                              (state='default-discovery', action) => 'state-for-discovery'),
  // ?     });
  // ? 
  // ?     expect(applyAppState([manageViews, eateries, discovery]))
  // ?       .toEqual({
  // ?         views: {
  // ?           curView:   'state-for-manageViews',
  // ?           eateries:  'state-for-eateries',
  // ?           discovery: 'state-for-discovery',
  // ?         },
  // ?       });
  // ?   });

});
