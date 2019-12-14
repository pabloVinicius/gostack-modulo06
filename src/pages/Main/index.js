import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

const Main = ({ navigation }) => {
  const [users, changeUsers] = useState([]);
  const [newUser, changeNewUser] = useState('');
  const [loading, changeLoading] = useState(false);

  const getStorage = async () => {
    const myUsers = await AsyncStorage.getItem('users');

    if (myUsers) {
      changeUsers(JSON.parse(myUsers));
    }
  };

  useEffect(() => {
    getStorage();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleAddUser = async () => {
    changeNewUser('');
    changeLoading(true);
    await api
      .get(`/users/${newUser}`)
      .then(response => {
        const { name, login, bio, avatar_url: avatar } = response.data;

        const haveUser = users.find(el => el.login === login);

        if (haveUser) {
          Alert.alert('Usuário já adicionado');
        } else {
          changeUsers([...users, { name, login, bio, avatar }]);
        }

        changeLoading(false);
        Keyboard.dismiss();
      })
      .catch(() => {
        Alert.alert('Usuário não encontrado');
        changeLoading(false);
        Keyboard.dismiss();
      });
  };

  const handleNavigate = user => {
    navigation.navigate('User', { user });
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={text => changeNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>
      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>
            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
};

Main.navigationOptions = {
  title: 'Usuários',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Main;
