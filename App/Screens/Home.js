
import React, { Component } from 'react';
import { View, FlatList, SectionList, Image, TouchableOpacity, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Data } from '../Config';
import { connect } from 'react-redux';
import { EventDispatcher } from '../Actions';
import Navbar from '../Components/Navbar';
import Text from '../Components/CustomText';
import AlertMessage from '../Components/AlertMessage';
import Postpone from '../Components/Postpone';
import Record from '../Components/Record';
import UserDropdown from '../Components/UserDropdown';
import styles from './Styles/Home';
import mainStyles from '../Themes/Styles.js';
import Fonts from '../Themes/Fonts';
import colors from '../Themes/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { emptyString } from '../Common/Strings';
import Actions from '../Redux/DailyRedux';
import Checkbox from '../Components/Checkbox';
import Moment from 'moment';
const fontSmall = Fonts.sizeConfig.tiny;
const getColorFromType = type => {

	switch (type) {
		case 'HM':
			return '#c7db3a'
		case 'PC':
			return '#7c8ce9'
		case 'MEDI':
			return '#e052e5'
		case 'ME':
			return '#f9c117'
		case 'NC':
			return '#366597'
		case 'LA':
			return '#55b9b2'
	}
}
const getImageFromType = type => {

	switch (type) {
		case 'HM':
			return require('../Images/Category/health_monitoring.png')
		case 'PC':
			return require('../Images/Category/personal_care.png')
		case 'MEDI':
			return require('../Images/Category/medications.png')
		case 'ME':
			return require('../Images/Category/meals.png')
		case 'NC':
			return require('../Images/Category/night_checks.png')
		case 'LA':
			return require('../Images/Category/leisure_activities.png')
	}
}
const getNavigateToFromType = type => {
	switch (type) {
		case 'HM':
			return 'HealthScreen'
		case 'PC':
			return 'PersonalCareScreen'
		case 'MEDI':
			return 'MedicationsScreen'
		case 'ME':
			return 'MealScreen'
		case 'NC':
			return 'NightChecksScreen'
		case 'LA':
			return 'ActivityScreen'
	}
}
const getNameFromType = type => {
	switch (type) {
		case 'HM':
			return "Health monitoring"
		case 'PC':
			return "Personal care"
		case 'MEDI':
			return "Medications"
		case 'ME':
			return "Meal"
		case 'NC':
			return "Night checks"
		case 'LA':
			return "Leisure activity"
	}
}

const getBorderStyle = (starttime, isborder) => {
	let date = new Date();
	let currentTime = date.getHours() + ":" + date.getMinutes();
	let timeNow = Number(currentTime.split(':')[0]) * 60 * 60 * 1000 + Number(currentTime.split(':')[1]) * 60 * 1000;
	let time = Number(starttime.split(':')[0]) * 60 * 60 * 1000 + Number(starttime.split(':')[1]) * 60 * 1000;
	if((timeNow - time) > 1800000) {
		return '#FDB046';
	} else {
		if(isborder)
			return '#F5F5F5';
		else
		return '#000';
	}
}


const FirstRoute = ({ data, _onLongPress, _onPressMenu, active }) => {

	return data && data.length > 0 ?
		<FlatList
			data={data}
			renderItem={({ item }) =>
				<View elevation={1}>
					{
						<View style={[style.sectionList, { borderColor: getBorderStyle(item.start_time, true), borderWidth:2, borderRadius: 5 }]}>
							<View style={style.timeContainer}>
								<Text style={[style.timeInActive, { color: getBorderStyle(item.start_time, false) }]}>{item.start_time.substr(0, 5).replace(":", ".")}</Text>
							</View>
							<View style={[style.menuContainer, { marginLeft: 1 }]}>
								<TouchableOpacity
									style={style.buttonContainer}
									onPress={() => _onPressMenu(getNavigateToFromType(item.type_of), item)}>
									<View style={[style.buttonImage, { backgroundColor: getColorFromType(item.type_of) }]}>
										<Image style={style.image} source={getImageFromType(item.type_of)} />
									</View>
									<Text
										style={styles.buttonText}>{getNameFromType(item.type_of)}</Text>
								</TouchableOpacity>
							</View>
						</View>
					}
				</View>
			}
			keyExtractor={(item, index) => index}
		/>
		:
		<View></View>
}

