import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

const DocumentationScreen = ({navigation, route}) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const fileUrl = route.params.fileUrl;
  const [loading, setLoading] = useState(false);

  const loadMarkdown = useCallback(async url => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch documentation: ${response.status}`);
      }
      const content = await response.text();
      const processedContent = processCheckboxes(content);
      setMarkdownContent(processedContent);
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось загрузить документацию. Пожалуйста, попробуйте позже.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const processCheckboxes = markdown => {
    return markdown
      .replace(/^\s*-\s*\[x\]\s+/gm, '✔️ ')
      .replace(/^\s*-\s*\[ \]\s+/gm, '❌ ');
  };

  const customRenderers = {
    image: props => {
      const {src} = props;
      return (
        <Image
          source={{uri: src}}
          style={{width: 200, height: 200, marginBottom: 10}}
        />
      );
    },
  };

  useEffect(() => {
    if (fileUrl) {
      loadMarkdown(fileUrl);
    }
  }, [fileUrl, loadMarkdown]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Markdown renderers={customRenderers}>{markdownContent}</Markdown>
        <TouchableOpacity
          style={styles.transparentButton}
          onPress={() => navigation.replace('Home')}>
          <Text style={styles.buttonText}>Вернуться в дом</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    color: '#666',
    marginBottom: 15,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default DocumentationScreen;
