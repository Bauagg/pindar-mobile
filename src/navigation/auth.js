import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Signin from '../screen/Signin';
import Signup from '../screen/Signup';
import Verification from '../screen/Verification';
import ForgotPass from '../screen/ForgotPass';
import SendForgot from '../screen/SendForgot';

// Ensure the correct header components exist
import HeaderDefault from '../components/Header/default';
import HeaderName from '../components/Header/defaultwithname';

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ header: (props) => <HeaderDefault {...props} /> }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ header: (props) => <HeaderDefault {...props} /> }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ header: (props) => <HeaderDefault {...props} /> }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{ header: (props) => <HeaderDefault {...props} /> }}
      />
      <Stack.Screen
        name="SendForgot"
        component={SendForgot}
        options={{
          header: (props) => <HeaderName {...props} name="Masukan Password" />,
        }}
      />
    </Stack.Navigator>
  );
}
