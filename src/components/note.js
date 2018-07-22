import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { Card,Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 300;

export default class Note extends Component {
  constructor(props) {
    super(props);
      
    this.position = new Animated.ValueXY(0, 0);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({
          x: gestureState.dx,
        });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      },
    });
  }

  resetPosition() {
    Animated.spring(this.position, { // De esta manera, lo ANIMA hacia su posicion inicial
      toValue: {
        x: 0,
        y: 0,
      },
    }).start();
  }

  forceSwipe(direction) {
    Animated.timing(this.position, { // No es tan 'fancy'
      toValue: {
        x: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
        y: 0,
      },
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight } = this.props;

    if(direction === 'right') {
      onSwipeRight()
      setTimeout(() => {
        this.position.setValue({
          x: 0,
          y: 0,
        })
      }, 100);
    }
    else
      onSwipeLeft()
  }

  getNoteStyle() {
    const { position } = this;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5], // Pixels
      outputRange: [-10, 0, 10], // Son lineales
    });
    return {
      ...position.getLayout(),
      transform: [{ translateX: rotate }],
    };
  }

  render(){
    return(
      <Animated.View 
        style={this.getNoteStyle()}
        {...this.panResponder.panHandlers}
      >
          <Card>
            <View style={styles.titleview}>
              <Text>{this.props.note.title}</Text>
              <Button
                icon={{ name: 'title', color: 'black' }}
                buttonStyle={styles.button}
                onPress={this.props.onEdit}
              />
            </View>
            <Text
              numberOfLines={3}
              style={styles.text}>
              {this.props.note.text}
            </Text>
            <View style={styles.footer}>
              <Text>{this.props.note.date}</Text>
              <Button
                icon={{ name: 'delete', color: 'black' }}
                buttonStyle={styles.button}
                onPress={this.props.onDelete}
              />
            </View>
          </Card>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
    titleview: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        paddingBottom: 3,
        justifyContent: 'space-between'
    },text:{
        color: 'gray',
        marginVertical: 5
    },button:{
        width: 30,
        height:20,
        backgroundColor: '#dbdbdb',
        padding: 0,
        margin: 0,
        borderWidth: 1,
        borderColor: 'gray'
    },footer:{
        flexDirection: 'row', 
        justifyContent:'space-between', 
        borderTopWidth:1,
        borderTopColor: '#dbdbdb',
        paddingTop: 5,
    }
});




  // initialStyle() {
  //   const position = this.position;

  //   const translateX = position.x.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [150, 0]
  //   });

  //   return {
  //     ...position.getLayout(),
  //     transform: [{ translateX }]
  //   }
  // }
