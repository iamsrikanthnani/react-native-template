import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';

// Define the shape of the data to store in the Keychain
export interface KeychainData {
  name: string;
  data: any;
}

// Define an interface for Keychain-related errors
interface KeychainError {
  code: string;
  message: string;
}

// Function to store data in the Keychain
export async function storeKeychain(data: KeychainData): Promise<void> {
  try {
    // Convert data to JSON format
    const jsonData = JSON.stringify(data.data);

    // Generate a unique Keychain name based on the environment and data name
    const KeychainName = `${Config.ENV}-keyChain-${data.name}`;

    // Store the data in the Keychain
    await Keychain.setGenericPassword(KeychainName, jsonData);
  } catch (err) {
    // Handle any errors that occur during storage
    const error: KeychainError = {
      code: 'KEY_CHAIN_STORE_ERROR',
      message: `${data.name} failed to store in Keychain`,
    };
    throw error;
  }
}

// Function to retrieve data from the Keychain
export async function getKeychain(name: string): Promise<any> {
  try {
    // Generate the Keychain name to look for
    const KeychainName = `${Config.ENV}-keyChain-${name}`;

    // Attempt to retrieve data from the Keychain
    const result = await Keychain.getGenericPassword();

    // Check if data was found and matches the expected Keychain name
    if (result && result.username === KeychainName) {
      // Parse and return the stored data
      const parsedData = JSON.parse(result.password);
      return parsedData;
    }

    // Throw an error if the data is not found in the Keychain
    throw new Error('Key not found in Keychain');
  } catch (err) {
    // Handle any errors that occur during retrieval
    const error: KeychainError = {
      code: 'KEY_CHAIN_GET_ERROR',
      message: `${name} failed to retrieve from Keychain`,
    };
    throw error;
  }
}

// Function to delete all data from the Keychain
export async function deleteAllKeychains(): Promise<void> {
  try {
    // Reset (delete) all data associated with the Keychain service
    await Keychain.resetGenericPassword({service: `${Config.ENV}-keyChain`});
  } catch (err) {
    // Handle any errors that occur during deletion
    const error: KeychainError = {
      code: 'KEY_CHAIN_DELETE_ALL_ERROR',
      message: `Failed to delete all data from Keychain for ${Config.ENV}-keyChain`,
    };
    throw error;
  }
}
