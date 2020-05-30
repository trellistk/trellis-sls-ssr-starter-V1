'use strict'

const { spawn } = require('child_process')

let child

module.exports.start = async () => {
  const createProcess = (resolve, reject) => {
    child = spawn( 'sls', ['offline', 'start'])

    console.info(`Starting Offline. PID: ${child.pid}`)

    child.stdout.on('data', data => {
      console.info('Getting Data', data.toString())
      if (data.includes('server ready')) resolve()
    })

    child.stderr.on('data', err => {
      console.error(`Error starting Offline: ${err}`)
    })
  }

  return new Promise(createProcess)
}

module.exports.stop = async () => {
  child.kill()
  console.info('Offline process stopped')
}