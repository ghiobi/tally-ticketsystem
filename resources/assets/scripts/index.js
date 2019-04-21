import './polyfills'
import './scripts'
import './sockets'

export const HOST = location.host

export const ORGANIZATION_URI = document.querySelector('[name="ORGANIZATION_URI"]').getAttribute('content')
export const FULL_ORGANIZATION_URI = `${location.protocol}//${HOST}/organization/${ORGANIZATION_URI}`
