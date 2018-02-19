import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap'

class Item extends Component {
  render() {
    // console.log(this.props)
    return (
      <div key={this.props.id}>
        <h4>{this.props.name}</h4>
        <FormGroup tag="fieldset" onChange={(e) => this.props.ratingChange(e)}>
          <FormGroup check inline>
            <Label check>
              <Input className={this.props.id} type="radio" name={'radio' + this.props.id} value="1" />1
              <Input className={this.props.id} type="radio" name={'radio' + this.props.id} value="2" />2
              <Input className={this.props.id} type="radio" name={'radio' + this.props.id} value="3" />3
              <Input className={this.props.id} type="radio" name={'radio' + this.props.id} value="4" />4
              <Input className={this.props.id} type="radio" name={'radio' + this.props.id} value="5" />5
            </Label>
          </FormGroup>
        </FormGroup>

        <FormGroup>
          <Label for="comment">Comments</Label>
          <Input className={this.props.id} type="text" name="comment" id="comment" placeholder="Feel free to leave us a comment...." onBlur={(e) => this.props.commentChange(e)} />
        </FormGroup>
      </div>
    )
  }
}

export default Item;
