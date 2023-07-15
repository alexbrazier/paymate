import { GetStaticProps } from 'next';
import { api } from '../api';

export { default } from '../views/Home';

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/provider');

  return {
    props: {
      providers: data.providers,
    },
  };
};
