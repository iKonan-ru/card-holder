import { logError } from '../utils';

const PROTOCOL_HTTPS = 'https:';
const HOSTNAME_LOCALHOST = 'localhost';
const HOSTNAME_127 = '127.0.0.1';
const WARNING_MESSAGE =
  'ВНИМАНИЕ: Приложение работает по незащищенному соединению! Для безопасности используйте HTTPS.';
const SECURITY_WARNING_CONTEXT = 'SecurityCheck';

export const checkSecureProtocol = (): void => {
  const isHttps = window.location.protocol === PROTOCOL_HTTPS;
  const isLocalhost =
    window.location.hostname === HOSTNAME_LOCALHOST ||
    window.location.hostname === HOSTNAME_127;
  const isSecure = isHttps || isLocalhost;

  if (!isSecure) {
    logError({
      message: WARNING_MESSAGE,
      context: SECURITY_WARNING_CONTEXT,
    });

    console.warn(WARNING_MESSAGE);
  }
};
