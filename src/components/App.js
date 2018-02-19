import React, { Component } from 'react';
// import logo from '../logo.svg';
import '../styles/App.css';

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Order from './Order'

import { Container } from 'reactstrap';

class App extends Component {
  // feedback = async (id) => {
  //   console.log('test')
  //   @graphql(orderItemsQuery, {
  //     options: (id) => ({
  //       variables: {
  //         delivery_order_id: id
  //       }
  //     })
  //   })
  //   let result = await this.props.orderItemsQuery({
  //     variables: {
  //       delivery_order_id: id
  //     }
  //   })
  // }


  render() {
    console.log(this.props)
    const { allDeliveryOrdersQuery } = this.props

    if (allDeliveryOrdersQuery && allDeliveryOrdersQuery.loading) {
      return <div>Loading....</div>
    }

    // render all delivery orders
    console.log(allDeliveryOrdersQuery)
    const ordersToRender = allDeliveryOrdersQuery.delivery_order
    let ordersSort = [].concat(ordersToRender)
    ordersSort.sort((a, b) => a.serving_datetime < b.serving_datetime)
    console.log(ordersSort)
    let orders = ordersSort.map(order => <Order key={order.id} onClick={() => this.feedback(order.id)} {...order} />)

    return (
      <div>
        <Container>
          <h2 className="title">Ordoo</h2>
          { orders }
        </Container>
      </div>
    );
  }
}

const ORDERS_QUERY = gql`
  query DeliveryOrdersQuery {
    delivery_order {
      id
      order_id
      serving_datetime
      order_items {
        id
        item_id
        name
      }
    }
  }
`

export default compose(
  graphql(ORDERS_QUERY, { name: 'allDeliveryOrdersQuery' })
)(App);
