import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { EventDispatcher } from '../Actions';
import Text from '../Components/CustomText'
import TextInput from '../Components/CustomTextInput'
import TitleForm from '../Components/TitleForm';
import Navbar from '../Components/Navbar';
import MultiMood from '../Components/MultiMood';
import mainStyles from '../Themes/Styles';
import styles from './Styles/NightChecks';
import DateTimePicker from 'react-native-modal-datetime-picker';

class NightChecks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wearingPad: undefined,
      bedrailsUp: undefined,
      wokenUp: undefined,
      description: '',
      sleepTime: '00:00',
      moods: [],
      isDateTimePickerVisible: false,
      sleepTimeEmpty: false,
      wearingPadEmpty: false,
      bedrailsUpEmpty: false,
      wokenUpEmpty: false,
      descriptionEmpty: false,
      moodEmpty: false,
      isValid: true
    }
  }

  _handleDatePicked = (date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const hts = h < 10 ? '0' + h.toString() : h.toString();
    const mts = m < 10 ? '0' + m.toString() : m.toString();
    this.setState({sleepTime: `${hts}:${mts}`, sleepTimeEmpty: false, isDateTimePickerVisible: false});
  };

  _showAlert(){
    Alert.alert(
      'Please complete the required information',
      '',
      [{text: 'Close', onPress: () => this.setState({isValid: true})}]
    )
  }

  _validation(){
    let sleepTimeEmpty = this.state.sleepTimeEmpty;
    let wearingPadEmpty = this.state.wearingPadEmpty;
    let bedrailsUpEmpty = this.state.bedrailsUpEmpty;
    let wokenUpEmpty = this.state.wokenUpEmpty;
    let descriptionEmpty = this.state.descriptionEmpty;
    let moodEmpty = this.state.moodEmpty;
    let isValid = this.state.isValid;

    if(this.state.sleepTime === '00:00'){
      isValid = false;
      sleepTimeEmpty = true;
    }
    if(this.state.wearingPad === undefined){
      isValid = false;
      wearingPadEmpty = true;
    }
    if(this.state.bedrailsUp === undefined){
      isValid = false;
      bedrailsUpEmpty = true;
    }
    if(this.state.wokenUp === undefined){
      isValid = false;
      wokenUpEmpty = true;
    }
    if(!this.state.description){
      isValid = false;
      descriptionEmpty = true;
    }
    if(this.state.moods.length < 1){
      isValid=false;
      moodEmpty=true;
    }

    this.setState({
      isValid: isValid,
      sleepTimeEmpty: sleepTimeEmpty,
      wearingPadEmpty: wearingPadEmpty,
      bedrailsUpEmpty: bedrailsUpEmpty,
      wokenUpEmpty: wokenUpEmpty,
      descriptionEmpty: descriptionEmpty,
      moodEmpty: moodEmpty,
    })

    return isValid
  }

  _submitForm(){
    if(this._validation()){
      const { serviceUser, user_id } = this.props;
      const data = {
        'sleep_time' : this.state.sleepTime,
        'wearing_pad' : this.state.wearingPad,
        'bedrails_up' : this.state.bedrailsUp,
        'woken_up_during_night' : this.state.wokenUp,
        'woken_up_during_night_reason' : this.state.description,
        'mood_1': this.state.moods[0].id,
        'rating_1': this.state.moods[0].rating,
        'service_user': serviceUser.id,
        'created_by': user_id
      }

      if(this.state.moods.length > 1){
        data["mood_2"] = this.state.moods[1].id;
        data["rating_2"] = this.state.moods[1].rating;
      }

      this.props.submitNightCheck(data)
        .then((response) => {
          let data = response.postSuccess;
          if (data.error){
            Alert.alert(
              data.message,
              null,
              [{text: 'Close'}]
            )
          }else{
            const { navigate } = this.props.navigation;
            navigate('HomeScreen');
          }
        })
    }
  }

  _renderForm(){
    return (
      <View style={[mainStyles.mt20,mainStyles.prl20]}>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={[styles.inputTimeContainer]}
            onPress={() => this.setState({ isDateTimePickerVisible: true })}>
            <Text>SU went to sleep at</Text>
            <Text
              style={this.state.sleepTimeEmpty ? [styles.textInputTime, mainStyles.itemRequired] : styles.textInputTime}>{this.state.sleepTime}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
            titleIOS={'Pick a time'}
            is24Hour={true}
            mode={'time'}
            datePickerModeAndroid={'spinner'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={() => this.setState({ isDateTimePickerVisible: false })}/>
        <Text style={this.state.wearingPadEmpty ? [mainStyles.mt10, mainStyles.itemRequired] : mainStyles.mt10}>Is SU wearing a pad?</Text>
        <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
          <TouchableOpacity
            onPress={() => this.setState({wearingPad: false, wearingPadEmpty: false})}
            style={this.state.wearingPad === false ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.wearingPad === false ? styles.textActive : styles.textInActive}>No</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({wearingPad: true, wearingPadEmpty: false})}
            style={this.state.wearingPad === true ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.wearingPad === true ? styles.textActive : styles.textInActive}>Yes</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={this.state.bedrailsUpEmpty ? [mainStyles.mt10, mainStyles.itemRequired] : mainStyles.mt10}>Are bedrails up?</Text>
        <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
          <TouchableOpacity
            onPress={() => this.setState({bedrailsUp: false, bedrailsUpEmpty: false})}
            style={this.state.bedrailsUp === false ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.bedrailsUp === false ? styles.textActive : styles.textInActive}>No</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({bedrailsUp: true, bedrailsUpEmpty: false})}
            style={this.state.bedrailsUp === true ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.bedrailsUp === true ? styles.textActive : styles.textInActive}>Yes</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={this.state.wokenUpEmpty ? [mainStyles.mt10, mainStyles.itemRequired] : mainStyles.mt10}>Has SU woken up during the night?</Text>
        <View style={[styles.flexRow, styles.spaceAround, mainStyles.mt10]}>
          <TouchableOpacity
            onPress={() => this.setState({wokenUp: false, wokenUpEmpty: false})}
            style={this.state.wokenUp === false ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.wokenUp === false ? styles.textActive : styles.textInActive}>No</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({wokenUp: true, wokenUpEmpty: false})}
            style={this.state.wokenUp === true ? mainStyles.buttonActive : mainStyles.button}>
            <View style={styles.textContainer} >
              <Text style={this.state.wokenUp === true ? styles.textActive : styles.textInActive}>Yes</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TextInput
          style={this.state.descriptionEmpty ? [mainStyles.textInputForm, mainStyles.mt10, mainStyles.inputRequired] : [mainStyles.textInputForm, mainStyles.mt10]}
          placeholder="What did SU wake up for?"
          onChangeText={(text) => this.setState({description: text, descriptionEmpty: false})}
          value={this.state.description}
          underlineColorAndroid='transparent'/>
        <Text style={this.state.moodEmpty ? [mainStyles.mood, mainStyles.itemRequired] : mainStyles.mood}>SU mood is</Text>
        <MultiMood onPressMood={(moods) => this.setState({moods: moods, moodEmpty: false})} />
        <TouchableOpacity
          style={mainStyles.buttonSubmit}
          onPress={() => this._submitForm()}>
          <Text style={mainStyles.textSubmit}>SAVE NOTE</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={mainStyles.containerForm}>
        <ScrollView>
          {!this.state.isValid && this._showAlert()}
          <View style={mainStyles.card} >
            <Navbar appName="DAILY NOTES" backMenu="CategoryScreen" navigation={this.props.navigation} />
            <TitleForm menuID={5} style={mainStyles.mt10}/>
          </View>
          {this._renderForm()}
        </ScrollView>
      </View>
    )
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
}

export default connect(stateToProps, dispatchToProps)(NightChecks)
