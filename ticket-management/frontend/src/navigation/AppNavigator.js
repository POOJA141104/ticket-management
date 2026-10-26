import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/transactions/DashboardScreen";
import RaiseComplaintScreen from "../screens/transactions/RaiseComplaintScreen";
import ComplaintsScreen from "../screens/transactions/ComplaintsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MasterMenuScreen from "../screens/master/MasterMenuScreen";
import DepartmentsScreen from "../screens/master/DepartmentsScreen";
import ProgrammesScreen from "../screens/master/ProgrammesScreen";
import BlocksScreen from "../screens/master/BlocksScreen";
import RoomsScreen from "../screens/master/RoomsScreen";
import RolesScreen from "../screens/master/RolesScreen";
import UsersScreen from "../screens/master/UsersScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";

// Components
import Header from "../components/Header";
import { Icon, Spinner } from "../components/UI";
import { COLORS } from "../theme/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MasterStack = createNativeStackNavigator();

// Stack for Master screens (Menu -> Detail Screens)
function MasterStackNavigator() {
  return (
    <MasterStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <MasterStack.Screen name="MasterMenu" component={MasterMenuScreen} />
      <MasterStack.Screen name="Departments" component={DepartmentsScreen} />
      <MasterStack.Screen name="Programmes" component={ProgrammesScreen} />
      <MasterStack.Screen name="Blocks" component={BlocksScreen} />
      <MasterStack.Screen name="Rooms" component={RoomsScreen} />
      <MasterStack.Screen name="Roles" component={RolesScreen} />
      <MasterStack.Screen name="Users" component={UsersScreen} />
    </MasterStack.Navigator>
  );
}

// Bottom Tab Navigator for Logged In User
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { isSuperAdmin, canRaise } = useAuth();

  // Dynamic tab bar height & padding for iPhone 13 notch and home indicator
  const bottomInset = Math.max(insets.bottom, 8);
  const tabHeight = 54 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg2,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.text3,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => <Icon name="dashboard" size={18} color={color} />,
        }}
      />

      {canRaise() && (
        <Tab.Screen
          name="Raise"
          component={RaiseComplaintScreen}
          options={{
            tabBarLabel: "Raise",
            tabBarIcon: ({ color }) => <Icon name="raise" size={18} color={color} />,
          }}
        />
      )}

      <Tab.Screen
        name="Complaints"
        component={ComplaintsScreen}
        options={{
          tabBarLabel: "Complaints",
          tabBarIcon: ({ color }) => <Icon name="complaint" size={18} color={color} />,
        }}
      />

      {isSuperAdmin() && (
        <Tab.Screen
          name="Master"
          component={MasterStackNavigator}
          options={{
            tabBarLabel: "Master Data",
            tabBarIcon: ({ color }) => <Icon name="ticket" size={18} color={color} />,
          }}
        />
      )}

      {isSuperAdmin() && (
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            tabBarLabel: "Reports",
            tabBarIcon: ({ color }) => <Icon name="report" size={18} color={color} />,
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Icon name="user" size={18} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Container
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner message="Starting TicketPro…" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg2} />
      <View style={styles.appContainer}>
        {user ? (
          <>
            <Header />
            <MainTabNavigator />
          </>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
