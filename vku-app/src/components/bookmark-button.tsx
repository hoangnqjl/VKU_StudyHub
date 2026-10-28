import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

type BookmarkButtonProps = {
  accessibilityLabel: string;
  selected: boolean;
  size: number;
  onPress: () => void;
};

export default function BookmarkButton({
  accessibilityLabel,
  selected,
  size,
  onPress,
}: BookmarkButtonProps) {
  const iconColor = selected ? '#FFFFFF' : '#64748B';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        selected && styles.selectedButton,
      ]}
    >
      <Feather
        name="bookmark"
        size={size * 0.44}
        color={iconColor}
        fill={selected ? iconColor : 'transparent'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.045,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  selectedButton: {
    borderColor: '#101D83',
    backgroundColor: '#101D83',
  },
});
