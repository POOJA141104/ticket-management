import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal as RNModal,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import Svg, {
  Path,
  Rect,
  Polyline,
  Polygon,
  Line,
  Circle,
} from "react-native-svg";
import { COLORS, STATUS_COLORS } from "../theme/colors";

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
export const Icon = ({ name, size = 18, color = COLORS.accent, style }) => {
  const strokeWidth = 1.8;
  const paths = {
    dashboard: (
      <>
        <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    complaint: (
      <>
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="10 9 9 9 8 9" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    raise: (
      <>
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    dept: (
      <>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="9 22 9 12 15 12 15 22" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    programme: (
      <>
        <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    block: (
      <>
        <Rect x="2" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="14" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="2" y="15" width="8" height="8" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="14" y="15" width="8" height="8" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    room: (
      <>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="9" y="14" width="6" height="8" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    role: (
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={color} strokeWidth={strokeWidth} />
    ),
    users: (
      <>
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    report: (
      <>
        <Line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    logout: (
      <>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    edit: (
      <>
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    trash: (
      <>
        <Polyline points="3 6 5 6 21 6" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    check: (
      <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth={strokeWidth} />
    ),
    close: (
      <>
        <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    alert: (
      <>
        <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    ticket: (
      <>
        <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    search: (
      <>
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    filter: (
      <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke={color} strokeWidth={strokeWidth} />
    ),
    assign: (
      <>
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="16 11 18 13 22 9" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    status: (
      <>
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="22 4 12 14.01 9 11.01" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    attach: (
      <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke={color} strokeWidth={strokeWidth} />
    ),
    export: (
      <>
        <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="7 10 12 15 17 10" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    chevronDown: (
      <Polyline points="6 9 12 15 18 9" stroke={color} strokeWidth={strokeWidth} />
    ),
    chevronRight: (
      <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth={strokeWidth} />
    ),
    user: (
      <>
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    lock: (
      <>
        <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    mail: (
      <>
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={strokeWidth} />
        <Polyline points="22 6 12 13 2 6" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    phone: (
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth={strokeWidth} />
    ),
    shield: (
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={strokeWidth} />
    ),
    settings: (
      <>
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    building: (
      <>
        <Path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M6 12H4a2 2 0 0 0-2 2v8h4" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M18 9h2a2 2 0 0 1 2 2v11h-4" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="10" y1="6" x2="10" y2="6.01" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="14" y1="6" x2="14" y2="6.01" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="10" y1="10" x2="10" y2="10.01" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="14" y1="10" x2="14" y2="10.01" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="10" y1="14" x2="10" y2="14.01" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="14" y1="14" x2="14" y2="14.01" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    key: (
      <>
        <Path d="M21 2l-2 2m-1.5 1.5L14 9a5 5 0 1 0 2 2l3.5-3.5M19 6l2 2" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    info: (
      <>
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    eye: (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    eyeOff: (
      <>
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth={strokeWidth} />
        <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
    refresh: (
      <>
        <Path d="M23 4v6h-6" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M1 20v-6h6" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={color} strokeWidth={strokeWidth} />
      </>
    ),
  };

  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {paths[name] || paths.ticket}
      </Svg>
    </View>
  );
};

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export const Btn = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  style,
  textStyle,
}) => {
  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
    md: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    lg: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  };

  const textSizes = {
    sm: { fontSize: 12 },
    md: { fontSize: 13 },
    lg: { fontSize: 15 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.accent,
      borderWidth: 0,
    },
    danger: {
      backgroundColor: COLORS.dangerBg,
      borderWidth: 1,
      borderColor: "rgba(248,113,113,0.3)",
    },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "rgba(99,210,190,0.25)",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    success: {
      backgroundColor: COLORS.successBg,
      borderWidth: 1,
      borderColor: "rgba(52,211,153,0.3)",
    },
  };

  const variantTextColors = {
    primary: "#071210",
    danger: COLORS.danger,
    ghost: COLORS.accent,
    outline: COLORS.text2,
    success: COLORS.success,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btnBase,
        sizeStyles[size],
        variantStyles[variant],
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantTextColors[variant]} />
      ) : (
        <View style={styles.btnContent}>
          {typeof children === "string" ? (
            <Text
              style={[
                styles.btnText,
                textSizes[size],
                { color: variantTextColors[variant] },
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({
  label,
  error,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  style,
  inputStyle,
  editable = true,
  rightElement,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error && styles.inputError,
          !editable && { opacity: 0.6 },
        ]}
      >
        {icon && (
          <View style={styles.inputIcon}>
            <Icon name={icon} size={16} color={focused ? COLORS.accent : COLORS.text3} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text3}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.textInput,
            icon && { paddingLeft: 38 },
            inputStyle,
          ]}
        />
        {rightElement && <View style={styles.inputRight}>{rightElement}</View>}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// ─── SELECT / DROPDOWN PICKER ────────────────────────────────────────────────
export const Select = ({ label, error, value, options = [], onValueChange, placeholder = "Select option" }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={[styles.inputContainer, error && styles.inputError]}
      >
        <Text
          style={[
            styles.selectText,
            !selectedOption && { color: COLORS.text3 },
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Icon name="chevronDown" size={14} color={COLORS.text2} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <RNModal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.selectModalContent}>
            <View style={styles.selectModalHeader}>
              <Text style={styles.selectModalTitle}>{label || "Select Option"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={16} color={COLORS.text2} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {options.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <TouchableOpacity
                    key={opt.value ?? idx}
                    onPress={() => {
                      onValueChange(opt.value);
                      setModalVisible(false);
                    }}
                    style={[
                      styles.selectOption,
                      isSelected && styles.selectOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        isSelected && { color: COLORS.accent, fontWeight: "700" },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <Icon name="check" size={16} color={COLORS.accent} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
};

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export const Textarea = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  numberOfLines = 4,
  style,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { minHeight: 90, alignItems: "flex-start" },
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text3}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.textInput, { minHeight: 80, paddingTop: 10 }]}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ status, children }) => {
  const s = STATUS_COLORS[status] || {
    bg: "rgba(139,168,162,0.14)",
    color: COLORS.text2,
    dot: COLORS.text2,
  };

  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: s.dot }]} />
      <Text style={[styles.badgeText, { color: s.color }]}>
        {children || status}
      </Text>
    </View>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, color = COLORS.accent, icon = "ticket" }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconBox, { backgroundColor: color + "18", borderColor: color + "33" }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, visible = true, children }) => (
  <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Icon name="close" size={15} color={COLORS.text2} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </View>
  </RNModal>
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, icon, action }) => (
  <View style={styles.pageHeader}>
    <View style={styles.pageHeaderLeft}>
      {icon && (
        <View style={styles.pageHeaderIconBox}>
          <Icon name={icon} size={22} color={COLORS.accent} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.pageHeaderTitle}>{title}</Text>
        {subtitle && <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {action && <View style={styles.pageHeaderAction}>{action}</View>}
  </View>
);

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export const Spinner = ({ message = "Loading…" }) => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size="large" color={COLORS.accent} />
    <Text style={styles.spinnerText}>{message}</Text>
  </View>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <View style={styles.dividerRow}>
    <View style={styles.dividerLine} />
    {label && <Text style={styles.dividerLabel}>{label}</Text>}
    <View style={styles.dividerLine} />
  </View>
);

// ─── ACTION BUTTONS (EDIT / DELETE) ──────────────────────────────────────────
export const ActionButtons = ({ onEdit, onDelete }) => (
  <View style={styles.actionButtonsRow}>
    {onEdit && (
      <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
        <Icon name="edit" size={15} color={COLORS.accent} />
      </TouchableOpacity>
    )}
    {onDelete && (
      <TouchableOpacity onPress={onDelete} style={styles.actionBtnDanger}>
        <Icon name="trash" size={15} color={COLORS.danger} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnText: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    height: "100%",
  },
  inputRight: {
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  selectText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: "flex-start",
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text2,
    fontWeight: "500",
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(4,8,16,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    width: "100%",
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  selectModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    width: "88%",
    maxWidth: 400,
  },
  selectModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectModalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accent,
  },
  selectOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  selectOptionSelected: {
    backgroundColor: "rgba(99,210,190,0.08)",
    borderRadius: 8,
  },
  selectOptionText: {
    color: COLORS.text,
    fontSize: 14,
  },
  pageHeader: {
    marginBottom: 18,
    gap: 12,
  },
  pageHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  pageHeaderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(99,210,190,0.1)",
    borderWidth: 1,
    borderColor: "rgba(99,210,190,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  pageHeaderTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  pageHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.text2,
    marginTop: 2,
  },
  pageHeaderAction: {
    marginTop: 4,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  spinnerText: {
    color: COLORS.text2,
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.text3,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(99,210,190,0.1)",
  },
  actionBtnDanger: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: COLORS.dangerBg,
  },
});

