/**
 * Mixpanel React Native Hook
 *
 * This custom hook provides a simplified interface for integrating Mixpanel analytics
 * into your React Native application. It includes functions for tracking events,
 * identifying users, and working with Mixpanel People-related actions.
 *
 * Usage:
 * - Import the hook: `import useMixpanel from 'hooks/useMixpanel';`
 * - Initialize Mixpanel actions: `const mixpanel = useMixpanel();`
 * - Track an event with optional properties: `mixpanel.track('Button Clicked', { buttonName: 'Submit' });`
 * - Identify a user with a distinct ID: `mixpanel.identify('user123');`
 * - Set user properties using People-related actions: `mixpanel.people.set({ $email: 'user@example.com', $name: 'John Doe' });`
 *
 * Note: Make sure to initialize Mixpanel in your app's configuration before using this hook.
 *
 * @file useMixpanel.tsx
 */

import {useEffect, useMemo} from 'react';
import {
  Mixpanel,
  People,
  MixpanelType,
  MixpanelProperties,
} from 'mixpanel-react-native';
import Config from 'react-native-config';

// Define the types for Mixpanel actions
interface MixpanelActions {
  identify: (distinctId: string) => Promise<void>;
  alias: (alias: string, distinctId: string) => void;
  track: (eventName: string, properties?: Record<string, any>) => void;
  people: PeopleActions;
  reset: () => void;
}

// Define the types for People-related Mixpanel actions
interface PeopleActions {
  set: (props: Record<string, any>) => void;
  setOnce: (props: Record<string, any>) => void;
  increment: (props: Record<string, number>) => void;
  append: (name: string, value: MixpanelType) => void;
  union: (name: string, value: MixpanelType[]) => void;
  remove: (name: string, value: MixpanelType) => void;
  unset: (name: string) => void;
  trackCharge: (charge: number, properties?: MixpanelProperties) => void;
  clearCharges: () => void;
  deleteUser: () => void;
}

// Create a custom hook for using Mixpanel
const useMixpanel = (): MixpanelActions => {
  const mixpanel = useMemo(() => {
    // Initialize Mixpanel only once when the hook is first called
    const instance = new Mixpanel(Config.MIXPANEL_ID, true);
    instance.init(); // Initialize Mixpanel here
    return instance;
  }, []);

  // Define a function to identify users
  const identify = async (distinctId: string) => {
    await mixpanel.identify(distinctId);
  };

  // Define a function to create aliases for users
  const alias = (alias: string, distinctId: string) => {
    mixpanel.alias(alias, distinctId);
  };

  // Define a function to track events
  const track = (eventName: string, properties?: Record<string, any>) => {
    mixpanel.track(eventName, properties);
  };

  // Define a function to reset Mixpanel
  const reset = () => {
    mixpanel.reset();
  };

  // Define People-related actions
  const people: PeopleActions = {
    set: (props: Record<string, any>) => mixpanel.getPeople().set(props),
    setOnce: (props: Record<string, any>) =>
      mixpanel.getPeople().setOnce(props),
    increment: (props: Record<string, number>) =>
      mixpanel.getPeople().increment(props),
    append: (name: string, value: MixpanelType) =>
      mixpanel.getPeople().append(name, value),
    union: (name: string, value: MixpanelType[]) =>
      mixpanel.getPeople().union(name, value),
    remove: (name: string, value: MixpanelType) =>
      mixpanel.getPeople().remove(name, value),
    unset: (name: string) => mixpanel.getPeople().unset(name),
    trackCharge: (charge: number, properties?: MixpanelProperties) =>
      mixpanel.getPeople().trackCharge(charge, properties ?? {}),
    clearCharges: () => mixpanel.getPeople().clearCharges(),
    deleteUser: () => mixpanel.getPeople().deleteUser(),
  };

  // Add an effect to flush Mixpanel events before unmounting
  useEffect(() => {
    return () => {
      mixpanel.flush(); // Ensure any pending events are sent before unmounting
    };
  }, [mixpanel]);

  // Return the Mixpanel actions for use in components
  return {
    identify,
    alias,
    track,
    reset,
    people,
  };
};

export default useMixpanel;
