'use strict'

// TODO ensure sanitization of PII
const maskObj = (obj) => {
  const newObj = { ...obj }
  return newObj
}

/**
 * @description Helper for structured logging. 
 * @param {*} param 
 * param.sequence = the name of the sequence that will run.
 */
module.exports = ({
  sequence
}) => {
  const info = {
    sequence: sequence,
    step: null,
    userid: null,
    chapter: null,
    data: {}
  }
  return {
    logInfo: (step, data) => {
      info.data = data
      info.step = step
      console.info('INFO:', maskObj(info))
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
