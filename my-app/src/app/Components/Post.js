"use client";
import React, { useState } from "react";
import './Post.css';
// import axios from "axios";
import { io } from "socket.io-client";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const socket = io('http://localhost:3001');

const Post = ({ posts, handleLike, handleComment }) => {

  // const [likes, setLikes] = useState(post?.likes);
  const [comment, setComment] = useState('');

  return (
    <div className="p-with">
      {
        posts?.map((post) => {
          return (
            <div className="post" style={{ marginBottom: 20 }}>
              <img src={post?.imageUrl} alt="Post" width={200} height={200} />
              <p>Description: {post?.description}</p>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <div style={{ marginRight: 10 }} onClick={() => handleLike(post)}>
                  <CiHeart size="25px" color="red" />
                  <span>{post?.likes}</span>
                </div>

                <div className="like">
                  <FaRegComment size="20px" color="red" />
                  <span>{post?.comments?.length}</span>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ marginRight: 10 }}
                />
                <div
                  onClick={() => {
                    setComment('')
                    handleComment(post, comment)
                  }}>
                  <IoMdSend size="25px" color="red" />
                </div>
              </div>


              <div className="p-withs">
                {/* <p>Likes: {post?.likes}</p> */}
                <p>Comments: {post?.comments.map((item, index) => {
                  return (<p>{index + 1}. {item}</p>)
                })}</p>
              </div>
              {/* <div className="p-withs">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <p className="f-color" onClick={() => {
                  setComment('')
                  handleComment(post, comment)
                }}>Comment</p>
              </div> */}
            </div>
          )
        })
      }
    </div>
  );
};

export default Post;
