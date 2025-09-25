'use client';

import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { EditPost } from '@/features/posts/ui/postEdit/EditPost';
import { EllipsisMenu } from '@/features/posts/ui/postView/EllipsisMenu';
import { ViewPost } from '@/features/posts';
import { PostModalWrapper } from '@/features/posts/ui/postView/PostWrapper';
import { PostType } from '@/features/posts/lib/post.types';
import { usePostModal } from '@/features/posts/hooks/view/usePostModal';
import { useGetPostQuery } from '@/features/posts/api/postsApi';

type Props = {
  post: PostType;
  onCloseAction: () => void;
  allUserPosts?: PostType[]; // Все посты пользователя для создания виртуального поста
};

export const PostModal = ({
  onCloseAction,
  post,
  allUserPosts,
}: Props): ReactNode => {
  const [isEdit, setIsEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render when needed

  // Fetch the latest post data from cache to reflect any updates
  // Use post.id as string (CUID format) - always fetch real post data
  // Skip query for virtual posts from main page (they already have all data)
  const isVirtualPostFromMainPage =
    post.id.startsWith('virtual-') && !post.id.includes('profile');
  const { data: latestPost, refetch } = useGetPostQuery(post.id, {
    // Force refetch when cache is invalidated (only for real posts)
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: isVirtualPostFromMainPage, // Skip for virtual posts from main page
  });

  // Force refetch when component mounts or post changes (only for real posts)
  useEffect(() => {
    if (!isVirtualPostFromMainPage) {
      console.log('=== FORCING REFETCH ON MOUNT ===', {
        postId: post.id,
        isEdit,
      });
      refetch();
    }
  }, [post.id, refetch, isEdit, isVirtualPostFromMainPage]);

  // Use latest post data for real posts, fallback to props
  const currentPost = latestPost || post;

  // Create virtual post for viewing multiple photos (only in view mode)
  const createVirtualPostForView = useCallback((): PostType => {
    // Check if this is a virtual post from the main page
    const isVirtualPostFromMainPage =
      post.id.startsWith('virtual-') && !post.id.includes('profile');

    console.log('=== CREATE VIRTUAL POST DEBUG ===', {
      postId: post.id,
      isVirtualPostFromMainPage,
      hasCurrentPost: !!currentPost,
      currentPostDescription: currentPost?.description,
      postDescription: post.description,
      allUserPostsCount: allUserPosts?.length || 0,
      isEdit: isEdit,
      shouldCreateVirtual: !!(
        allUserPosts &&
        allUserPosts.length > 1 &&
        !isEdit
      ),
      timestamp: new Date().toISOString(),
    });

    // Special handling for virtual posts from main page
    if (isVirtualPostFromMainPage) {
      console.log('=== HANDLING VIRTUAL POST FROM MAIN PAGE ===', {
        virtualPostId: post.id,
        userId: post.owner.userId,
        virtualPostDescription: post.description,
        photosCount: post.photos?.length || 0,
        timestamp: new Date().toISOString(),
      });

      // For virtual posts from main page, we already have all photos
      // Just return the post as is, but ensure it has the correct description
      return {
        ...post,
        // Keep the description from the virtual post (which should now be from the last post)
        description: post.description,
      };
    }

    // Use the most up-to-date post data available
    const latestPost = currentPost || post;

    if (!allUserPosts || allUserPosts.length <= 1 || isEdit) {
      return latestPost; // Return original post for editing or single post users
    }

    // Собираем все фото пользователя из всех постов (только для просмотра)
    const allPhotos: string[] = [];
    allUserPosts.forEach((userPost) => {
      if (userPost.photos && userPost.photos.length > 0) {
        allPhotos.push(...userPost.photos);
      }
    });

    const virtualPost = {
      ...latestPost,
      id: `virtual-profile-${latestPost.owner.userId}`,
      photos: allPhotos,
      // Keep the original description for display, not the generic "All photos from..." text
      description: latestPost.description,
    };

    console.log('=== VIRTUAL POST CREATED ===', {
      virtualPostId: virtualPost.id,
      description: virtualPost.description,
      photosCount: virtualPost.photos.length,
      sourcePostId: latestPost.id,
      timestamp: new Date().toISOString(),
    });

    return virtualPost;
  }, [allUserPosts, isEdit, post, currentPost]);

  // Get the post to display based on mode
  const displayPost = createVirtualPostForView();
  const isVirtualPost = displayPost.id.startsWith('virtual-');

  // Debug logging for PostModal
  console.log('=== POST MODAL DEBUG ===', {
    postId: post.id,
    isEdit,
    displayPostId: displayPost.id,
    isVirtualPost,
    hasLatestPost: !!latestPost,
    allUserPostsCount: allUserPosts?.length || 0,
    usingVirtualForView: isVirtualPost && !isEdit,
    usingRealForEdit: !isVirtualPost && isEdit,
    propDescription: post.description,
    latestDescription: latestPost?.description,
    displayDescription: displayPost?.description,
    displayPhotosCount: displayPost?.photos?.length || 0,
    timestamp: new Date().toISOString(),
  });

  // Function to handle post update from EditPost component
  const handlePostUpdated = (updatedPost: PostType) => {
    console.log('=== HANDLE POST UPDATED - START ===', {
      postId: updatedPost.id,
      updatedPostDescription: updatedPost.description,
      updatedPostDescriptionLength: updatedPost.description?.length || 0,
      currentPostDescription: currentPost?.description,
      currentPostDescriptionLength: currentPost?.description?.length || 0,
      originalPostDescription: post.description,
      originalPostDescriptionLength: post.description?.length || 0,
      latestPostDescription: latestPost?.description,
      latestPostDescriptionLength: latestPost?.description?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // Force a refetch to get the latest data after cache update
    console.log('=== HANDLE POST UPDATED - FORCING REFETCH ===');
    refetch();

    // Cache is already updated manually in the API mutation onQueryStarted
    // Just trigger a re-render to show updated data
    setRefreshKey((prev) => prev + 1);

    console.log('=== HANDLE POST UPDATED - REFRESH TRIGGERED ===', {
      refreshKey: refreshKey + 1,
      timestamp: new Date().toISOString(),
    });
  };

  // Function to handle closing edit mode and refresh data
  const handleCloseEdit = () => {
    console.log('=== HANDLE CLOSE EDIT DEBUG ===', {
      postId: post.id,
      currentDescription: currentPost?.description,
      latestDescription: latestPost?.description,
      originalDescription: post.description,
      displayPostDescription: displayPost?.description,
      isVirtualPost: isVirtualPost,
      timestamp: new Date().toISOString(),
    });
    setIsEdit(false);
    // Force refetch to get latest data after editing
    console.log('Forcing refetch after edit for post:', post.id);
    refetch();
    // Force re-render to ensure UI updates
    setRefreshKey((prev) => prev + 1);
  };

  const { userId, isOwner, handleDelete } = usePostModal({
    onCloseAction,
    post: post, // Always use real post for ownership checks
  });

  console.log('=== POST MODAL RENDER ===', {
    postId: currentPost?.id,
    isEditMode: isEdit,
    hasPhotos: !!(currentPost?.photos && currentPost.photos.length > 0),
    photosCount: currentPost?.photos?.length || 0,
    willShowViewPost: !isEdit,
    hasUserId: !!userId,
    userIdValue: userId,
    isOwnerValue: isOwner,
    isAuthorizedParam: !!userId,
    timestamp: new Date().toISOString(),
  });

  return (
    <PostModalWrapper key={refreshKey} onCloseAction={onCloseAction}>
      {!isEdit ? (
        <ViewPost
          isAuthorized={!!userId}
          post={displayPost}
          isOwner={isOwner}
          realPostId={isVirtualPost ? post.id : undefined}
        >
          {isOwner && !isVirtualPostFromMainPage && (
            <EllipsisMenu
              menuItems={[
                {
                  title: 'Edit post',
                  iconName: 'edit-2-outline',
                  callback: (): void => {
                    if (!isVirtualPostFromMainPage) {
                      setIsEdit(true);
                    }
                  },
                },
                {
                  title: 'Delete post',
                  iconName: 'trash-outline',
                  callback: handleDelete,
                },
              ]}
            />
          )}
        </ViewPost>
      ) : (
        <EditPost
          post={currentPost} // Use latest post data for editing (includes cache updates)
          onReturnToView={handleCloseEdit}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </PostModalWrapper>
  );
};
