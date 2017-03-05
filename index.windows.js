/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule MoviesApp
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  View,
} = ReactNative;
import codePush from "react-native-code-push";

var MovieScreen = require('./MovieScreen');
var SearchScreen = require('./SearchScreen');
var TitleBarWindows = require('./TitleBarWindows');
var About = require('./About');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'search') {
    return (
      <SearchScreen navigator={navigationOperations} />
    );
  }
  else if (route.name === 'about') {
    return (
      <View style={{flex: 1}}>
        <TitleBarWindows
          onPress={navigationOperations.pop}
          style={styles.toolbar}
          title={"關於"} />
        <About
          style={{flex: 1}}
          navigator={navigationOperations}
          movie={route.movie}
        />
      </View>
      )
  }
  else if (route.name === 'movie') {
    return (
      <View style={{flex: 1}}>
        <TitleBarWindows
          onPress={navigationOperations.pop}
          style={styles.toolbar}
          title={route.movie.title} />
        <MovieScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          movie={route.movie}
        />
      </View>
    );
  }
};

var MoviesApp = React.createClass({
  render: function() {
    var initialRoute = {name: 'search'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
MoviesApp = codePush(codePushOptions)(MoviesApp);
AppRegistry.registerComponent('taa', () => MoviesApp);

module.exports = MoviesApp;
