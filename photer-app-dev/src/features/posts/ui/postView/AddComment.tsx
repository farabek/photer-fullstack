import { IconSprite } from '@/shared/ui';
import { Button } from '@/shared/ui/button/Button';
import { Textarea } from '@/shared/ui/textarea/Textarea';
import React, { ReactNode, useState } from 'react';
import { useAddCommentMutation } from '../../api/postsApi';

type Props = {
  postId: string;
};

export const AddComment = ({ postId }: Props): ReactNode => {
  const [onWriteComment, setOnWriteComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handlePublishComment = async () => {
    if (!commentText.trim()) return;

    try {
      console.log('=== ADD COMMENT DEBUG ===', {
        postId,
        text: commentText,
        timestamp: new Date().toISOString(),
      });

      await addComment({ postId, text: commentText.trim() }).unwrap();

      // Очищаем форму после успешного добавления
      setCommentText('');
      setOnWriteComment(false);

      console.log('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setOnWriteComment(false);
  };

  return (
    <div className="border-dark-100 flex border-b-[1px] px-[24px] py-[18px]">
      {onWriteComment ? (
        <div className="flex w-full justify-between">
          <Textarea
            placeholder="Write a comment..."
            className="w-full"
            value={commentText}
            onValueChange={setCommentText}
            disabled={isLoading}
            data-testid="comment-textarea"
          />
          <div className="flex flex-col items-end justify-between">
            <button
              onClick={handleCancel}
              className="border-hidden outline-none"
              disabled={isLoading}
            >
              <IconSprite iconName="close" />
            </button>
            <Button
              variant="text"
              className="border-hidden pr-0 outline-none"
              onClick={handlePublishComment}
              disabled={isLoading || !commentText.trim()}
              data-testid="publish-comment-button"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="text-light-900 hover:text-light-900 cursor-pointer pl-0 font-light"
          onClick={() => setOnWriteComment(true)}
          data-testid="add-comment-button"
        >
          Add a Comment...
        </button>
      )}
    </div>
  );
};
