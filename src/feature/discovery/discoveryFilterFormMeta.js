import Yup        from 'yup';
import IFormMeta  from '../../util/iForms/IFormMeta';
import actions    from './actions';
import * as sel   from './state';

const distanceMsg = 'Miles should be a number between 1 and 30';
const minpriceMsg = 'Price should be a number between 0 and 4';

export default IFormMeta({
  formDesc:  'Discovery Filter',
  formSchema: Yup.object().shape({
    searchText: Yup.string().label('Search'),
    distance:   Yup.number().label('Miles').typeError(distanceMsg).required().min(1, distanceMsg).max(30, distanceMsg),
    minprice:   Yup.string().label('Price').typeError(minpriceMsg).required().matches(/[0-4]/, minpriceMsg),
  }),
  formActionsAccessor: ()         => actions.filter,
  formStateSelector:   (appState) => sel.getFormFilter(appState),
});
