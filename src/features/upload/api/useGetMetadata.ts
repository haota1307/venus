import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetMetadataProps {
  storageId: Id<'_storage'>;
}

export const useGetMetadata = ({ storageId }: UseGetMetadataProps) => {
  const data = useQuery(api.upload.getMetadata, { storageId });

  const isLoading = data === undefined;
  const isError = data === null; // Xác định nếu không có dữ liệu

  return { data, isLoading, isError };
};
