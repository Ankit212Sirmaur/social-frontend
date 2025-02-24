import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import Avatar from "../avatar/Avatar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { createComment, fetchPostComments, deleteComment } from "../../redux/slices/commentSlice";
import "./Post.scss";

function Post({ post }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState('');
    const comments = useSelector(state => 
        state.CommentReducer.commentsByPost[post._id] || []
    );

    useEffect(() => {
        dispatch(fetchPostComments(post._id));
    }, [post._id, dispatch]);

    async function handlePostLiked() {
        dispatch(likeAndUnlikePost({
            postId: post._id
        }));
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            dispatch(createComment({
                postId: post._id,
                text: newComment
            }));
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment(commentId));
    };

    return (
        <div className="Post">
            <div className="heading" onClick={() => navigate(`/profile/${post.owner._id}`)}>
                <Avatar src={post.owner?.avatar?.url} />
                <h4>{post.owner?.name}</h4>
            </div>
            <div className="content">
                <img src={post?.image?.url} alt="" />
            </div>
            <div className="footer">
                <div className="like" onClick={handlePostLiked}>
                    {post.isLiked ? <AiFillHeart style={{ color: 'red' }} className="icon" /> : <AiOutlineHeart className="icon" />}
                    <h4>{`${post.likesCount} likes`}</h4>
                </div>
                <p className="caption">{post.caption}</p>
                <h6 className="time-ago">{post?.timeAgo}</h6>

                {/* Comment Section */}
                <div className="comments-section">
                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>

                    {comments.map(comment => (
                        <div key={comment._id} className="comment">
                            <Avatar src={comment.author?.avatar?.url} />
                            <div className="comment-content">
                                <p>{comment.author?.name}</p>
                                <p>{comment.text}</p>
                                {comment.author?._id === post.owner?._id && (
                                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Post;