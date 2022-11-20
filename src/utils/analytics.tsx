import splitbee from '@splitbee/web';

type Data = { [key: string]: string | number | boolean };

export const trackEvent = (event: string, details?: Data) => splitbee.track(event, details);

export const setUser = (name: string, email: string) => splitbee.user.set({name, email});
