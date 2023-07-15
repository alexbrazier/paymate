import { GetStaticProps } from 'next';
import { api } from '../api';

export { default } from '../views/Home';

const MINUTES = 60;
const revalidate = 60 * MINUTES;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await api.get('/provider');

    return {
      props: {
        providers: data.providers,
      },
      revalidate,
    };
  } catch {
    return {
      props: {
        providers: [],
      },
      revalidate: 60,
    };
  }
};
