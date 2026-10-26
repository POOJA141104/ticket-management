import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import api from "../../utils/api";
import { PageHeader, Card, Icon } from "../../components/UI";
import { COLORS } from "../../theme/colors";

export default function MasterMenuScreen({ navigation }) {
  const [counts, setCounts] = useState({
    departments: 0,
    programmes: 0,
    blocks: 0,
    rooms: 0,
    roles: 0,
    users: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadCounts = async () => {
    try {
      const [d, p, b, rm, ro, u] = await Promise.allSettled([
        api.get("/departments"),
        api.get("/programmes"),
        api.get("/blocks"),
        api.get("/rooms"),
        api.get("/roles"),
        api.get("/users"),
      ]);
      setCounts({
        departments: d.status === "fulfilled" ? d.value.data?.data?.length || 0 : 0,
        programmes: p.status === "fulfilled" ? p.value.data?.data?.length || 0 : 0,
        blocks: b.status === "fulfilled" ? b.value.data?.data?.length || 0 : 0,
        rooms: rm.status === "fulfilled" ? rm.value.data?.data?.length || 0 : 0,
        roles: ro.status === "fulfilled" ? ro.value.data?.data?.length || 0 : 0,
        users: u.status === "fulfilled" ? u.value.data?.data?.length || 0 : 0,
      });
    } catch (e) {
      // Non-critical, ignore
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const masterItems = [
    {
      title: "Departments",
      subtitle: "Academic & administrative depts",
      icon: "dept",
      screen: "Departments",
      count: counts.departments,
    },
    {
      title: "Programmes",
      subtitle: "Degrees and study programmes",
      icon: "programme",
      screen: "Programmes",
      count: counts.programmes,
    },
    {
      title: "Blocks",
      subtitle: "Campus buildings & facilities",
      icon: "block",
      screen: "Blocks",
      count: counts.blocks,
    },
    {
      title: "Rooms",
      subtitle: "Classrooms, labs & offices",
      icon: "room",
      screen: "Rooms",
      count: counts.rooms,
    },
    {
      title: "Roles",
      subtitle: "Access privileges & staff types",
      icon: "role",
      screen: "Roles",
      count: counts.roles,
    },
    {
      title: "Users",
      subtitle: "Accounts, staff & permissions",
      icon: "users",
      screen: "Users",
      count: counts.users,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadCounts();
          }}
          tintColor={COLORS.accent}
          colors={[COLORS.accent]}
        />
      }
    >
      <PageHeader
        title="Master Records"
        subtitle="Configure institution infrastructure, hierarchy & users"
        icon="ticket"
      />

      <View style={styles.grid}>
        {masterItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.cardWrapper}
          >
            <Card style={styles.menuCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.iconBox}>
                  <Icon name={item.icon} size={22} color={COLORS.accent} />
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.count} items</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.manageText}>Manage →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 70,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cardWrapper: {
    width: "48%",
  },
  menuCard: {
    padding: 16,
    marginBottom: 0,
    height: 160,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(99,210,190,0.1)",
    borderWidth: 1,
    borderColor: "rgba(99,210,190,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadge: {
    backgroundColor: COLORS.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.accent,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 6,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.text3,
    lineHeight: 14,
  },
  cardFooter: {
    marginTop: 4,
  },
  manageText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
  },
});

