import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {SearchIcon} from '../icons';
import {formatText} from '../helpers/text';
import {useData} from '../hooks/useData';

const IMEM_IMAGE_HEIGHT = 150;

export const SearchScreen = () => {
  const [_page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('screen').width,
  );
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'Search'>>();

  const {data, loading, getData} = useData();
  const loadMoreResults = () => {
    setPage(prev => {
      getData(prev + 1, searchString);
      return prev + 1;
    });
  };

  const navigateToDetails = useCallback(
    (book: Book) => () => {
      navigation.navigate('Details', {book: book});
    },
    [navigation],
  );

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({screen}) => {
      setScreenWidth(screen.width);
    });
    return () => listener.remove();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Nach Material oder Autor*innen suchen"
            style={styles.input}
            value={searchString}
            onChangeText={e => setSearchString(e)}
          />
          <Pressable
            style={styles.searchButton}
            onPress={getData.bind(null, 1, searchString)}>
            <SearchIcon />
          </Pressable>
        </View>

        {loading && data.length < 1 ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={data}
            key={Dimensions.get('screen').width}
            numColumns={Math.floor(screenWidth / 180)}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({item}) => (
              <Pressable
                style={[styles.flatListItem, styles.greyBorder]}
                onPress={navigateToDetails(item)}>
                <Image
                  source={{uri: item.firstPreviewImage.watermarked}}
                  style={[styles.itemImage, styles.greyBorder]}
                />
                <Text style={[styles.itemHeader, styles.itemText]}>
                  {formatText(item.title).map((segment, index) => (
                    <Text key={index} style={segment.style}>
                      {segment.text}
                    </Text>
                  ))}
                </Text>
                <Text style={styles.itemText}>
                  {item.author.details.publicName}
                </Text>
                <Text style={styles.itemText}>
                  {Number(item.price).toFixed(2) + ' €'}
                </Text>
              </Pressable>
            )}
            onEndReached={loadMoreResults}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  searchBar: {
    marginTop: 15,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRightWidth: 0,
    paddingLeft: 10,
  },
  searchButton: {
    width: 50,
    height: 40,
    backgroundColor: 'teal',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    justifyContent: 'space-around',
    gap: IMEM_IMAGE_HEIGHT / 2,
    marginTop: IMEM_IMAGE_HEIGHT / 2,
  },
  flatListItem: {
    width: 150,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 10,
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemImage: {
    height: IMEM_IMAGE_HEIGHT,
    width: 'auto',
    marginTop: -IMEM_IMAGE_HEIGHT / 2,
  },
  itemText: {
    marginTop: 5,
    fontFamily: 'Roboto',
  },
  greyBorder: {borderWidth: 1, borderColor: 'grey'},
});
