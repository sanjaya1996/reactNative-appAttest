import React from 'react';
import {View, Text, StyleSheet, Button, NativeModules} from 'react-native';
const {AppCheckModule} = NativeModules;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, error: null, success: false};
  }

  // check connection
  checkConnection = () => {
    this.setState({loading: true, error: null, success: false});

    let appCheckToken = null;
    let error = null;

    AppCheckModule.getToken(
      token => (appCheckToken = token),
      err => (error = err),
    );

    if (error) {
      this.setState({loading: false, error});
      return;
    }

    fetch('http://localhost:5000', {
      method: 'GET',
      headers: {
        'X-Firebase-AppCheck': appCheckToken,
      },
    })
      .then(() => {
        this.setState({loading: false, success: true});
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false, error: error.message});
      });
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
        {success && <Text style={styles.success}>Succeeded</Text>}
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
