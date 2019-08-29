
'use strict'
import React from 'react';
import {  
  View,
  ScrollView,
  NativeModules,
  NativeEventEmitter
} from 'react-native';

import ContentPicture from './ContentPicture';
import ContentDescription from  './ContentDescription';
import LocalResources from '../LocalResources';

export default class ContentScrollView extends React.Component {

  constructor(props) {
    super(props);
    this._scrollView;
    this.curIndex = 0    
    this.state = { selectedIndex: 0 };
    this.numItems = this.props.contentURIs.length;          
    this.scrolloffset = 0;
    this.itemWidth = 454;
    this.onTVKeyDown = this.onTVKeyDown.bind(this);
    this.onTVKeyUp = this.onTVKeyUp.bind(this);    
    this.handleButtonPressRight = this.handleButtonPressRight.bind(this);
    this.handleButtonPressLeft = this.handleButtonPressLeft.bind(this);
    this.JuvoPlayer = NativeModules.JuvoPlayer;
    this.JuvoEventEmitter = new NativeEventEmitter(this.JuvoPlayer);
  }

  handleButtonPressRight() {       
    if (this.curIndex < this.numItems - 1) {
      this.curIndex++;
      this.scrolloffset = (this.curIndex * this.itemWidth);      
      this.JuvoPlayer.log("scrollView.scrollTo x = " +  this.scrolloffset);
      this._scrollView.scrollTo({ x:  this.scrolloffset, y: 0, animated: true });            
    } 
    this.setState({ selectedIndex: this.curIndex });
  };

  handleButtonPressLeft() { 
    if (this.curIndex > 0) {
      this.curIndex--;      
      this.scrolloffset = (this.curIndex * this.itemWidth);  
      this._scrollView.scrollTo({ x:  this.scrolloffset, y: 0, animated: true });
      
    };
    this.setState({ selectedIndex: this.curIndex });
  };

  componentWillMount() {
    this.JuvoEventEmitter.addListener(
      'onTVKeyDown',
      this.onTVKeyDown
    );
    this.JuvoEventEmitter.addListener(
      'onTVKeyUp',
      this.onTVKeyUp
    );
  }
 

  onTVKeyDown(pressed) {
    //There are two parameters available:
    //params.KeyName
    //params.KeyCode   
    switch (pressed.KeyName) {
      case "Right":        
        this.handleButtonPressRight();
        break;
      case "Left":       
        this.handleButtonPressLeft();
        break;
    }        
  };  

  onTVKeyUp(pressed) {     
    this.setState({ selectedIndex: this.curIndex });   
    this.props.onSelectedIndexChange(this.state.selectedIndex);    
  }

  render() {
    const index = this.state.selectedIndex;
    const width = this.props.itemWidth ? this.props.itemWidth : 454;
    const height = this.props.itemHeight ? this.props.itemHeight : 260;      
    const stylesThumbSelected = this.props.stylesThumbSelected ? this.props.stylesThumbSelected : {width: 460, height: 266, backgroundColor: '#ffd700'};
    const stylesThumb = this.props.stylesThumb ? this.props.stylesThumb : {width: 460, height: 266};
    const pathFinder = LocalResources.tilePathSelect;
    const renderThumbs = (uri, i) => <ContentPicture key={i} source={uri} myIndex={i} selectedIndex={index}
      path={pathFinder(uri)}
      width={width} height={height} top={2} left ={2} position={'relative'} visible={true} fadeDuration={1} 
      stylesThumbSelected={stylesThumbSelected} stylesThumb={stylesThumb} 
      />;

    return (
      <View style={{overflow: 'visible'}}>
        <View style={{position: 'relative', top: 400, left: 500, width: 1920, height: 800, zIndex: 200, overflow: 'visible'}}>
          <ContentDescription viewStyle={{ position: 'relative', top: 100, left: 100, width: 1920, height: 800, zIndex: 200, overflow: 'visible' }} 
                      headerStyle={{ fontSize: 30, color: '#7fff00' }} 
                      headerText={this.props.contentURIs[index]} />
        </View>
        <View>
        <ScrollView
          scrollEnabled={false}
          ref={(scrollView) => { this._scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={0}
          horizontal={true}
          showsHorizontalScrollIndicator={false}     
           >
          {this.props.contentURIs.map(renderThumbs)}          
        </ScrollView>
        </View>                
      </View>
    );
  }
}
