'use strict'

const maskObj = (obj) => {
  const newObj = { ...obj }
  return newObj
}

module.exports = ({
  sequence
}) => {
  const info = {
    sequence: sequence,
    step: null,
    userid: null,
    data: {}
  }
  return {
    logInfo: (step, data) => {
      info.data = data
      info.step = step
      console.log('INFO:', maskObj(info))
    },
    logError: (step, data) => {
      info.data = data
      info.step = step
      console.error('ERROR:', maskObj(info))
    },
    logAdd: (key, value) => {
      info[key] = value
    }
  }
}
