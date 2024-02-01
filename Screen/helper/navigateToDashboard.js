import { CommonActions } from '@react-navigation/native';

export const navigateToDashboard = (navigation, authenticatedUser) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Dashboard', params: { authenticatedUser } }],
    })
  );
};
