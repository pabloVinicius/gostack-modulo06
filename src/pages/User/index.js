import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

const User = ({ navigation }) => {
  const [loading, changeLoading] = useState(true);
  const [stars, changeStars] = useState([]);
  const [page, changePage] = useState(1);
  const [stopRequest, changeStopRequest] = useState(false);
  const user = navigation.getParam('user');

  const loadData = () => {
    if (!stopRequest) {
      api
        .get(`/users/${user.login}/starred`, {
          params: {
            page,
          },
        })
        .then(response => {
          changeStars([...stars, ...response.data]);
          changeLoading(false);
        })
        .catch(() => {
          changeLoading(false);
          changeStopRequest(true);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [page]);

  const handleRefresh = () => {
    changeLoading(true);
    changePage(0);
    changeStars([]);
  };

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 20 }}
          color="#7159c1"
        />
      ) : (
        <Stars
          data={stars}
          onRefresh={handleRefresh}
          refreshing={loading}
          keyExtractor={star => `${star.id}`}
          onEndReachedThreshold={0.2}
          onEndReached={() => changePage(page + 1)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
};

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

export default User;
