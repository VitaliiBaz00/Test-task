import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {formatText} from '../helpers/text';
import {ArrowBackIcon} from '../icons';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const DetailsScreen = () => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const [isPortrait, setIsPortrait] = useState(
    Dimensions.get('screen').height > Dimensions.get('screen').width,
  );
  const navigation = useNavigation();
  const book = params?.book;

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({screen}) => {
      setIsPortrait(screen.height > screen.width);
    });
    return () => listener.remove();
  }, []);

  if (!book) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={[styles.container]}>
        <Pressable onPress={navigation.goBack} style={styles.goBack}>
          <ArrowBackIcon />
        </Pressable>
        <View style={[styles.content, !isPortrait && styles.landscapeContent]}>
          <Image
            source={{uri: book?.firstPreviewImage.watermarked}}
            style={[
              styles.greyBorder,
              isPortrait ? styles.portraitImage : styles.landscapeImage,
            ]}
          />
          <View>
            <Text style={[styles.itemHeader, styles.itemText]}>
              {formatText(book?.title).map((segment, index) => (
                <Text key={index} style={segment.style}>
                  {segment.text}
                </Text>
              ))}
            </Text>
            <Text style={styles.itemText}>
              {book?.author.details.publicName}
            </Text>
            <Text style={styles.itemText}>
              {Number(book?.price).toFixed(2) + ' €'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  itemHeader: {
    fontSize: 18,
    fontWeight: '600',
  },
  portraitImage: {
    aspectRatio: 1 / 2,
    width: '50%',
  },
  landscapeImage: {
    aspectRatio: 1 / 2,
    height: SCREEN_HEIGHT * 0.8,
  },
  itemText: {
    marginTop: 5,
    fontFamily: 'Roboto',
  },
  goBack: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
    top: 10,
  },
  greyBorder: {borderWidth: 1, borderColor: 'grey'},
  content: {
    alignItems: 'center',
  },
  landscapeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
});
