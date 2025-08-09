import { TextInput, type TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const borderColor = useThemeColor(
    { light: lightBorderColor, dark: darkBorderColor },
    "text"
  );

  const placeholderTextColor = useThemeColor(
    { light: lightPlaceholderColor, dark: darkPlaceholderColor },
    "tabIconDefault"
  );

  return (
    <TextInput
      style={[
        { color, borderBottomColor: borderColor, borderBottomWidth: 1 },
        style,
      ]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}
