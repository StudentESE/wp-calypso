/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import ExtendedHeader from 'woocommerce/components/extended-header';
import ShippingZoneMethodDialog from './shipping-zone-method-dialog';
import Spinner from 'components/spinner';
import { getMethodSummary } from './utils';
import { openShippingZoneMethod } from 'woocommerce/state/ui/shipping/zones/methods/actions';
import { getCurrentlyEditingShippingZoneMethods } from 'woocommerce/state/ui/shipping/zones/methods/selectors';

const ShippingZoneMethodList = ( { siteId, loaded, methods, translate, actions } ) => {
	const renderMethod = ( method, index ) => {
		const onEditClick = () => ( actions.openShippingZoneMethod( siteId, method.id ) );

		return (
			<div key={ index } className="shipping-zone__method-row">
				<span className="shipping-zone__method-name">
					{ method.title }
				</span>
				<span className="shipping-zone__method-description">
					{ getMethodSummary( method ) }
				</span>
				<span className="shipping-zone__method-actions">
					<Button compact onClick={ onEditClick }>{ translate( 'Edit' ) }</Button>
				</span>
			</div>
		);
	};

	const renderContent = () => {
		if ( ! loaded ) {
			return (
				<div className="shipping-zone__loading-spinner">
					<Spinner size={ 24 } />
				</div>
			);
		}

		return (
			<div>
				{ methods.map( renderMethod ) }
				<div className="shipping-zone__add-method-row">
					<Button>{ translate( 'Add method' ) }</Button>
				</div>
			</div>
		);
	};

	return (
		<div>
			<ExtendedHeader
				label={ translate( 'Shipping methods' ) }
				description={ translate( 'Any customers that reside in the locations' +
					' defined above will have access to these shipping methods' ) } />
			<Card>
				{ renderContent() }
			</Card>
			<ShippingZoneMethodDialog siteId={ siteId } />
		</div>
	);
};

ShippingZoneMethodList.propTypes = {
	siteId: PropTypes.number,
};

export default connect(
	( state ) => ( {
		methods: getCurrentlyEditingShippingZoneMethods( state )
	} ),
	( dispatch ) => ( {
		actions: bindActionCreators( {
			openShippingZoneMethod,
		}, dispatch )
	} )
)( localize( ShippingZoneMethodList ) );
