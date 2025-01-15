export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Chat: { userId?: string };
  Profile: undefined;
  Settings: undefined;
};

export type NavigationProps = {
  navigation: any;
  route: any;
};