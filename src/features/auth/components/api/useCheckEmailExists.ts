import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

type RequestType = {
  email: string;
};

export const useCheckEmailExists = (email: string) => {
  const [error, setError] = useState<Error | null>(null);

  const queryResult = useQuery(api.email.checkEmailExists, { email }); // Sử dụng useQuery để gọi query

  const isCheckingEmail = !queryResult && !error; // Kiểm tra trạng thái của query

  return {
    data: queryResult,
    isCheckingEmail,
    error,
  };
};
