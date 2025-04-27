import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { styles } from '../../styles/HomeStyles';

interface HeaderProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onClearSearch: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onProfilePress: () => void;
  onSubmit: () => void;  // Added this prop
}

export default function HomeHeaderAndSearch({
  searchText,
  onSearchTextChange,
  onClearSearch,
  onFocus,
  onBlur,
  onProfilePress,
  onSubmit
}: HeaderProps) {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <Svg width={52} height={52} viewBox="0 0 24 24" fill="#000">
            <Path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products and press Enter..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={onSearchTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmit}  // This triggers when Enter is pressed
          returnKeyType="search"       // Shows "Search" on keyboard
          blurOnSubmit={false}        // Keeps keyboard open after submit
        />
        {searchText ? (
          <TouchableOpacity style={styles.clearButton} onPress={onClearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
}