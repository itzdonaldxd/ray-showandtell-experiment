import "./style.less";

import PropTypes from "prop-types";
import React from "react";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import _ from 'lodash';


export default class Footer extends React.Component {
  state = { comment: "", rows: 1, minRows: 1, maxRows: 5, buttonHeight: 30 };

  // updateLastActive = _.throttle((player) => player.set("lastActive", moment(TimeSync.serverTime(null, 1000))), 5000, {leading: true});

  handleSubmit = (e) => {
    e.preventDefault();
    const text = this.state.comment.trim();
    if (text === "") {
      return;
    }

    const { player, onNewMessage, timeStamp } = this.props;

    let msg = {
      text,
      player: {
        _id: player._id,
        avatar: player.get("avatar"),
        name: player.get("name") || player._id,
      },
    };

    if (timeStamp) {
      msg = { ...msg, timeStamp };
    }

    onNewMessage(msg);
    // player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

    this.setState({ comment: "" });
  };

  handleChange = (e) => {
    const {player} = this.props;
    const el = e.currentTarget;
    const textareaLineHeight = 24;
    const { minRows, maxRows } = this.state;

    const previousRows = e.target.rows;
    e.target.rows = minRows; // reset number of rows in textarea
    const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      e.target.rows = maxRows;
      e.target.scrollTop = e.target.scrollHeight;
    }

    const usedRows = currentRows < maxRows ? currentRows : maxRows;

    // this.updateLastActive(player);

    this.setState(
      {
        [el.name]: el.value,
        rows: usedRows,
      },
      () => {
        this.setState({
          buttonHeight: document.getElementById("chat-input").offsetHeight,
        });
      }
    );
  };

  render() {
    const { comment, rows, buttonHeight } = this.state;
    const { requestUsed } = this.props;

    return (
      <form className="chat-footer-form" onSubmit={this.handleSubmit}>
        <div className="chat-footer">
          <textarea
            id="chat-input"
            name="comment"
            className="chat-input"
            placeholder={requestUsed ? "You used your one message" : "My message"}
            value={comment}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                this.handleSubmit(e);
              }
            }}
            rows={rows}
            onChange={this.handleChange}
            autoComplete="off"
            disabled={requestUsed}
          />
        </div>
        <button
            type="submit"
            form="chat-input"
            className="chat-button-send"
            disabled={!comment}
            onClick={this.handleSubmit}
          >
            <img src={`images/icon-enter.png`} width="15px" height="17px"/>
          </button>
      </form>
    );
  }
}

Footer.propTypes = {
  player: PropTypes.object.isRequired,
  scope: PropTypes.object.isRequired,
  customKey: PropTypes.string.isRequired,
  onNewMessage: PropTypes.func,
  timeStamp: PropTypes.instanceOf(Date),
};
