import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Form, Input, SubmitButton } from './styles';
import api from '../../services/api';

const Main = () => {
  const [users, changeUsers] = useState([]);
  const [newUser, changeNewUser] = useState('');

  const handleAddUser = () => {
    api.get(`/users/${newUser}`).then(response => {
      const { name, login, bio, avatar_url: avatar } = response.data;

      changeUsers([...users, { name, login, bio, avatar }]);
      Keyboard.dismiss();
    });
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
        <SubmitButton onPress={handleAddUser}>
          <Icon name="add" size={20} color="#fff" />
        </SubmitButton>
      </Form>
    </Container>
  );
};

Main.navigationOptions = {
  title: 'Usuários',
};

export default Main;
