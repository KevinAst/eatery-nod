import createFeature     from '../createFeature';
import shapedReducer     from '../shapedReducer';
import {accumAppReducer} from '../runApp'; // function under test

const anyAction = {type: 'any'};

function applyAppState(features) {
  // accumulate our top-level app state reducer
  // ... function under test
  appReducerFn = accumAppReducer(features);

  // return the appStat from running the reducer
  appState = appReducerFn(undefined, anyAction);
  return appState;
}

const feature1 = createFeature({
  name:    'feature1',
  reducer: (state='default-feature1', action) => 'state-for-feature1',
});

const feature2 = createFeature({
  name:    'feature2',
  reducer: (state='default-feature2', action) => 'state-for-feature2',
});

const feature3 = createFeature({
  name:    'feature3',
  reducer: shapedReducer((state='default-feature3', action) => 'state-for-feature3', 
                         'complex.shape.feature3'),
});

const feature4 = createFeature({
  name:    'feature4',
  reducer: shapedReducer((state='default-feature4', action) => 'state-for-feature4', 
                         'complex.shape'), // is an intermediate duplicate from feature3
});

const disabledFeature = createFeature({
  name:    'disabledFeature',
  enabled: false,
  reducer: (state='default-disabledFeature', action) => 'state-for-disabledFeature',
});

const featureWithoutState = createFeature({
  name: 'featureWithoutState',
});

describe('feature-u accumAppReducer() tests', () => {

  test('simple merge', () => {
    expect(applyAppState([feature1, feature2]))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });

  test('merge complex shapes', () => {
    expect(applyAppState([feature1, feature3]))
      .toEqual({
        feature1: 'state-for-feature1',
        complex: {
          shape: {
            feature3: 'state-for-feature3',
          },
        },
      });
  });

  test('disabled feature', () => {
    expect(applyAppState([feature1, disabledFeature, feature2]))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });

  test('some features without state', () => {
    expect(applyAppState([feature1, featureWithoutState, feature2]))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });

  test('NO state in all features', () => {
    expect(applyAppState([featureWithoutState]))
      .toEqual(undefined);
  });


  test('Error detected for duplicate shapes', () => {
    expect(()=>applyAppState([feature1, feature1]))
      .toThrow(/cannot be specified by multiple features/);
  });

  test('Error detected for duplicate intermediate shapes', () => {
    expect(()=>applyAppState([feature4, feature3]))
      .toThrow(/cannot be specified by multiple features/);
  });

  test('Error detected for duplicate intermediate shapes (in any order)', () => {
    expect(()=>applyAppState([feature3, feature4]))
      .toThrow(/cannot be specified by multiple features/);
  });

  test('Expected real-world case', () => {

    const manageViews = createFeature({
      name:    'manageViews',
      reducer: shapedReducer((state='default-manageViews', action) => 'state-for-manageViews', 
                             'views.curView'),
    });

    const eateries = createFeature({
      name:    'eateries',
      reducer: shapedReducer((state='default-eateries', action) => 'state-for-eateries', 
                             'views.eateries'),
    });

    const discovery = createFeature({
      name:    'discovery',
      reducer: shapedReducer((state='default-discovery', action) => 'state-for-discovery', 
                             'views.discovery'),
    });

    expect(applyAppState([manageViews, eateries, discovery]))
      .toEqual({
        views: {
          curView:   'state-for-manageViews',
          eateries:  'state-for-eateries',
          discovery: 'state-for-discovery',
        },
      });
  });

});
