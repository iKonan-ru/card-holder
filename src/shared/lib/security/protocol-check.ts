import { logError } from '../utils';
import {
  HOSTNAME_127,
  HOSTNAME_LOCALHOST,
  HTTP_WARNING_MESSAGE,
  PROTOCOL_HTTPS,
  SECURITY_WARNING_CONTEXT,
} from './constants';

export const checkSecureProtocol = (): boolean => {
  const isHttps = window.location.protocol === PROTOCOL_HTTPS;
  const isLocalhost =
    window.location.hostname === HOSTNAME_LOCALHOST ||
    window.location.hostname === HOSTNAME_127;
  const isSecure = isHttps || isLocalhost;

  if (!isSecure) {
    logError({
      message: HTTP_WARNING_MESSAGE,
      context: SECURITY_WARNING_CONTEXT,
      level: 'warn',
    });
  }

  return isSecure;
};
