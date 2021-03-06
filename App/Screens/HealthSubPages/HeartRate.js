import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from "../../Components/CustomText";
import styles from '../Styles/Health';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TextInput from '../../Components/CustomTextInput';
import {emptyString} from '../../Common/Strings';
class HeartRate extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentDidMount () {
        this.props.onRef(this);
    }
    componentWillUnmount () {
        this.props.onRef(undefined);
    }

  _validate = () => {
      let heartRateNotesEmpty = this.state.heartRateNotesEmpty;
      isValid = true;
      if (!this.state.heartRateNotes) {
          isValid = false;
          heartRateNotesEmpty = true;
      }
      this.setState({
          heartRateNotesEmpty: heartRateNotesEmpty
      });
      return isValid;
  }

  _submit = (data) => {
      data.heart_rate = this.state.heartRate ? this.state.heartRate : emptyString;
      data.heart_rate_notes = this.state.heartRateNotes;

      return data;
  }


  render () {
      return (<View>
          {this.state.showHeartRate
              ?
              (
                  this.state.inputHeartRateInActive ?
                      <TouchableOpacity style={[styles.topLine, styles.flexRowFullWidth]} onPress={() => { this.setState({inputHeartRateInActive: false}); }}>
                          <Text style={[styles.notesThoughtText, {flex: 1}]}> Heart rate</Text>
                          <Text>{this.state.heartRate}</Text>
                          <Text>bpm</Text>

                      </TouchableOpacity>
                      :
                      <View style={[styles.topLineTextInput, styles.flexRowFullWidth]}>
                          <Text style={[styles.notesThoughtText]}> Heart rate</Text>
                          <TextInput
                              style={{marginHorizontal: 5, flex: 1}}
                              keyboardType="numeric"
                              placeholder="Type heart rate"
                              onChangeText={(text) => this.setState({heartRate: text})}
                              onSubmitEditing={() => { this.setState({inputHeartRateInActive: true}); }}
                              onEndEditing={() => { this.setState({inputHeartRateInActive: true}); }}
                          ></TextInput>
                          <Text>bpm</Text>

                      </View>
              )
              :
              <TouchableOpacity style={styles.topLine} onPress={() => this.setState({showHeartRate: true})}>
                  <View style={styles.flexRowFullWidth}>
                      <View style={styles.notesThoughtsView} >
                          <Text style={{color: '#394BF8'}}>+</Text>
                      </View>
                      <Text style={[styles.notesThoughtText]}> Heart rate</Text>

                  </View>
              </TouchableOpacity>

          }
          <View style={[styles.flexRowFullWidth, styles.topLineTextInput]}>
              <Ionicon style={{paddingRight: 10}} name="ios-document" color="#A7A7A7" size={20} />

              <TextInput
                  style={[{width: "100%"}]}
                  placeholder="Notes on heart rate..."
                  placeholderTextColor={this.state.heartRateNotesEmpty ? "red" : "grey"}
                  onChangeText={(text) => this.setState({heartRateNotes: text, heartRateNotesEmpty: false})}
                  value={this.state.heartRateNotes}

                  underlineColorAndroid='transparent' />
          </View>
      </View>);
  }
}

export default HeartRate;
