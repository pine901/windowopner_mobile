/**
 * Created by liuyu on 2017/1/18.
 */

import React, {PureComponent} from 'react';
import {View, Text, Image, Animated, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {UIActivityIndicator} from 'react-native-indicators';

export default class Hud extends PureComponent {
  mount = false;

  state = {
    isShow: false,
    text: '',
    opacityValue: new Animated.Value(0),
  };

  componentDidMount() {
    this.mount = true;
  }

  componentWillUnmount() {
    this.mount = false;
  }

  show(text = '', after = null) {
    this.setState({
      isShow: true,
      text,
    });

    this.isShow = true;
    Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration,
    }).start();

    if (after !== null) {
      this.close(after);
    }
  }

  close(after = null) {
    if (!this.isShow) {
      return;
    }

    const animate = () => {
      Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
      }).start(() => {
        this.mount &&
          this.setState({
            isShow: false,
          });
        this.isShow = false;
      });
    };

    if (after !== null) {
      setTimeout(animate, after);
    } else {
      animate();
    }
  }

  render() {
    const {
      hudType,
      textOnly,
      source,
      backgroundTouchable,
      style,
      imageStyle,
      textStyle,
      positionValue,
      ...hudProps
    } = this.props;

    let hud = null;
    if (!textOnly) {
      switch (hudType) {
        case 'info':
          hud = (
            <Image
              style={[styles.image, imageStyle]}
              source={require('./src/info.png')}
            />
          );
          break;
        case 'success':
          hud = (
            <Image
              style={[styles.image, imageStyle]}
              source={require('./src/success.png')}
            />
          );
          break;
        case 'error':
          hud = (
            <Image
              style={[styles.image, imageStyle]}
              source={require('./src/error.png')}
            />
          );
          break;
        default:
          if (this.props.source) {
            hud = <Image style={[styles.image, imageStyle]} source={source} />;
          } else {
            hud = <UIActivityIndicator {...hudProps} style={{flex: 0}} />;
          }
          break;
      }
    }

    const view = this.state.isShow ? (
      <Animated.View
        pointerEvents={backgroundTouchable ? 'none' : 'auto'}
        style={[
          styles.container,
          {paddingTop: positionValue},
          {opacity: this.state.opacityValue},
        ]}>
        <View style={[styles.content, style]}>
          {hud}
          {this.state.text !== '' ? (
            <Text numberOfLines={20} style={[styles.text, textStyle]}>
              {this.state.text}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    ) : null;
    return view;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  content: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 24,
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: 'white',
  },
  image: {
    marginBottom: 0,
  },
});

Hud.propTypes = {
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  opacity: PropTypes.number,
  positionValue: PropTypes.number,
  textOnly: PropTypes.bool,
  hudType: PropTypes.string,
  backgroundTouchable: PropTypes.bool,
};

Hud.defaultProps = {
  textStyle: styles.text,
  fadeInDuration: 500,
  fadeOutDuration: 500,
  opacity: 1,
  positionValue: 0,
  textOnly: false,
  backgroundTouchable: false,
  imageStyle: {
    tintColor: 'white',
  },
  source: null,
  style: null,
  hudType: 'material',
  color: '#000',
  size: 40,
};
