export default function DeletePost({ postId }: { postId: string }) {

    async function deletePost(postId: string) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/deletepost/id/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        } finally {
            window.location.reload;
        }
    }

    return (
        <>
            <button onClick={() => { deletePost(postId) }}>Delete Post</button>
        </>
    )
}