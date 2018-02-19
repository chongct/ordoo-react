import React, { Component } from 'react';

import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import { Jumbotron, Row, Col } from 'reactstrap';

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Item from './Item'

import '../styles/App.css'

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      ratings: [],
      comments: [],
      feedbacks: []
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  // save rating
  ratingChange = (e) => {
    console.log(e.target.className)

    let feedbackObj = {}
    feedbackObj['ratable_id'] = e.target.className.split(" ")[0]
    if (parseInt(feedbackObj['ratable_id']) > 120) {
      feedbackObj['ratable_type'] = 'DeliveryOrder'
    } else {
      feedbackObj['ratable_type'] = 'OrderItem'
    }
    feedbackObj['rating'] = e.target.value
    this.setState({
      ratings: this.state.ratings.concat(feedbackObj)
    })
  }

  // save comments
  commentChange = (e) => {
    console.log('test')
    let feedbackObj = {}
    feedbackObj['ratable_id'] = e.target.className.split(" ")[0]
    if (parseInt(feedbackObj['ratable_id']) > 120) {
      feedbackObj['ratable_type'] = 'DeliveryOrder'
    } else {
      feedbackObj['ratable_type'] = 'OrderItem'
    }
    feedbackObj['comment'] = e.target.value
    this.setState({
      comments: this.state.comments.concat(feedbackObj)
    })
  }

  // merge ratings and comments
  merge() {
    let feedbackArray = []
    this.state.ratings.map(rating => {
      this.state.comments.map(comment => {
        if (rating['ratable_id'] == comment['ratable_id']) {
          console.log('true')
          let feedbackObj = {}
          feedbackObj['ratable_id'] = rating['ratable_id']
          feedbackObj['ratable_type'] = rating['ratable_type']
          feedbackObj['rating'] = rating['rating']
          feedbackObj['comment'] = comment['comment']
          console.log(feedbackObj)
          feedbackArray = feedbackArray.concat(feedbackObj)
        }
      })
    })
    // console.log(feedbackArray)
    this.setState({
      feedbacks: feedbackArray
    })
  }

  submitForm = async (e) => {
    e.preventDefault()
    await this.merge()
    console.log(this.state)

    this.state.feedbacks.map(element => {
      this.props.feedbackMutation({
        variables: {
          ratable_id: parseInt(element.ratable_id),
          ratable_type: element.ratable_type,
          rating: parseInt(element.rating),
          comment: element.comment
        }
      })
    })
  }

  render() {
    // console.log(this.props)
    const { serving_datetime, order_items, order_id, id, feedbacksQuery } = this.props

    let date = serving_datetime.split("T")[0]
    let timeString = serving_datetime.split("T")[1]
    let time = `${timeString.split(":")[0]}:${timeString.split(":")[1]} - ${timeString.split(":")[0]}:${parseInt(timeString.split(":")[1]) + 30}`

    // order_items
    let items = order_items.map(item => <Item key={item.id} ratingChange={this.ratingChange} commentChange={this.commentChange} {...item}/>)

    // feedback button
    let buttonLogic = true
    // console.log(feedbacksQuery)
    if (feedbacksQuery && feedbacksQuery.loading) {
      return <div>Loading....</div>
    }

    feedbacksQuery.feedback.map(feedback => {
      if (feedback.ratable_id == id) {
        buttonLogic = false
      }
    })

    return (
      <div>
        <Jumbotron>
          <Row>
            <Col sm="10">
              <h4>Order No: {order_id}</h4>
              <p>Delivery Date: {date}</p>
              <p>Delivery Time: {time}</p>
            </Col>
            <Col sm="2">
              {buttonLogic && <Button color="warning" onClick={this.toggle} className={this.props.id}>Feedback</Button>}
            </Col>
          </Row>
        </Jumbotron>

        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Feedback for {order_id}</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.submitForm}>
                <FormGroup tag="fieldset" onChange={this.ratingChange}>
                  <legend>Rating for delivery</legend>
                  <FormGroup check inline>
                    <Label check>
                      <Input className={id} type="radio" name={'radio' + id} value="1" />1
                      <Input className={id} type="radio" name={'radio' + id} value="2" />2
                      <Input className={id} type="radio" name={'radio' + id} value="3" />3
                      <Input className={id} type="radio" name={'radio' + id} value="4" />4
                      <Input className={id} type="radio" name={'radio' + id} value="5" />5
                    </Label>
                  </FormGroup>
                </FormGroup>

                <FormGroup>
                  <Label for="comment"></Label>
                  <Input className={id} type="text" name="comment" id="comment" placeholder="Feel free to leave us a comment...." onBlur={this.commentChange} />
                </FormGroup>

                { items }
                <Button color="warning">Submit</Button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}

const ADD_FEEDBACK = gql`
  mutation FeedbackMutation($ratable_id: Int!, $ratable_type: String! $rating: Int!, $comment: String!) {
    createFeedback(ratable_id: $ratable_id, ratable_type: $ratable_type, rating: $rating, comment: $comment) {
      ratable_id
    }
  }
`

const FEEDBACKS_QUERY = gql`
  query FeedbacksQuery {
    feedback {
      ratable_id
    }
  }
`

export default compose(
  graphql(ADD_FEEDBACK, { name: 'feedbackMutation' }),
  graphql(FEEDBACKS_QUERY, { name: 'feedbacksQuery' })
) (Order);