const SecondRoute = ({ data, notesDate, checkBox}) => {
	return data && data.length > 0 ?
	<View>
		<SectionList
			sections={data}
			renderItem={({ item }) =>
				<View elevation={1}>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', marginBottom: 1 }}>							
							<View style={style.completedTimeContainer}>
								<Text style={(item.active) ? style.timeActive : style.timeInActive}>{item.time}</Text>
							</View>
							<View style={style.menuContainer}>
								<View
									style={style.completedButtonContainer}
									onPress={() => this._onPressMenu(item)}>
									<View style={[style.buttonSection2Image, { backgroundColor: item.color }]}>
										<Image style={style.image} source={item.image} />
									</View>
									<Text style={styles.buttonText}>{item.name}</Text>

								</View>
							</View>
						</View>
						<View style={{ backgroundColor: '#fff', marginBottom: 15, padding: 15, elevation: 1 }}>
							<Text style={[styles.buttonText, { fontSize: 14 }]}>{item.full_description.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
						</View>
					</View>
				</View>
			}
			keyExtractor={(item, index) => index}
			renderSectionHeader={({ section: { title } }) => (
				<Text style={styles.dateText}>{title}</Text>
			)}
		/>
	</View>
	:
	<View></View>
	
};

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			routes: [
				{ key: 'first', title: 'To-do' },
				{ key: 'second', title: 'Past notes' },
			],
			serviceUsers: undefined,
			serviceUser: undefined,
			message: emptyString,
			active: emptyString,
			noteChecked: false,
			notesMessage: false,
			pastNotes: [],
			pastNoteDate: ''
		};

		this.image = require('../Images/normal_1person-(porawee)_mamnul.png');
		this.place = require('../Images/Icons/icon-place.png');
		this.takeNote = require('../Images/Icons/icon-playlist.png');
		this.checkBox = require('../Images/Icons/icon-check-box.png');
		this.clock = require('../Images/Icons/icon-clock-active.png');
		this.profile = require('../Images/Profile/profile.png');
	}

	componentDidMount() {
		const { serviceUsers, serviceUser } = this.props;
		this.setState({ serviceUsers: serviceUsers, serviceUser: serviceUser });
		this.props.fetchCalendar(serviceUser)
		this.getPastNotes();
		if (this.props.navigation.getParam('showNotesMessage')) {
			this.setState({
				notesMessage: this.props.navigation.getParam('showNotesMessage')
			})
		}
		if (this.props.navigation.getParam('updateDate')) {
			AsyncStorage.setItem("lastNotedSaved", new Date());
		}
		let self = this;
		setInterval(() => {
			self._showNoteMessage();
		}, 10000);
	}

	getPastNotes() {
		this.props.fetchPastNotes(this.props.serviceUser)
		.then(async (response) => {
			if (response.type === "FETCH_PAST_NOTES") {
				let data = [], noteDate = '';
				response.pastNotes.forEach(note => {
					let isAdded = false;		
					noteDate =  Moment(note.created_on).format('DD MMM')
					data.forEach(addedNote => {
						if(Moment(addedNote.dateAdded).isSame(note.created_on, 'day')) {
							isAdded = true;
						}
					});	
					if(!isAdded) {
						let items = this.groupNotes(response.pastNotes, note.created_on);
						data.push({title: noteDate, data: items, dateAdded: note.created_on});
					}
				});
				this.setState({ pastNotes: data, pastNoteDate: noteDate});
			}
		});
	}

	groupNotes(data, dateG) {
		let items = [];
		data.forEach(note => {
			noteDate =  Moment(note.created_on).format('DD MMM');			
			if(Moment(dateG).isSame(note.created_on, 'day')) {
				let names = note.name.split(' ');
				let type_of = '';
				names.forEach(type=>{
					type_of += type.charAt(0);
				})
				type_of = type_of.toUpperCase();
				let item = {
					'name': note.name,
					'time': Moment(note.created_on).format('H:mm'),
					'color': getColorFromType(type_of),
					'completed': false,
					'active': false,
					'navigate': getNavigateToFromType(type_of),
					'image': getImageFromType(type_of),
					'full_description': note.full_description
				};
				items.push(item);
			}
		});
		return items;
	}

	_showNoteMessage() {
		AsyncStorage.getItem("lastNotedSaved").then((value) => {
			if (value && _dateDiff(value) > 8) {
				this.setState({
					notesMessage: true
				})
			}
		});
	}

	_dateDiff(noteTime) {
		let currentTime = new Date();
		let diff =(currentTime.getTime() - noteTime.getTime()) / 1000;
		diff /= (60 * 60);
		return Math.abs(Math.round(diff));
	}
	_userCategory() {
		const { navigate } = this.props.navigation;
		navigate('CategoryScreen');
	}

	_onPressMenu = (navigateTo, infoscreen) => {
		const { navigate } = this.props.navigation;
		if (navigateTo) {
			navigate(navigateTo, {todoName: infoscreen.name});
		}
	}

	handlerLongClick = (name) => {
		this.setState({ active: name });
	};

	_onPressUser(item) {
		const { updateUser } = this.props
		this.setState({ serviceUser: item })
		updateUser(item)
		this.props.cleanCalendar()
		this.props.fetchCalendar(item);
		setTimeout(()=>{
			this.getPastNotes();
		}, 100);		
	}

	_truncated(text) {
		return text.length > 18 ? `${text.substr(0, 18)}...` : text;
	}

	_onPressHandoverNote() {
		this.setState({
			notesMessage: false
		});
		AsyncStorage.getItem("lastNotedSaved").then((value) => {
			if (value) {
				AsyncStorage.setItem("lastNotedSaved", new Date());
			}
		});
	}

	render() {

		if (!this.state.serviceUser) {
			return (<View></View>);
		} else {
			const _fullName = this._truncated(`${this.state.serviceUser.first_name} ${this.state.serviceUser.last_name}`);
			const { navigation } = this.props;
			const msg = navigation.getParam('message', emptyString);
			console.log("ooooo" + JSON.stringify(this.props.calendar))
			return (
				
				<View style={[styles.container, { backgroundColor: '#fff' }]}>
					{
					   this.state.notesMessage &&
						<TouchableOpacity
							style={this.props.style}
							onPress={() => this._onPressHandoverNote()}>													
							<View style={mainStyles.mt50p}>
								<View style={this.state.noteChecked ? mainStyles.buttonRoundActive : mainStyles.buttonRoundInActive}>
									<View style={[styles.picker, styles.panelConsent]}>
										<Checkbox title="Have you seen handover notes yet?" isRedText="true" checked={this.state.noteChecked} onPress={() => this._onPressHandoverNote()}/>
									</View>
								</View>	
								<View style={styles.panelConsent}>
									<Text style={styles.text}>DON'T PROCEED BEFORE READING HANDOVER NOTE IN THEHUB</Text>
								</View>
							</View>
						</TouchableOpacity>
					}
					{
						!this.state.notesMessage &&
						<AlertMessage message={msg} />
					}
					{
						!this.state.notesMessage &&	
						<View style={mainStyles.card} elevation={5}>
							<Navbar showAppName={true} appName="DAILY NOTES" style={styles.appName} navigation={this.props.navigation} />
							{
								!this.props.is_SU &&
								<View style={styles.profile}>
									<View style={styles.profileDetail}>
										{
											this.state.serviceUser.portrait_photo ?
												<Image style={styles.profileImage} source={{ uri: this.state.serviceUser.portrait_photo }} />
												:
												<Image style={styles.profileImage} source={this.profile} />
										}
										<View>
											<Text style={styles.profileName}>
												{_fullName}
											</Text>
											<View style={styles.profileDetail}>
												<Image style={styles.placeIcon} source={this.place} />
												<Text style={styles.profileAddr}>{this.state.serviceUser.address}</Text>
											</View>
										</View>
									</View>
									<UserDropdown
										data={this.state.serviceUsers}
										onPress={(item) => this._onPressUser(item)}
									/>
								</View>
							}
						</View>		
					}			
					{
						!this.state.notesMessage &&						
						<View style={[styles.takeNote, { backgroundColor: '#56dccd' }]}>
								<TouchableOpacity style={style.buttonTakeNote} onPress={() => this._userCategory()}>
									<Icon name="add-circle-outline" color="white" size={30} />
									<Text style={styles.takeNoteText}>TAKE NOTE</Text>
								</TouchableOpacity>
							</View>
					}
					{
						!this.state.notesMessage &&
						<View style={style.schedule}>
							{
								!this.props.is_SU
									?
									<TabView
										navigationState={this.state}
										renderScene={({ route }) => {
											switch (route.key) {
												case 'first':
													return <FirstRoute data={this.props.calendar} _onLongPress={this.handlerLongClick} _onPressMenu={this._onPressMenu} active={this.state.active} />
												case 'second':
													return <SecondRoute data={this.state.pastNotes} notesDate={this.state.pastNoteDate} checkBox={this.checkBox}  />;
												case 'default':
													return null;
											}
										}}
										getLabelText={() => { return "sdf"; }}

										onIndexChange={index => this.setState({ index })}
										initialLayout={{ width: Dimensions.get('window').width }}
										renderTabBar={props =>
											<TabBar
												{...props}
												getLabelText={({ route }) => { return route.title; }}

												indicatorStyle={{ backgroundColor: '#446ffe' }}
												labelStyle={{
													fontSize: 16, fontFamily: 'WorkSans-Bold',
													justifyContent: 'center', alignItems: 'center', color: '#000'
												}}
												style={{ backgroundColor: colors.primary, padding: 5, marginBottom: 10 }}
												tabStyle={{ backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}
											/>
										}
									/>
									:
									<View>
										<Text style={{
											fontSize: 16, fontFamily: 'WorkSans-Bold',
											textAlign: 'center', color: '#000', paddingVertical: 20
										}}>To-do</Text>
										<FirstRoute data={this.props.calendar} _onLongPress={this.handlerLongClick} _onPressMenu={this._onPressMenu} active={this.state.active} />
									</View>
							}
							</View>
					}
				</View>
			);
		}
	}
}

