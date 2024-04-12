"use client";
import React, { useEffect, useState } from 'react';
import FileUploder from './Components/FileUploder1';
import './Components/FileUploder.css';
import Post from './Components/Post';
import Loading from 'react-fullscreen-loading';

const page = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const ws = new WebSocket('ws://localhost:8080');

  const getUserId = () => {
    const idFromStorage = sessionStorage.getItem("ID_KEY");
    if (idFromStorage) {
      return idFromStorage;
    } else {
      return undefined
    }
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      let newData = JSON.parse(event.data)
      if (newData.type == 'add') {
        if (newData.data.userId != getUserId()) {
          setPosts((prevPosts) => {
            return [...prevPosts, newData.data]
          })
        }
      } else {
        setPosts((prevPosts) => {
          let otherPosts = prevPosts.map(item => {
            return (item.id == newData.data.id) ? newData.data : item
          })
          return otherPosts
        })
      }
      // Handle received message
    };

    return () => {
      // ws.close();
    };
  }, []);
  const sendMessage = (post) => {
    // Send message to WebSocket server
    ws.send(post);
  };
  const handleLike = async (post) => {
    let newObj = { ...post, likes: Number(post?.likes) + 1 }
    setPosts((prevPosts) => {
      let otherPosts = prevPosts.map(item => {
        return (item.id == post.id) ? newObj : item
      })
      return otherPosts
    })
    // console.log('@Final...like', newObj, post?.like)
    sendMessage(JSON.stringify({ type: 'edit', data: newObj }))
  };

  const handleComment = async (post, comment) => {
    let newObj = { ...post, comments: [...post.comments, comment] }
    setPosts((prevPosts) => {
      let otherPosts = prevPosts.map(item => {
        return (item.id == post.id) ? newObj : item
      })
      return otherPosts
    })
    // console.log('@Final...comment', newObj)
    sendMessage(JSON.stringify({ type: 'edit', data: newObj }))
  };
  const onSubmit = (obj) => {
    // setLoading(true)
    console.log('@Final...', obj)
    setPosts([...posts, obj])
    sendMessage(JSON.stringify({ type: 'add', data: obj }))
    setLoading(false)
  }
  return (
    <div className='fileupload'>
      <h1>Upload a Photo</h1>
      <FileUploder onSubmit={onSubmit} setLoading={setLoading} />
      <Post
        posts={posts}
        handleLike={handleLike}
        handleComment={handleComment}
      />
      <Loading loading={loading} background="rgba(255,255,255,0.4)" loaderColor="#3498db" />
    </div>
  );
}

export default page


// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>app/page.tsx</code>
//         </p>
//         <div>
//           <a
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className={styles.vercelLogo}
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className={styles.center}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className={styles.grid}>
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Docs <span>-&gt;</span>
//           </h2>
//           <p>Find in-depth information about Next.js features and API.</p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Learn <span>-&gt;</span>
//           </h2>
//           <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Templates <span>-&gt;</span>
//           </h2>
//           <p>Explore starter templates for Next.js.</p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Deploy <span>-&gt;</span>
//           </h2>
//           <p>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }
