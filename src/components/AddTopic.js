import React, { Component } from 'react';

import { firebase } from '../utils/firebase';
import { hashHistory } from 'react-router';
import SimpleMenu from './SimpleMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Welcome from './Welcome';
import DateSelect from './DateSelect';
import * as randKey from 'random-key';

import moment from 'moment';
import { render } from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once

// Render the Calendar
var today = new Date();
var minDate = Number(new Date()) - (24*60*60*1000) * 7;

import { Col } from 'react-bootstrap';
import Button from 'muicss/lib/react/button';

class AddTopic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      topic: {}
    }
  }
  handleSelectDate(date) {
    console.log('the selected date is: ', date);
    console.log('unix timestamp:', moment(date).unix());
    this.setState({
      time: moment(date).unix()
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const topicsRef = firebase.database().ref("topics/");
    const topicTitle = this.refs.topicTitle.value;
    const userid = firebase.auth().currentUser.uid

    // GET DATA FROM 5 FORMS
    const idea1 = this.refs.idea1.value;
    const idea2 = this.refs.idea2.value;
    const idea3 = this.refs.idea3.value;
    const idea4 = this.refs.idea4.value;
    const idea5 = this.refs.idea5.value;

    // TAKE FORM DATA AN ADD IT TO AN ARRAY RESPECTIVELY
    const newArr = [
                    {idea: idea1, votes: 0, key: randKey.generate()},
                    {idea: idea2, votes: 0, key: randKey.generate()},
                    {idea: idea3, votes: 0, key: randKey.generate()},
                    {idea: idea4, votes: 0, key: randKey.generate()},
                    {idea: idea5, votes: 0, key: randKey.generate()},
                    ]

    const validEntry = [];

    for (var i=0; i<newArr.length; i++) {
      if (newArr[i].idea.length >= 1 && newArr[i].idea !== '') {
        validEntry.push(newArr[i])
      }
    }

    topicsRef.orderByChild("title").equalTo(topicTitle).once("value",(data)=>{
      for (let theKey in data.val()) {
        console.log('key is: ', theKey);

        topicsRef.child(theKey).update({ "idea": validEntry })
      }
    });

    firebase.database()
      .ref('/topics')
      .push({
        title: topicTitle,
        time: this.state.time,
        idea: newArr,
        userid: userid
      }).then(data => {
        // redirects you back to home
        hashHistory.push('/home');
      });
  }

  render() {
    return (
      <div>
      <MuiThemeProvider>
        <SimpleMenu />
      </MuiThemeProvider>

      <div className="centerItems">
        <Col xs={1} md={4} lg={4}/>
        <Col xs={10} md={4} lg={4}>
        <p className="add-topic-info">What is the topic?</p>

      <form>
        <input
          className="form-control"
          type="text"
          ref="topicTitle"
          placeholder="Add an Activity &raquo; ex: Where to eat?" />
      </form>

      <p className="add-topic-info">Decision Deadline</p>
      <DateSelect>
      <div className='calendar'>
      <InfiniteCalendar
        width={245}
        height={180}
        onSelect={this.handleSelectDate.bind(this)}
        selectedDate={today}
        disabledDays={[0,6]}
        minDate={minDate}
        keyboardSupport={true}
          />
      </div>
      </DateSelect>


      <p className="add-topic-info">Add some ideas:</p>
      <form>
          <input
          className="form-control"
          type="text"
          ref="idea1"
          placeholder="Add an idea" />
      </form>

      <Welcome>
      <form>
        <input
          className="form-control"
          type="text"
          ref="idea2"
          placeholder="... " />
        </form>

        <form>
          <input
            className="form-control"
            type="text"
            ref="idea3"
            placeholder="..." />
          </form>

          <form>
            <input
              className="form-control"
              type="text"
              ref="idea4"
              placeholder="..." />
            </form>
            <form>
              <input
                className="form-control"
                type="text"
                ref="idea5"
                placeholder="..." />
              </form>
          </Welcome>
            <Button className="saveButton" variant="raised" color="accent"
              onClick={ this.handleSubmit.bind(this) }>
              <form>
              <input
                type="submit" />
            </form>
            </Button>
          </Col>
          <Col xs={1}/>

        </div>
      </div>
    )
  }
}

export default AddTopic;
