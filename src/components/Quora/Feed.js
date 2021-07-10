import React, { useEffect, useState } from 'react';
import '../../css/Quora/Feed.css';
import db from '../../firebase';
import Post from './Post';

function Feed({ tag, university }) {
    const [posts, setPosts] = useState([]);
    const [dummyPosts, setDummyPosts] = useState([]);

    const checkTag = tags => {
        for (let i = 0; i < tags.length; i++) {
            let currTag = tags[i];
            if (currTag === tag) {
                // console.log(currTag, tag);
                return true;
            }
            // else console.log('------ unused -------', currTag);
        }
        return false;
    };

    const checkUniv = univ => {
        return univ === university;
    };

    const checkArray = newPosts => {
        // console.log('current tag is:', tag);
        let updatedPost = [];
        // eslint-disable-next-line array-callback-return
        newPosts.map(post => {
            if (
                checkTag(post.questions.tags) &&
                (university === '' || checkUniv(post.questions.univComp))
            ) {
                updatedPost.push(post);
            }
        });
        console.log(updatedPost);
        return updatedPost;
    };

    useEffect(() => {
        console.log(tag);
        db.collection('questions')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot =>
                setPosts(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        questions: doc.data(),
                    }))
                )
            );
        console.log(posts);
        setDummyPosts(checkArray(posts));
        // setPosts(checkArray(posts));
    }, [tag, university]);

    return (
        <div className="feed">
            {/* <QuoraBox /> */}
            {dummyPosts.map(({ id, questions }) => (
                <Post
                    key={id}
                    Id={id}
                    question={questions.question}
                    imageUrl={questions.imageUrl}
                    timestamp={questions.timestamp}
                    users={questions.user}
                    upVote={questions.upVote}
                    downVote={questions.downVote}
                />
            ))}
        </div>
    );
}

export default Feed;
