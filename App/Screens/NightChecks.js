import React, {Component} from 'react';
import {View, ScrollView, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {EventDispatcher} from '../Actions';
import Geolocation from '../Components/Geolocation';
import Text from '../Components/CustomText';
import TextInput from '../Components/CustomTextInput';
import TitleForm from '../Components/TitleForm';
import Navbar from '../Components/Navbar';
import MultiMood from '../Components/MultiMood';
import mainStyles from '../Themes/Styles';
import styles from './Styles/NightChecks';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Picker from '../Components/Picker';
import {Data} from '../Config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {emptyString, emptyTime} from '../Common/Strings';
import UrgencyFlag from '../Components/UrgencyFlag';
class NightChecks extends Component {
    constructor (props) {
        super(props);
        this.state = {
            notes: undefined,
            notesAndThoughtsEmpty: false,
            wearingPad: undefined,
            bedrailsUp: undefined,
            wokenUp: undefined,
            description: emptyString,
            sleepTime: emptyTime,
            moods: [],
            isDateTimePickerVisible: false,
            sleepTimeEmpty: false,
            wearingPadEmpty: false,
            bedrailsUpEmpty: false,
            wokenUpEmpty: false,
            descriptionEmpty: false,
            moodEmpty: false,
            isValid: true,
            location: [null, null],
            urgencyFlag: Data.urgencyFlags[0].value,
            bedTime: emptyTime,
            bedTimeEmpty: false,
            isBedTime: false
        };
    }
  componentDidMount = () => {
      AsyncStorage.setItem("IsReview", "False");
  }
  _handleDatePicked = (date) => {
      const h = date.getHours();
      const m = date.getMinutes();
      const hts = h < 10 ? '0' + h.toString() : h.toString();
      const mts = m < 10 ? '0' + m.toString() : m.toString();
      if(this.state.isBedTime) {
        this.setState({bedTime: `${hts}:${mts}`, bedTimeEmpty: false, isDateTimePickerVisible: false});
      } else {
        this.setState({sleepTime: `${hts}:${mts}`, sleepTimeEmpty: false, isDateTimePickerVisible: false});
      }
  };

  _showAlert () {
      Alert.alert(
          'Please complete the required information',
          emptyString,
          [{text: 'Close', onPress: () => this.setState({isValid: true})}]
      );
  }

  _getLocation = (loc) => {
      this.setState({location: loc});
  }

  _validation () {
      let sleepTimeEmpty = this.state.sleepTimeEmpty;
      let wearingPadEmpty = this.state.wearingPadEmpty;
      let bedrailsUpEmpty = this.state.bedrailsUpEmpty;
      let wokenUpEmpty = this.state.wokenUpEmpty;
      let descriptionEmpty = this.state.descriptionEmpty;
      let moodEmpty = this.state.moodEmpty;
      let isValid = this.state.isValid;
      let notesAndThoughtsEmpty = this.state.notesAndThoughtsEmpty;

      if (this.state.nightCheckType == Data.nightCheckChoices[0].value && this.state.wearingPad === undefined) {
          isValid = false;
          wearingPadEmpty = true;
      }
      if (this.state.nightCheckType == Data.nightCheckChoices[0].value && this.state.bedrailsUp === undefined) {
          isValid = false;
          bedrailsUpEmpty = true;
      }
      if (this.state.nightCheckType == Data.nightCheckChoices[1].value && this.state.wokenUp === undefined) {
          isValid = false;
          wokenUpEmpty = true;
      }
      if (this.state.nightCheckType == Data.nightCheckChoices[1].value && !this.state.description && this.state.wokenUp) {
          isValid = false;
          descriptionEmpty = true;
      }
      if (this.state.moods.length < 1) {
          isValid = false;
          moodEmpty = true;
      }
      if (this.state.notesAndThoughts && (this.state.notes == undefined || this.state.notes == emptyString)) {
          isValid = false;
          notesAndThoughtsEmpty = true;
      }
      this.setState({
          isValid: isValid,
          sleepTimeEmpty: sleepTimeEmpty,
          wearingPadEmpty: wearingPadEmpty,
          bedrailsUpEmpty: bedrailsUpEmpty,
          wokenUpEmpty: wokenUpEmpty,
          descriptionEmpty: descriptionEmpty,
          moodEmpty: moodEmpty,
          notesAndThoughtsEmpty: notesAndThoughtsEmpty,

      });

      return isValid;
  }

  _submitForm () {
      if (this._validation()) {
          const {serviceUser, user_id} = this.props;

          const data = {
              'urgency_flag': this.state.urgencyFlag,
              'night_check': this.state.nightCheckType,
              'sleep_time': this.state.sleepTime,
              'wearing_pad': this.state.wearingPad,
              'bedrails_up': this.state.bedrailsUp,
              'woken_up_during_night': this.state.wokenUp,
              'woken_up_during_night_reason': this.state.description ? this.state.description : "NOT_AWAKEN",
              'mood_1': this.state.moods[0].id,
              'rating_1': this.state.moods[0].rating,
              'service_user': serviceUser.id,
              'created_by': user_id,
              'location': this.state.location,
              'bed_time': this.state.bedTime
          };

          if (this.state.notesAndThoughts)
              data.notes_and_thoughts = this.state.notes;

          if (this.state.moods.length > 1) {
              data["mood_2"] = this.state.moods[1].id;
              data["rating_2"] = this.state.moods[1].rating;
          }
          keywords = [];
          keywords.wearingPad = this.state.wearingPad ? "was" : "was not";
          keywords.bedrailsUp = this.state.bedrailsUp ? "were" : "were not";
          keywords.wokenUp = this.state.wokenUp ? "did" : "did not";
          keywords.note = this.state.description;
          const {navigate} = this.props.navigation;
          let todoName = null;
          if (this.props.navigation.getParam('todoName')) {
            todoName = this.props.navigation.state.params.todoName;
          }
          data.name = todoName;
          AsyncStorage.getItem("IsReview").then((value) => {
              if (value == "True") {
                  navigate('NightCheckReviewScreen', {message: 'Night check', data, keywords});
              } else {
                  this.props.submitNightCheck(data)
                      .then((response) => {
                          if (response.type === "POST_SUCCESS") {

                              let dataResponse = response.postSuccess;
                              if (dataResponse.error) {
                                  Alert.alert(
                                      JSON.stringify(dataResponse.message),
                                      null,
                                      [{text: 'Close'}]
                                  );
                              } else {
                                  navigate('NightCheckReviewScreen', {message: 'Night check', data, keywords});
                                  AsyncStorage.setItem("ReviewID", dataResponse.id.toString());
                              }
                          } else {
                              navigate('NightCheckReviewScreen', {message: 'Night check', data, keywords, offline: true});
                          }
                      });
              }
          }).done();
      }
  }

  _renderForm () {
      return (
          <View>
              <View style={[mainStyles.prl20, mainStyles.mt20]}>
                  {
                      !this.state.nightCheckType && <Text>Is the SU going to bed or is this a night time check?</Text>
                  }
                  <Picker
                      style={[mainStyles.picker, {height: 50}]}
                      placeholder="Select night check"
                      hasShadow={true}
                      shadowColor="#0066FF"
                      data={Data.nightCheckChoices}
                      onPress={val => { this.setState({nightCheckType: val}); }}
                  />
              </View>
              {(this.state.nightCheckType == Data.nightCheckChoices[1].value) && this._renderNightCheck()}
              {(this.state.nightCheckType == Data.nightCheckChoices[0].value) && this._renderGoingToBed()}
          </View>
      );
  }

  _renderNightCheck () {
      return (
          <View style={[mainStyles.mt20, mainStyles.prl20]}>
              <View style={mainStyles.mt20}>
                  <Text style={this.state.wokenUpEmpty ? [mainStyles.mt10, mainStyles.itemRequired, mainStyles.textQuestion] : [mainStyles.mt10, mainStyles.textQuestion]}>
            Was SU awake?
                  </Text>
              </View>
              <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
                  <TouchableOpacity
                      onPress={() => this.setState({wokenUp: false, wokenUpEmpty: false})}
                      style={this.state.wokenUp === false ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.wokenUp === false ? styles.textActive : styles.textInActive}>No</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => this.setState({wokenUp: true, wokenUpEmpty: false})}
                      style={this.state.wokenUp === true ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.wokenUp === true ? styles.textActive : styles.textInActive}>Yes</Text>
                      </View>
                  </TouchableOpacity>
              </View>

              {this.state.wokenUp && <TextInput
                  style={this.state.descriptionEmpty ? [mainStyles.textInputForm, mainStyles.mt30, mainStyles.inputRequired] : [mainStyles.textInputForm, mainStyles.mt30]}
                  placeholder="What did SU wake up for?"
                  onChangeText={(text) => this.setState({description: text, descriptionEmpty: false})}
                  value={this.state.description}
                  underlineColorAndroid='transparent' />}
              <TouchableOpacity style={[mainStyles.notesThoughts, mainStyles.mt53]} onPress={() => this.setState({notesAndThoughts: !this.state.notesAndThoughts})}>
                  <Icon name="add-circle-outline" color="#0066FF" size={20} />

                  <Text style={mainStyles.notesThoughtText}> ADD NOTES AND THOUGHTS</Text>
              </TouchableOpacity>
              {this.state.notesAndThoughts &&
          (<View style={[mainStyles.mt20, mainStyles.mb20]}>
              <TextInput
                  style={[mainStyles.textInputForm, mainStyles.mt20]}
                  placeholder="Notes and thoughts"
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({notes: text, notesAndThoughtsEmpty: false})}
                  value={this.state.notes}

              />
          </View>)
              }
              <View style={mainStyles.mt20}>
                  <Text style={this.state.moodEmpty ? [mainStyles.mood, mainStyles.itemRequired] : mainStyles.mood}>SU mood is</Text>
                  <MultiMood onPressMood={(moods) => this.setState({moods: moods, moodEmpty: false})} />
                  <UrgencyFlag onChoose={(item) => this.setState({urgencyFlag: item})}></UrgencyFlag>
                  <TouchableOpacity
                      style={[mainStyles.buttonSubmit, mainStyles.mb20, mainStyles.mt20]}
                      onPress={() => this._submitForm()}>
                      <Text style={mainStyles.textSubmit}>Preview and save</Text>
                  </TouchableOpacity>
              </View>
          </View>
      );
  }

  _renderGoingToBed () {
      return (
          <View style={[mainStyles.mt20, mainStyles.prl20]}>
              <View style={[styles.timeContainer, mainStyles.mt20]}>
                  <TouchableOpacity
                      style={[styles.inputTimeContainer]}
                      onPress={() => this.setState({isBedTime: true, isDateTimePickerVisible: true})}>
                      <Text style={[mainStyles.textQuestion]}>
                            SU went to bed at
                      </Text>
                      <Text style={this.state.bedTimeEmpty ? [styles.textInputTime, mainStyles.itemRequired] : styles.textInputTime}>
                          {this.state.bedTime}
                      </Text>
                  </TouchableOpacity>
              </View>
              <View style={[styles.timeContainer, mainStyles.mt20]}>
                  <TouchableOpacity
                      style={[styles.inputTimeContainer]}
                      onPress={() => this.setState({isBedTime: false, isDateTimePickerVisible: true})}>
                      <Text style={[mainStyles.textQuestion]}>
              SU went to sleep at
                      </Text>
                      <Text style={this.state.sleepTimeEmpty ? [styles.textInputTime, mainStyles.itemRequired] : styles.textInputTime}>
                          {this.state.sleepTime}
                      </Text>
                  </TouchableOpacity>
              </View>
              <DateTimePicker
                  titleIOS={'Pick a time'}
                  is24Hour={true}
                  date={new Date(new Date().setHours(0, 0, 0, 0))}
                  mode={'time'}
                  datePickerModeAndroid={'spinner'}
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={() => this.setState({isDateTimePickerVisible: false})} />
              <View style={mainStyles.mt20}>
                  <Text style={this.state.wearingPadEmpty ? [mainStyles.mt10, mainStyles.itemRequired, mainStyles.textQuestion] : [mainStyles.mt10, mainStyles.textQuestion]}>
            Is SU wearing a pad?
                  </Text>
              </View>
              <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
                  <TouchableOpacity
                      onPress={() => this.setState({wearingPad: false, wearingPadEmpty: false})}
                      style={this.state.wearingPad === false ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.wearingPad === false ? styles.textActive : styles.buttonInActive}>No</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => this.setState({wearingPad: true, wearingPadEmpty: false})}
                      style={this.state.wearingPad === true ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.wearingPad === true ? styles.textActive : styles.textInActive}>Yes</Text>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={mainStyles.mt20}>
                  <Text style={this.state.bedrailsUpEmpty ? [mainStyles.mt10, mainStyles.itemRequired, mainStyles.textQuestion] : [mainStyles.mt10, mainStyles.textQuestion]}>
            Are bedrails up?
                  </Text>
              </View>
              <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
                  <TouchableOpacity
                      onPress={() => this.setState({bedrailsUp: false, bedrailsUpEmpty: false})}
                      style={this.state.bedrailsUp === false ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.bedrailsUp === false ? styles.textActive : styles.textInActive}>No</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => this.setState({bedrailsUp: true, bedrailsUpEmpty: false})}
                      style={this.state.bedrailsUp === true ? mainStyles.buttonActive : mainStyles.buttonInActive}>
                      <View style={styles.textContainer} >
                          <Text style={this.state.bedrailsUp === true ? styles.textActive : styles.textInActive}>Yes</Text>
                      </View>
                  </TouchableOpacity>
              </View>
              <TouchableOpacity style={[mainStyles.notesThoughts, mainStyles.mt53]} onPress={() => this.setState({notesAndThoughts: !this.state.notesAndThoughts})}>
                  <Icon name="add-circle-outline" color="#0066FF" size={20} />

                  <Text style={mainStyles.notesThoughtText}> ADD NOTES AND THOUGHTS</Text>
              </TouchableOpacity>
              {this.state.notesAndThoughts &&
          (<View style={[mainStyles.mt20, mainStyles.mb20]}>
              <TextInput
                  style={[mainStyles.textInputForm, mainStyles.mt20]}
                  placeholder="Notes and thoughts"
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({notes: text, notesAndThoughtsEmpty: false})}
                  value={this.state.notes}

              />
          </View>)
              }
              <View style={mainStyles.mt20}>
                  <Text style={this.state.moodEmpty ? [mainStyles.mood, mainStyles.itemRequired] : mainStyles.mood}>SU mood is</Text>
                  <MultiMood onPressMood={(moods) => this.setState({moods: moods, moodEmpty: false})} />
                  <UrgencyFlag onChoose={(item) => this.setState({urgencyFlag: item})}></UrgencyFlag>
                  <TouchableOpacity
                      style={[mainStyles.buttonSubmit, mainStyles.mb20, mainStyles.mt20]}
                      onPress={() => this._submitForm()}>
                      <Text style={mainStyles.textSubmit}>Preview and save</Text>
                  </TouchableOpacity>
              </View>
          </View>
      );
  }

  render () {
      return (
          <View style={mainStyles.containerForm}>
              <Geolocation onLocation={this._getLocation} />
              <ScrollView>
                  {!this.state.isValid && this._showAlert()}
                  <View style={mainStyles.card} >
                      <Navbar menuID={5} appName="DAILY NOTES" backMenu="CategoryScreen" navigation={this.props.navigation} />
                      <TitleForm menuID={5} style={mainStyles.mt10} />
                  </View>
                  {this._renderForm()}
              </ScrollView>
          </View>
      );
  }
}

const dispatchToProps = (dispatch) => ({
    submitNightCheck: (dataObj) => EventDispatcher.PostNightCheck(dataObj, dispatch),
});

const stateToProps = (state) => {
    return {
        serviceUser: state.serviceuser.user,
        user_id: state.login.user_id
    };
};

export default connect(stateToProps, dispatchToProps)(NightChecks);
