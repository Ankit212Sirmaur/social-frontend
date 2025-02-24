import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const createComment = createAsyncThunk(
    "comment/create",
    async (body) => {
        try {
            const response = await axiosClient.post("/comments/create", body);
            return response.result.comment;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const fetchPostComments = createAsyncThunk(
    "comments/fetchByPost",
    async (postId) => {
        try {
            const response = await axiosClient.post(`/comments/getComment`, postId);
            return { postId, comments: response.result.comments };
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const deleteComment = createAsyncThunk(
    "comment/delete",
    async (commentId) => {
        try {
            await axiosClient.delete(`/comments/${commentId}`);
            return commentId;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        commentsByPost: {}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                state.commentsByPost[postId] = comments;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                const comment = action.payload;
                if (!state.commentsByPost[comment.post]) {
                    state.commentsByPost[comment.post] = [];
                }
                state.commentsByPost[comment.post].unshift(comment);
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const commentId = action.payload;
                Object.keys(state.commentsByPost).forEach(postId => {
                    state.commentsByPost[postId] = state.commentsByPost[postId].filter(
                        comment => comment._id !== commentId
                    );
                });
            });
    }
});

export default commentsSlice.reducer;