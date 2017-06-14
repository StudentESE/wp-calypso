/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_SET_TAXABLE,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_SET_COST,
} from 'woocommerce/state/action-types';

const initialState = {
	tax_status: 'None',
	cost: 0,
};

const reducer = {};

reducer[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_SET_TAXABLE ] = ( state, { isTaxable } ) => {
	return { ...state,
		tax_status: isTaxable ? 'Taxable' : 'None',
	};
};

reducer[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_SET_COST ] = ( state, { cost } ) => {
	return { ...state,
		cost,
	};
};

export default createReducer( initialState, reducer );
