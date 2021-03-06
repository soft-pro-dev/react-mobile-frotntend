import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    modal: {
        width: '70%',
        maxHeight: '60%',
        minHeight: '20%',
        borderRadius: 10,
        paddingBottom: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',

    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    image: {
        marginLeft: 5,
        width: 12,
        height: 8
    },
    doctorIcon: {
        height: 18,
        width:21
    },
    doctorButton: {
        flexDirection: "row",
        borderRadius: 30,
        height: 40,
        borderColor: "#E25C4D",
        borderWidth: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15
    },
    doctorButtonActive: {
        flexDirection: "row",
        borderRadius: 30,
        height: 40,
        borderColor: "#E25C4D",
        borderWidth: 1,
        backgroundColor:"#E25C4D",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15
    },
    doctorText: {
        color:"#E25C4D"
    },
    doctorTextActive: {
        color:"white"
    },
    buttonConfirmation: {
        alignSelf: "flex-end",
        marginBottom: 20
    },
    timePickerLine: {
        position: "absolute",
        borderBottomColor: "#595959",
        borderTopColor: "#595959",
        borderBottomWidth: 2,
        borderTopWidth: 2,
        height: 80,
        width: 75
    },

    inputRequired: {
        borderBottomWidth: 1,
        borderBottomColor: "red",
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
    },
    timePicker: {
        width: 40,
        backgroundColor: 'rgba(52, 52, 52, 0)',
        height: 200
    },

    flexRowFullWidth: {
        flex: 1,
        flexDirection: 'row',
        width: "100%",
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    icon: {
        paddingHorizontal: 5
    },
    topLine: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: "#DCDCDC",
        width: "100%",
    },
    topLineTextInput: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: "#DCDCDC",
        width: "100%",
    },
    textInputTime: {
        marginLeft: 5,
        color: 'grey',
        fontSize: 40
    },
    notesThoughts: {
        flex: 1,
        flexDirection: 'row',
        height: 80,
        marginHorizontal: -20,
        backgroundColor: '#FDFFC7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notesThoughtsView: {
        width: 20,
        height: 20,
        borderRadius: 12.5,
        borderColor: '#394BF8',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notesThoughtText: {
        color: '#B2B2B2',
        fontSize: 16,
        fontFamily: "WorkSans-SemiBold"
    },
});
