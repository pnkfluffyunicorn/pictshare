import React, { useState, useEffect } from "react";
import axios from "axios";

const Likes = ({likes, imageID, authInfo}) => {
  const [hasLiked, setHasLiked] = useState(null);
  const authToken = localStorage.getItem("myToken");

  const likePost = async e => {
    fetch(`api/posts/like/${imageID}`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken
      }
    })
      .then(res => {
        //  forward the user to signup if not authenticated
        //  CHANGE TO POP UP SAYING ONLY LOGGED IN USERS CAN
        //  LIKE OR COMMENT ON POSTS
        if (res.status === 401) {
          window.location.href = "/signup";
        }
        setHasLiked(true);
      })
      .catch(err => {
        console.error("stat", err.status);
      });
  };
  const unLikePost = e => {
    fetch(`api/posts/unlike/${imageID}`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken
      }
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = "/login";
        }
        setHasLiked(false);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    if (likes.length) {
      authInfo.then( res => {
        if (res) {
          const myLikes = likes.some(like => like.user.toString() === res._id);
          setHasLiked(myLikes);
        }
        // ELSE USER IS NOT LOGGED IN
      })
    }
  }, []);

  if (hasLiked) {
    return (
      <div className="image_card_like" onClick={e => unLikePost(e)}>
        &#9829;
      </div>
    );
  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
      &#9825;
    </div>
  );
};

const CommentsBox = imageInfo => {
  const [isCommenting, setIsCommenting] = useState(null);
  const [comment, setComment] = useState('');

  const seeCommentBox = e => {
    setIsCommenting(true);
  };
  const closeCommentBox = () => {
    setIsCommenting(false);
  };
  const onChange = e => setComment(e.target.value);
  const onSubmit = async e => {
    e.preventDefault();
    const auth_token = localStorage.getItem("myToken");

    const commentInfo = {
      text: comment
    };
    // console.log(commentInfo);
    const body = JSON.stringify(commentInfo);
    const config = {
      headers: {
        "x-auth-token": auth_token,
        "content-type": "application/json"
      }
    };
    axios
      .post(`api/posts/comment/${imageInfo.imageID}`, body, config)
      .then(res => {
        console.log("comment posted:", res.data);
        setIsCommenting(false);
        console.log(res.data);
      })
      .catch(err => {
        console.error("myerror: ", err.response);
      });
  };

  if (isCommenting) {
    return (
      <div className="image_card_leave_comment">
        <form onSubmit={e => onSubmit(e)} className="add_comment_form">
          <input
            name="comment"
            type="text"
            value={comment}
            onChange={e => onChange(e)}
            placeholder="comment"
            required="required"
            className="add_comment_box"
          />
          <button type="submit" className="add_comment_submit">
            &#x2713;
          </button>
        </form>
        <button className="add_comment_exit" onClick={() => closeCommentBox()}>
          &#x2717;
        </button>
      </div>
    );
  }

  return (
    <div className="image_card_comment_text" onClick={e => seeCommentBox(e)}>
      {imageInfo.comments[0] ? imageInfo.comments[0].text : "add comment"}
    </div>
  );
};

//  CHANGE COMMENTS TO TAGS, MAKE EACH ONE LINK TO SEARCH WHEN CLICKED

const ImageCard = ({ imageData, addOverlay, authInfo }) => {
  return (
    <div className="image_card">
      <div className="image_card_name">
        <div className="image_card_name_text">{imageData.user}</div>
      </div>
      <div className="pic_frame">
        <img
          className="image_card_image"
          src={`${imageData.image}`}
          alt="database_image"
          onClick={() => addOverlay(imageData)}
        />
      </div>
      <div className="image_card_comment_like">
        <Likes likes={imageData.likes} imageID={imageData.imageID} authInfo={authInfo}/>
        <CommentsBox
          comments={imageData.comments}
          imageID={imageData.imageID}
        />
      </div>
    </div>
  );
};

export default ImageCard;