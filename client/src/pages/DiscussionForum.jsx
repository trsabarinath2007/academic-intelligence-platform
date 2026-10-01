import React, {
  useEffect,
  useState,
} from "react";

const API_URL =
  "http://localhost:5000/api/academic-intelligence/discussion";

function DiscussionForum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] =
    useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] =
    useState("Data Structures");

  const [commentText, setCommentText] =
    useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        API_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load discussions"
        );
      }

      setPosts(data.posts || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (event) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !content.trim() ||
      !subject.trim()
    ) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            subject,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create post"
        );
      }

      setPosts((prev) => [
        data.post,
        ...prev,
      ]);

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await fetch(
        `${API_URL}/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update like"
        );
      }

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const userId =
            JSON.parse(
              localStorage.getItem("user") ||
                "{}"
            )?._id;

          const likes =
            Array.isArray(post.likes)
              ? [...post.likes]
              : [];

          const index =
            likes.findIndex(
              (id) =>
                id.toString() ===
                userId?.toString()
            );

          if (index >= 0) {
            likes.splice(index, 1);
          } else if (userId) {
            likes.push(userId);
          }

          return {
            ...post,
            likes,
          };
        })
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const addComment = async (postId) => {
    const text =
      commentText[postId]?.trim();

    if (!text) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add comment"
        );
      }

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? data.post
            : post
        )
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const deletePost = async (postId) => {
    if (
      !window.confirm(
        "Delete this discussion post?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete post"
        );
      }

      setPosts((prev) =>
        prev.filter(
          (post) =>
            post._id !== postId
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="rounded-2xl bg-white p-8 text-center">
          Please log in to access the forum.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Academic Community
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Discussion Forum
          </h1>

          <p className="mt-2 text-gray-500">
            Ask academic questions, discuss
            topics and help each other learn.
          </p>
        </div>

        {/* Create Post */}
        <form
          onSubmit={createPost}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-800">
            Ask a Question
          </h2>

          <div className="mt-5 grid gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              maxLength={200}
              placeholder="Question title"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>
                Data Structures
              </option>
              <option>
                Database Management Systems
              </option>
              <option>
                Operating Systems
              </option>
              <option>
                Computer Networks
              </option>
              <option>
                Software Engineering
              </option>
              <option>
                Programming
              </option>
              <option>
                General
              </option>
            </select>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              maxLength={3000}
              rows={5}
              placeholder="Describe your question..."
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={creating}
              className="w-fit rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              {creating
                ? "Posting..."
                : "Create Post"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Posts */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Discussions
            </h2>

            <button
              type="button"
              onClick={fetchPosts}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              Loading discussions...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
              No discussions yet. Be the first
              to ask a question.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {post.subject}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          post.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-gray-800">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      By{" "}
                      {post.createdBy?.name ||
                        "User"}{" "}
                      ·{" "}
                      {post.createdBy?.role ||
                        ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deletePost(post._id)
                    }
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-5 whitespace-pre-wrap leading-7 text-gray-700">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      toggleLike(post._id)
                    }
                    className="text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    👍 {post.likes?.length || 0}
                  </button>

                  <span className="text-sm text-gray-500">
                    💬{" "}
                    {post.comments?.length ||
                      0}{" "}
                    comments
                  </span>
                </div>

                {/* Comments */}
                <div className="mt-5 space-y-3">
                  {post.comments?.map(
                    (comment) => (
                      <div
                        key={comment._id}
                        className="rounded-xl bg-gray-50 p-4"
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {comment.user?.name ||
                            "User"}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {comment.text}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Add comment */}
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={
                      commentText[
                        post._id
                      ] || ""
                    }
                    onChange={(e) =>
                      setCommentText(
                        (prev) => ({
                          ...prev,
                          [post._id]:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="Write a reply..."
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      addComment(post._id)
                    }
                    className="rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
                  >
                    Reply
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionForum;