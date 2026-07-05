import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeed());
  }, []);

  return (
    <FeedUI
      orders={orders || []}
      handleGetFeeds={() => dispatch(fetchFeed())}
    />
  );
};
