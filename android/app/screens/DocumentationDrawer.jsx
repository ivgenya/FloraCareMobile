import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DocumentationScreen from '../screens/DocumentationScreen'; // Экран с документацией
import {ActivityIndicator, View} from 'react-native';

const Drawer = createDrawerNavigator();

const DocumentationDrawer = () => {
  const [sidebar, setSidebar] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const loadSidebar = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/_sidebar.md',
        );
        if (!response.ok) {
          throw new Error('Не удалось загрузить меню');
        }
        const text = await response.text();
        const links = parseSidebar(text);
        setSidebar(links);
      } catch (error) {
        console.error('Ошибка загрузки меню:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSidebar();
  }, []);

  const parseSidebar = mdContent => {
    const links = [];
    const regex = /\[([^\]]+)]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(mdContent)) !== null) {
      links.push({name: match[1], url: match[2]});
    }
    return links;
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName={sidebar[0].name}>
      {sidebar.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.name}
          component={DocumentationScreen}
          initialParams={{
            fileUrl: `https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/${
              item.url === '/' ? 'README.md' : item.url
            }`,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DocumentationDrawer;
