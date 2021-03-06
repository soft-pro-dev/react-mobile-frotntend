import React from 'react';
import {BackHandler, Platform} from 'react-native';
import {addNavigationHelpers} from 'react-navigation';
import {createReduxBoundAddListener} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';
import AppNavigation from './AppNavigation';
import {platforms} from '../Common/Strings';

class ReduxNavigation extends React.Component {
    UNSAFE_componentWillMount () {
        if (Platform.OS === platforms.ios) return;
        BackHandler.addEventListener('hardwareBackPress', () => {
            const {dispatch, nav} = this.props;
            // change to whatever is your first screen, otherwise unpredictable results may occur
            if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LoginScreen')) {
                return false;
            }
            // if (shouldCloseApp(nav)) return false
            dispatch({type: 'Navigation/BACK'});
            return true;
        });
    }

    componentWillUnmount () {
        if (Platform.OS === platforms.ios) return;
        BackHandler.removeEventListener('hardwareBackPress');
    }

    render () {
        return <AppNavigation navigation={addNavigationHelpers({dispatch: this.props.dispatch, state: this.props.nav, addListener: createReduxBoundAddListener('root')})} />;
    }
}

const mapStateToProps = state => ({nav: state.nav});
export default connect(mapStateToProps)(ReduxNavigation);
