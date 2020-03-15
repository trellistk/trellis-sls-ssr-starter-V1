'use strict'

/**
 * @description Helper for structured logging.
 * @param {*} param
 * param.sequence = the name of the sequence that will run.
 */
module.exports = (sequenceName) => {
  if (!sequenceName) console.warn('WARNING:', 'No sequence name found.')

  console.info(`START_${sequenceName}`)

  const info = {
    sequence_name: sequenceName,
    step: null,
    userid: null,
    chapter: null,
    data: {}
  }
  const sequence = {}
  return {
    info: (step, data) => {
      if (!step) console.warn('WARNING:', 'No step name found.')
      if (sequence[step]) console.warn('WARNING:', 'Duplicate step detected.')

      info.data = data
      info.step = step
      sequence[step] = step
      console.info('INFO:', info)
    },
    error: (step, data) => {
      if (!step) console.warn('WARNING:', 'No error name found.')
      if (sequence[step]) console.warn('WARNING:', 'Duplicate error detected.')

      info.data = data
      info.step = step
      sequence[step] = step
      console.error('ERROR:', info)
    },
    add: (key, value) => {
      info[key] = value
    }
  }
}
