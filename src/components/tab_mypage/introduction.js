import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {AppContext} from '../../store/context';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      content: props.route.params.text,
    };
  }

  onBack = () => {
    const {content} = this.state;
    const {onBack} = this.props.route.params;

    onBack(0, content);
    this.props.navigation.goBack();
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.onBack}>
          <Text style={styles.txt}>保存</Text>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const {content} = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          value={content}
          onChangeText={(text) => this.setState({content: text})}
          multiline={true}
          autoFocus={true}
          style={styles.txt_input}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(3),
  },
  txt: {
    fontSize: vw(4),
    lineHeight: vw(8),
    color: 'white',
    paddingHorizontal: vw(3),
  },
  txt_input: {
    flex: 1,
    fontSize: vw(4),
    lineHeight: vw(5),
    color: colors.text,
  },
});
