import { init } from '@paralleldrive/cuid2';

const createCUID = init({
    random: Math.random,
    length: 36,
});

export default createCUID;
