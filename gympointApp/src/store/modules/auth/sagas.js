import { Alert } from 'react-native';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import api from '~/services/api';
import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { matriculation } = payload;

    /* Chamar a api (função "call") com o método indicado no primeiro parâmetro,
     com a url como segundo parâmetro (neste caso "sessions", como no Insomnia),
     e os dados passados à requsição como objeto no terceiro parâmetro ("email" e "password", como no Insomnia)
  */
    const response = yield call(api.post, 'signin', {
      id: Number(matriculation),
    });

    const { student_id } = response.data;

    if (!student_id) {
      Alert.alert('Erro no login', 'Verifique o número da sua matrícula');
      yield put(signFailure());
      return;
    }

    // Se passar na conferência do tipo de usuário, ponha os dados ("put") na action signInSuccess
    yield put(signInSuccess(student_id));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert(
      'Falha na autenticação',
      'Houve um erro no login. Verifique seus dados'
    );
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (err) {
    Alert.alert(
      'Falha no cadastro',
      'Houve um erro no cadastro. Verifique seus dados'
    );

    yield put(signFailure());
  }
}

/*
export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
} */

export function* signOut() {
  // yield put(signOut());
  // history.push('/');
}

export default all([
  // takeLatest('persist/REHYDRATE', setToken), // Persistir o token e manter autenticada a navegação
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);