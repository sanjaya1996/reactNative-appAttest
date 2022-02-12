import React from 'react';
import {View, Text, StyleSheet, Button, NativeModules} from 'react-native';
const {AppCheckModule} = NativeModules;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, error: null, success: false};
  }

  authenticate = async appCheckToken => {
    try {
      const res = await fetch('http://192.168.8.112:5000/authenticate', {
        method: 'GET',
        headers: {
          'X-Firebase-AppCheck': appCheckToken,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Status: 401, User Unauthorized');
        } else {
          throw new Error(`Status: ${res.status}`);
        }
      }

      this.setState({loading: false, success: true});
    } catch (err) {
      this.setState({loading: false, error: err.message});
    }
  };

  // check connection
  checkConnection = () => {
    this.setState({loading: true, error: null, success: false});

    AppCheckModule.getToken(
      token => this.authenticate(token),
      err => this.setState({loading: false, error: err}),
    );
  };

  // render the app screen
  render() {
    const {error, loading, success} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{fontSize: 24}}>App Check Status:</Text>
        </View>
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>App is verified</Text>}
        <View style={styles.footer}>
          <View style={styles.buttonBar}>
            <Button onPress={this.checkConnection} title="Check app" />
          </View>
        </View>
      </View>
    );
  }
}

// flexbox styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    margin: 10,
    alignItems: 'center',
  },
  header: {
    padding: 24,
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
  buttonBar: {
    padding: 24,
  },
});
