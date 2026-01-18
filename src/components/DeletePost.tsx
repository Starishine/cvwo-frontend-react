import authFetch from "../utils/authFetch";

export default function DeletePost({ postId }: { postId: number }) {

    async function deletePost(postId: number) {
        try {
            const res = await authFetch(`/deletepost/id/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Failed to delete post:', data.error || data.message || 'Unknown error');
            } else {
                console.log('Post deleted successfully');
                window.location.reload();
            }
        } catch (err: any) {
            console.error('An unexpected error occurred:', err.message || err);
        }
    }

    return (
        <button
            onClick={() => deletePost(postId)}
            className="px-[10px] py-[6px] rounded-lg text-red-800 font-semibold hover:bg-red-50 border border-red-200 transition-colors"
        >
            Delete
        </button>
    );
}