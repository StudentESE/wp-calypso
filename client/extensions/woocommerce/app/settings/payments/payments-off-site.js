/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ExtendedHeader from 'woocommerce/components/extended-header';
import PaymentMethodList from './payment-method-list';

class SettingsPaymentsOnSite extends Component {

	render() {
		const { translate } = this.props;

		return (
			<div className="payments__type-container">
				<ExtendedHeader
					label={ translate( 'Off-site credit card payment methods' ) }
					description={
						translate(
							'Send customers to a third party web site ' +
							'to complete payment, like PayPal. '
						)
					} />
					<PaymentMethodList methodType="off-site" />
			</div>
		);
	}
}

export default localize( SettingsPaymentsOnSite );
