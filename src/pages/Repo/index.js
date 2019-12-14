import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const User = ({ navigation }) => {
  const repo = navigation.getParam('repo');

  return (
    <WebView
      startInLoadingState
      renderLoading={() => <ActivityIndicator color="#7159c1" size="large" />}
      source={{ uri: repo.html_url }}
    />
  );
};

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repo').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

export default User;
