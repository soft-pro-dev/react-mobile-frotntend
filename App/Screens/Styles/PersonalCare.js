import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    subContainer: {
        flex: 0,
        flexDirection: 'row',
        marginBottom: 0,
        marginTop: 20,
        justifyContent: 'space-between'
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
    },
    flexWrap: {
        paddingTop: 10,
        flexWrap: 'wrap'
    },
    spaceAround: {
        justifyContent: 'space-around'
    },
    textActive: {
        color: '#0066FF'
    },
    textInactive: {
        color: '#ccc'
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});
