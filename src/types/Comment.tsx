/*  Defines the Comment interface used throughout the application
    Reply interface uses the same fields as Comment with additional parent_id field
 */

export interface Comment {
    ID: number
    post_id: number
    comment: string
    author: string
    CreatedAt: string
    parent_id: number
}