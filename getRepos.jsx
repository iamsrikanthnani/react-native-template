import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import useRepositories from './src/queries/useRepositories';

const RepositoryList = () => {
  const [searchValue, setSearchValue] = useState('');

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useRepositories({searchKey: searchValue});

  // Function to render each item in the FlatList
  const renderItem = ({item, index}) => {
    return (
      <View
        style={styles.itemContainer}
        key={`${item?.name}_${item?.id}_${index}`}>
        <View style={styles.itemInfo}>
          <View style={styles.row}>
            {item?.owner?.avatar_url && (
              <Image
                source={{uri: item?.owner?.avatar_url}}
                style={styles.profilePic}
              />
            )}
            {item?.owner?.login && (
              <Text style={styles.description}>{item?.owner?.login}</Text>
            )}
          </View>
          {item?.name && (
            <Text style={[styles.title, {marginTop: 4}]}>{item?.name}</Text>
          )}
          {item?.description && (
            <Text
              style={[styles.description, {marginTop: 4}]}
              numberOfLines={3}>
              {item?.description}
            </Text>
          )}
          <View style={styles.bottomRow}>
            {item?.stargazers_count && (
              <Text style={styles.description}>☆ {item?.stargazers_count}</Text>
            )}
            {item?.language && (
              <Text style={[styles.description, {marginLeft: 8}]}>
                {`</> ${item?.language}`}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Function to render a loading indicator while fetching data
  const renderLoadingIndicator = () => (
    <ActivityIndicator size="large" color="#000" style={{marginTop: 16}} />
  );

  // Function to render the FlatList footer for pagination
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return renderLoadingIndicator();
    }
    return null;
  };

  // Function to handle end reached
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    // Fetch the initial data when the component mounts
    fetchNextPage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Repositories</Text>
      <FlatList
        data={(data?.pages && data?.pages?.flatMap(page => page?.items)) || []}
        keyExtractor={(item, index) => `${item?.name}_${item?.id}_${index}`}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search repositories"
              value={searchValue}
              onChangeText={text => setSearchValue(text)}
            />
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#000"
                style={{marginTop: 54}}
              />
            ) : null}
          </>
        }
        ListEmptyComponent={
          !isLoading && (
            <Text style={[styles.description, {marginTop: 24}]}>
              No data found!
            </Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 54,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    paddingBottom: 12,
    marginLeft: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 16,
  },
  profilePic: {
    width: 20,
    height: 20,
    borderRadius: 24,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default RepositoryList;
