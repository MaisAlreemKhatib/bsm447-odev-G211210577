import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import ListeEkrani from './ListeEkrani';
import DetayEkrani from './DetayEkrani';
import KaydedilenlerEkrani from './KaydedilenlerEkrani';
import { KayitSaglayici } from './Kayitlar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AltSekmeler() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#b71c1c',
        tabBarInactiveTintColor: '#555555',
      }}
    >
      <Tab.Screen
        name="Liste"
        component={ListeEkrani}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>☰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Kaydedilenler"
        component={KaydedilenlerEkrani}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: 22 }}>{focused ? '★' : '☆'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <KayitSaglayici>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="AnaEkran"
            component={AltSekmeler}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detay"
            component={DetayEkrani}
            options={{ title: 'Pilot Detayı' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </KayitSaglayici>
  );
}