import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto';
import { ref } from 'vue';

const user = ref(new ReadUserResponseDto());

const setUser = (newUser: ReadUserResponseDto) => {
  console.log('setUser!')
  user.value = newUser;
};

export function UserStore() {
  return {
    user,
    setUser,
  };
}
