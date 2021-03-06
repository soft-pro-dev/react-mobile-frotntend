import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from "../../Components/CustomText";
import styles from '../Styles/Health';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TextInput from '../../Components/CustomTextInput';
import {emptyString} from '../../Common/Strings';
class FootCheck extends Component {
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
      let reasonTreatmentFootEmpty = this.state.reasonTreatmentFootEmpty;
      isValid = true;
      if (!this.state.reasonTreatmentFoot) {
          isValid = false;
          reasonTreatmentFootEmpty = true;
      }
      this.setState({
          reasonTreatmentFootEmpty: reasonTreatmentFootEmpty
      });
      return isValid;
  }

  _submit = (data) => {
      data.weight_foot = this.state.weightFoot ? this.state.weightFoot : emptyString;
      data.treatment_foot = this.state.treatmentFoot ? this.state.treatmentFoot : emptyString;
      data.reason_treatment_foot = this.state.reasonTreatmentFoot;

      return data;
  }


  render () {
      return (<View>
          {this.state.showweightFoot
              ?
              (
                  this.state.inputWeightInActive ?
                      <TouchableOpacity style={[styles.topLine, styles.flexRowFullWidth]} onPress={() => { this.setState({inputWeightInActive: false}); }}>
                          <Text style={[styles.notesThoughtText, {flex: 1}]}> Weight</Text>
                          <Text>{this.state.weightFoot}</Text>
                          <Text>kg</Text>

                      </TouchableOpacity>
                      :
                      <View style={[styles.topLineTextInput, styles.flexRowFullWidth]}>
                          <Text style={[styles.notesThoughtText]}> Weight</Text>
                          <TextInput
                              style={{marginHorizontal: 5, flex: 1}}
                              keyboardType="numeric"
                              placeholder="Type weight"
                              onChangeText={(text) => this.setState({weightFoot: text})}
                              onSubmitEditing={() => { this.setState({inputWeightInActive: true}); }}
                              onEndEditing={() => { this.setState({inputWeightInActive: true}); }}
                          ></TextInput>
                          <Text>kg</Text>

                      </View>
              )

              :
              <TouchableOpacity style={styles.topLine} onPress={() => this.setState({showweightFoot: true})}>
                  <View style={styles.flexRowFullWidth}>
                      <View style={styles.notesThoughtsView} >
                          <Text style={{color: '#394BF8'}}>+</Text>
                      </View>
                      <Text style={[styles.notesThoughtText]}> Weight</Text>

                  </View>
              </TouchableOpacity>

          }

          {this.state.showTreatmentFoot ?
              (< View style={[styles.flexRowFullWidth, styles.topLineTextInput]}>
                  <TextInput
                      style={{marginHorizontal: 5, width: "100%"}}
                      multiline={true}
                      placeholder="Treatment outcome"
                      onChangeText={(text) => this.setState({treatmentFoot: text})}
                  />
              </View>)
              :
              <TouchableOpacity style={styles.topLine} onPress={() => this.setState({showTreatmentFoot: true})}>
                  <View style={[styles.flexRowFullWidth]}>
                      <View style={styles.notesThoughtsView} >
                          <Text style={{color: '#394BF8'}}>+</Text>
                      </View>
                      <Text style={[styles.notesThoughtText]}> Treatment outcome</Text>

                  </View>
              </TouchableOpacity>
          }
          < View style={[styles.flexRowFullWidth, styles.topLineTextInput]}>
              <Ionicon style={{paddingRight: 10}} name="ios-document" color="#A7A7A7" size={20} />

              <TextInput
                  style={[{width: "100%"}]}
                  placeholderTextColor={this.state.reasonTreatmentFootEmpty ? "red" : "grey"}
                  placeholder="Reason for treatment"
                  onChangeText={(text) => this.setState({reasonTreatmentFoot: text, reasonTreatmentFootEmpty: false})}
                  value={this.state.reasonTreatmentFoot}
                  underlineColorAndroid='transparent' />
          </View>
      </View>);
  }
}

export default FootCheck;
