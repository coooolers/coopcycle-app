import {
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_FAILURE,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDER_REQUEST,
  LOAD_ORDER_FAILURE,
  LOAD_ORDER_SUCCESS,
  SET_CURRENT_ORDER,
  ACCEPT_ORDER_REQUEST,
  ACCEPT_ORDER_SUCCESS,
  ACCEPT_ORDER_FAILURE,
  REFUSE_ORDER_REQUEST,
  REFUSE_ORDER_SUCCESS,
  REFUSE_ORDER_FAILURE,
  DELAY_ORDER_REQUEST,
  DELAY_ORDER_SUCCESS,
  DELAY_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
  LOAD_MY_RESTAURANTS_FAILURE,
  CHANGE_STATUS_REQUEST,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAILURE,
  CHANGE_RESTAURANT,
  CHANGE_DATE,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCTS_SUCCESS,
  CHANGE_PRODUCT_ENABLED_REQUEST,
  CHANGE_PRODUCT_ENABLED_SUCCESS,
  CHANGE_PRODUCT_ENABLED_FAILURE,
  CLOSE_RESTAURANT_REQUEST,
  CLOSE_RESTAURANT_SUCCESS,
  CLOSE_RESTAURANT_FAILURE,
  DELETE_OPENING_HOURS_SPECIFICATION_REQUEST,
  DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS,
  DELETE_OPENING_HOURS_SPECIFICATION_FAILURE,
} from './actions'

import moment from 'moment'
import _ from 'lodash'

const initialState = {
  fetchError: null,  // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  orders: [],        // Array of orders
  order: null,
  myRestaurants: [], // Array of restaurants
  date: moment(),
  status: 'available',
  restaurant: null,
  products: [],
  specialOpeningHoursSpecification: [],
}

const spliceOrders = (state, payload) => {

  const orderIndex = _.findIndex(state.orders, order => order['@id'] === payload['@id'])

  if (-1 !== orderIndex) {
    const newOrders = state.orders.slice(0)
    newOrders.splice(orderIndex, 1, Object.assign({}, payload))

    return newOrders
  }

  return state.orders
}

const spliceProducts = (state, payload) => {

  const productIndex = _.findIndex(state.products, product => product['@id'] === payload['@id'])

  if (-1 !== productIndex) {
    const newProducts = state.products.slice(0)
    newProducts.splice(productIndex, 1, Object.assign({}, payload))

    return newProducts
  }

  return state.products
}

export default (state = initialState, action = {}) => {
  let newState

  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
    case LOAD_ORDER_REQUEST:
    case ACCEPT_ORDER_REQUEST:
    case LOAD_MY_RESTAURANTS_REQUEST:
    case REFUSE_ORDER_REQUEST:
    case DELAY_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
    case CHANGE_STATUS_REQUEST:
    case LOAD_PRODUCTS_REQUEST:
    case CHANGE_PRODUCT_ENABLED_REQUEST:
    case CLOSE_RESTAURANT_REQUEST:
    case DELETE_OPENING_HOURS_SPECIFICATION_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      }

    case LOAD_ORDERS_FAILURE:
    case LOAD_ORDER_FAILURE:
    case ACCEPT_ORDER_FAILURE:
    case LOAD_MY_RESTAURANTS_FAILURE:
    case REFUSE_ORDER_FAILURE:
    case DELAY_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case CHANGE_STATUS_FAILURE:
    case LOAD_PRODUCTS_FAILURE:
    case CHANGE_PRODUCT_ENABLED_FAILURE:
    case CLOSE_RESTAURANT_FAILURE:
    case DELETE_OPENING_HOURS_SPECIFICATION_FAILURE:
      return {
        ...state,
        fetchError: action.payload || action.error,
        isFetching: false,
      }

    case LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: action.payload,
      }

    case LOAD_ORDER_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: state.orders.slice(0).concat([ action.payload ]),
      }

    case ACCEPT_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        order: action.payload,
        fetchError: false,
        isFetching: false,
      }

    case REFUSE_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        order: action.payload,
        fetchError: false,
        isFetching: false,
      }

    case DELAY_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        order: action.payload,
        fetchError: false,
        isFetching: false,
      }

    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        order: action.payload,
        fetchError: false,
        isFetching: false,
      }

    case SET_CURRENT_ORDER:
      return {
        ...state,
        order: action.payload,
      }

    case LOAD_MY_RESTAURANTS_SUCCESS:

      newState = {
        ...state,
        fetchError: false,
        isFetching: false,
        myRestaurants: action.payload,
      }

      if (action.payload.length > 0) {
        const restaurant = _.first(action.payload)

        newState = {
          ...newState,
          // We select by default the first restaurant from the list
          // Most of the time, users will own only one restaurant
          restaurant,
          specialOpeningHoursSpecification:
            restaurant.hasOwnProperty('specialOpeningHoursSpecification') ? restaurant.specialOpeningHoursSpecification : [],
        }
      }

      return newState

    case LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: action.payload,
      }

    case CHANGE_PRODUCT_ENABLED_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: spliceProducts(state, action.payload),
      }

    case CLOSE_RESTAURANT_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload,
        specialOpeningHoursSpecification:
          action.payload.hasOwnProperty('specialOpeningHoursSpecification') ? action.payload.specialOpeningHoursSpecification : [],
      }

    case DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS:

      const { specialOpeningHoursSpecification } = state

      return {
        ...state,
        fetchError: false,
        isFetching: false,
        specialOpeningHoursSpecification: _.filter(
          specialOpeningHoursSpecification,
          openingHoursSpecification => openingHoursSpecification['@id'] !== action.payload['@id']
        )
      }

    case CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload
      }

    case CHANGE_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload
      }

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload
      }

    default:
      return { ...state }
  }
}
