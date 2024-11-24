import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

const DocumentationScreen = ({route}) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const fileUrl = route.params.fileUrl;
  const [loading, setLoading] = useState(false);

  const loadMarkdown = async url => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch documentation: ${response.status}`);
      }
      const content = await response.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error loading Markdown:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось загрузить документацию. Пожалуйста, попробуйте позже.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileUrl) {
      loadMarkdown(fileUrl);
    }
  }, [fileUrl]);

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
        <Markdown>{markdownContent}</Markdown>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentationScreen;
