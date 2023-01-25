import React from "react";
import '../../../public/css/intro.css'

import { Centered } from "meteor/empirica:core";

export default class TutorialSpeaker extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;

    return (
      <div className="tutorial-container">
        <div className="title-static-image">
          <img src={`images/title-tut3.png`} />
        </div>
        <Centered>
          <div className="two-col">
            <div className="tutorial-static-image">
              <img src={`images/tut3-slide3.png`} width="100%" />
            </div>
            <div className="tutorial-info">
              <div className="intro-heading"> SPEAKER </div>
              <img src={`images/hr-color.png`} width="180px" height="2px"/>
              <div className="tutorial-body">
                  Each player will have a network of people they can talk to through individual chats. Each member of your network has an unique dialogue box and you can have multiple dialogue boxes open on your screen as you communicate during a trial. You can open or close a box. You can also scroll up and down within a box to view the messages you have exchanged with a specific contact. There will be no overall team chat where you can talk to everyone at once.
              </div>
            </div>
          </div>
        </Centered>
        {hasPrev && <button className="arrow-button tutorial-prev-btn" type="button" onClick={onPrev} disabled={!hasPrev}>
          Previous
        </button>}
        
        {hasNext &&
        <button className="arrow-button tutorial-next-btn" type="button" onClick={onNext} disabled={!hasNext}>
          Next
        </button>
        }
      </div>
    );
  }
}