const dispatchToProps = (dispatch) => ({
	updateUser: (user) => EventDispatcher.UpdateUser(user, dispatch),
	cleanCalendar: () => Actions.cleanCalendar(dispatch),
	fetchCalendar: serviceUser => EventDispatcher.FetchCalendar(serviceUser, dispatch),
	fetchPastNotes: serviceUser => EventDispatcher.FetchPastNotes(serviceUser, dispatch),
});

const stateToProps = (state) => {
	return {
		serviceUsers: state.serviceuser.results,
		serviceUser: state.serviceuser.user,
		is_SU: state.login.is_SU,
		calendar: state.daily.calendar
	};
};

export default connect(stateToProps, dispatchToProps)(Home);

const style = StyleSheet.create({
	schedule: {
		flex: 1,
		backgroundColor: colors.primary,
		paddingHorizontal: 20,
	},
	sectionList: {
		marginBottom: 10,
		flexDirection: 'row',
	},
	menuContainer: {
		flex: 1,
	},
	completedButtonContainer: {
		backgroundColor: '#FFF',
		display: 'flex',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5
	},
	buttonContainer: {
		backgroundColor: '#FFF',
		display: 'flex',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 5
	},
	timeContainer: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 5
	},
	completedTimeContainer: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5
	},
	timeActive: {
		color: 'red',
		fontSize: fontSmall,
		fontFamily: "WorkSans-SemiBold"
	},
	timeInActive: {
		fontSize: fontSmall,
		color: 'grey',
		fontFamily: "WorkSans-SemiBold"
	},
	disable: {
		backgroundColor: '#e4e4e4'
	},
	buttonImage: {
		height: 35,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10
	},
	buttonSection2Image: {
		height: 25,
		width: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		marginLeft: 10,
		textAlign: 'left',
		color: '#000',
		fontSize: 18
	},
	checkboxImage: {
		marginLeft: 'auto',
		height: 20,
		width: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		height: 15,
		width: 15
	},
	buttonTakeNote: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 45,
		paddingRight: 45,
		borderWidth: 1,
		borderColor: '#56dccd',
		borderRadius: 35,
		elevation: 15,
		backgroundColor: '#56dccd',
		shadowOffset: { x: 0, y: 1 },
		shadowColor: '#000000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		padding: 0,
	},
	dateText: {
		fontSize: 16,
		color: 'grey',
		marginBottom: 5,
		fontFamily: "WorkSans-Regular"
	}
});
