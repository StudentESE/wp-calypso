/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GoogleLoginButton from 'components/social-buttons/google';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import { getCurrentQueryArguments } from 'state/ui/selectors';
import { infoNotice, removeNotice } from 'state/notices/actions';
import { loginSocialUser, createSocialUser } from 'state/login/actions';
import {
	getCreatedSocialAccountUsername,
	getCreatedSocialAccountBearerToken,
	isSocialAccountCreating,
} from 'state/login/selectors';
import { recordTracksEvent } from 'state/analytics/actions';
import WpcomLoginForm from 'signup/wpcom-login-form';

class GlobalNotice extends Component {
	static propTypes = {
		displayNotice: PropTypes.func.isRequired,
		removeNotice: PropTypes.func.isRequired,
		text: PropTypes.string.isRequired,
	};

	componentWillMount() {
		const { notice } = this.props.displayNotice( this.props.text );
		this.notice = notice;
	}

	componentWillUnmount() {
		if ( this.notice ) {
			this.props.removeNotice( this.notice.noticeId );
		}
	}

	render() {
		return null;
	}
}

const InfoNotice = connect(
	null,
	{
		displayNotice: infoNotice,
		removeNotice,
	}
)( GlobalNotice );

class SocialLoginForm extends Component {
	static propTypes = {
		createSocialUser: PropTypes.func.isRequired,
		recordTracksEvent: PropTypes.func.isRequired,
		redirectTo: PropTypes.string,
		onSuccess: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		loginSocialUser: PropTypes.func.isRequired,
	};

	handleGoogleResponse = ( response ) => {
		const { onSuccess, redirectTo } = this.props;

		if ( ! response.Zi || ! response.Zi.id_token ) {
			return;
		}

		const recordEvent = ( eventName, params ) => this.props.recordTracksEvent( eventName, {
			social_account_type: 'google',
			...params
		} );

		this.props.loginSocialUser( 'google', response.Zi.id_token, redirectTo )
			.then(
				() => {
					recordEvent( 'calypso_social_login_form_login_success' );

					onSuccess();
				},
				error => {
					if ( error.code === 'unknown_user' ) {
						return this.props.createSocialUser( 'google', response.Zi.id_token, 'login' )
							.then(
								() => recordEvent( 'calypso_social_login_form_signup_success' ),
								createAccountError => recordEvent(
									'calypso_social_login_form_signup_fail',
									{ error: createAccountError.message }
								)
							);
					}

					recordEvent( 'calypso_social_login_form_login_fail', { error: error.message } );
				}
			);
	};

	trackGoogleLogin = () => {
		this.props.recordTracksEvent( 'calypso_login_social_button_click', {
			social_account_type: 'google'
		} );
	};

	render() {
		return (
			<div className="login__social">
				<p className="login__social-text">
					{ this.props.translate( 'Or log in with your existing social profile:' ) }
				</p>

				<div className="login__social-buttons">
					<GoogleLoginButton
						clientId={ config( 'google_oauth_client_id' ) }
						responseHandler={ this.handleGoogleResponse }
						onClick={ this.trackGoogleLogin } />
				</div>

				{ this.props.isSocialAccountCreating &&
					<InfoNotice text={ this.props.translate( 'Creating your account…' ) } />
				}

				{ this.props.bearerToken && (
					<WpcomLoginForm
						log={ this.props.username }
						authorization={ 'Bearer ' + this.props.bearerToken }
						redirectTo="/start"
					/>
				) }
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		redirectTo: getCurrentQueryArguments( state ).redirect_to,
		isSocialAccountCreating: isSocialAccountCreating( state ),
		bearerToken: getCreatedSocialAccountBearerToken( state ),
		username: getCreatedSocialAccountUsername( state ),
	} ),
	{
		loginSocialUser,
		createSocialUser,
		recordTracksEvent,
	}
)( localize( SocialLoginForm ) );
