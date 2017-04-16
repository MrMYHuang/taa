'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
    Text,
    Linking
} = ReactNative;

class HyperLink extends React.Component {
    render() {
        return (
            <Text style={styles.link} onPress={() => Linking.openURL(this.props.children)}>{this.props.children}</Text>
        );
    }
}

var styles = StyleSheet.create({
    link: {
        color: 'blue',
        textDecorationLine : 'underline'
    }
});

module.exports = HyperLink;
