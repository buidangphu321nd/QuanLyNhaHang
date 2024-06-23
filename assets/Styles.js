
import { StyleSheet, Platform, Dimensions, PixelRatio} from 'react-native';
import {MARGIN_BOTTOM, MARGIN_TOP} from "../config/Const";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
    return Math.round(size * scale);
}



const styles = StyleSheet.create({
    bgColor: {
        backgroundColor: '#fff',
    },

    bgColorSub: {
        backgroundColor: '#f1f1f1',
    },

    center:{
        alignItems:'center',
        justifyContent:'center'
    },

    textCenter:{
        textAlign:'center'
    },

    textBold:{
        // fontSize: 14,
        // color:'#242424',
//         fontWeight: '700',
        // fontFamily: "OpenSans-Semibold",
        fontFamily: "Inter-Bold",
    },

    textSemiBold:{
        // fontSize: 14,
        // color:'#242424',
//        fontWeight: '600',
        // fontFamily: "OpenSans-Semibold",
        fontFamily: "Inter-SemiBold",
    },

    textMedium:{
        fontWeight: '500',
        fontFamily: "Inter-Medium"
    },

    textNormal:{
        fontSize: normalize(14),
        lineHeight: normalize(18),
        fontFamily: "Inter-Regular",
        // fontFamily: "OpenSans-Regular",
        backgroundColor:'transparent',
//        fontWeight: '600',
        color: '#292929',
        // lineHeight: normalize(14) + 12,
    },

    textSmall:{
        fontSize: normalize(12),
    },

    textSuperSmall:{
        fontSize: normalize(10),
    },

    textLarge:{
        fontSize: normalize(16),
        lineHeight: normalize(22),
    },
    textBig:{
        fontSize: normalize(18),
    },
    textSuperBig:{
        fontSize: normalize(22),
    },

    textLight:{
        // fontFamily: "OpenSans-Light",
    },

    textRegular:{
        // fontFamily: "OpenSans-Regular",
    },

    textUnderline: {
        textDecorationLine: 'underline'
    },

    textItalic: {
        fontStyle: 'italic'
    },

    textWrap:{
        flexWrap: 'wrap'
    },

    borderBottom:{
        borderBottomWidth: 0.5,
        borderColor: '#dedede'
    },

    borderTop:{
        borderTopWidth: 0.5,
        borderColor: '#dedede'
    },

    borderLeft:{
        borderLeftWidth: 0.5,
        borderColor: '#dedede'
    },

    borderRight:{
        borderRightWidth: 0.5,
        borderColor: '#dedede'
    },

    border:{
        borderWidth: 0.5,
        borderColor: '#dedede'
    },

    borderRadius: {
        borderRadius: 8
    },

    shadow: Platform.select({
        'ios': {
            shadowColor: '#aaa',
            shadowOffset: { width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 2
        },
        'android': {
            shadowOffset: { width: 0, height: 2 },
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 3,
            // background color must be set
            // backgroundColor : "#fff" // invisible color
        }
    }),

    shadowTop: Platform.select({
        'ios': {
            shadowColor: '#aaa',
            shadowOffset: { width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 2
        },
        'android': {
            shadowOffset: { width: 10, height: -10 },
            shadowColor: 'black',
            shadowOpacity: 1,
            elevation: 3,
            // background color must be set
            backgroundColor : "#0000" // invisible color
        }
    }),

    flexRow: {
        flexDirection: 'row',
        alignItems:'center'
    },

    spaceBetween: {
        justifyContent: 'space-between'
    },

    flexWrap: {
        flexDirection: 'row', flexWrap: 'wrap'
    },

    mt: {marginTop: MARGIN_TOP},
    mbt: {marginTop: MARGIN_BOTTOM},
    pt: {paddingTop: MARGIN_TOP},
    pbt: {paddingTop: MARGIN_BOTTOM},

    mt4: {marginTop: 4},
    mt8: {marginTop: 8},
    mt12: {marginTop: 12},
    mt16: {marginTop: 16},
    mt24: {marginTop: 24},
    ml8: {marginLeft: 8},
    ml12: {marginLeft: 12},
    ml16: {marginLeft: 16},
    ml24: {marginLeft: 24},
    mr8: {marginRight: 8},
    mr12: {marginRight: 12},
    pd12: {padding: 12},
    pd16: {padding: 16},
    pd24: {padding: 24},
    pt24: {paddingTop: 24},
    pt12: {paddingTop: 12},
    mg12: {margin: 12},
    mg16: {margin: 16},
    mg24: {margin: 24},
});

export const tagsStyles = {
    p: {fontFamily: 'Inter-Regular', lineHeight: 20},
    a: {fontFamily: 'Inter-Regular'},
    span: {fontFamily: 'Inter-Regular'},
}

export default (styles);
