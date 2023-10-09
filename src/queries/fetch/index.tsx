import {DeviceEventEmitter} from 'react-native';
import {getKeychain} from '../../hooks/useKeychain';

interface ErrorResponse {
  error: string;
  message?: string;
}

export const makeRequest = async <T,>(
  api: string,
  method: string = 'GET',
  body?: object,
): Promise<T | ErrorResponse> => {
  let requestOptions: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  //   // Get the authentication token from Keychain
  //   const tokenData = await getKeychain('authenticationToken');
  //   const token = tokenData?.access_token;

  //   // If token is available, add it to the request headers
  //   if (token) {
  //     requestOptions.headers = {
  //       ...requestOptions.headers,
  //       Authorization: `Bearer ${token}`,
  //     };
  //   }

  try {
    const response = await fetch(api, requestOptions);
    const json = await response.json();
    // Check for an "Unauthenticated" message in the response
    if (json?.message === 'Unauthenticated.') {
      // Handle the sign-out logic here, e.g., emitting an event
      DeviceEventEmitter.emit('sign_out_app');
    }

    return json;
  } catch (error) {
    return {
      error: error ? error : 'Oops, something went wrong',
    } as ErrorResponse;
  }
};
