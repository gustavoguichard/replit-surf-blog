import { 
  insertAuthorSchema, insertCategorySchema, insertPostSchema, 
  insertCommentSchema, insertSubscriberSchema, insertTagSchema, 
  insertPostTagSchema, insertUserSchema, type Author, type InsertAuthor, type Category, 
  type InsertCategory, type Post, type InsertPost, type Comment, 
  type InsertComment, type Tag, type InsertTag, type PostTag, 
  type InsertPostTag, type Subscriber, type InsertSubscriber, type User, type InsertUser,
  type PostWithRelations, type CommentWithAuthor, type CategoryWithCount
} from "@shared/schema";
import { 
  authors, categories, comments, posts, tags, postTags, subscribers, users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or, sql, isNull, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Author methods
  getAuthors(): Promise<Author[]>;
  getAuthor(id: number): Promise<Author | undefined>;
  getAuthorByUsername(username: string): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  getFeaturedAuthor(): Promise<Author | undefined>;
  
  // Category methods
  getCategories(): Promise<CategoryWithCount[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryPostCount(categoryId: number): Promise<void>;
  
  // Tag methods
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  getPostTags(postId: number): Promise<Tag[]>;
  addTagToPost(postTag: InsertPostTag): Promise<PostTag>;
  getPopularTags(limit?: number): Promise<Tag[]>;
  
  // Post methods
  getPosts(page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  getPost(id: number): Promise<PostWithRelations | undefined>;
  getPostBySlug(slug: string): Promise<PostWithRelations | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  getFeaturedPosts(limit?: number): Promise<PostWithRelations[]>;
  getLatestPosts(limit?: number): Promise<PostWithRelations[]>;
  getPostsByCategory(categoryId: number, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  getPostsByCategorySlug(slug: string, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  getPostsByAuthor(authorId: number, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  getPostsByTag(tagId: number, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  getPostsByTagSlug(slug: string, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  searchPosts(query: string, page?: number, limit?: number): Promise<{ posts: PostWithRelations[], total: number }>;
  incrementPostViewCount(postId: number): Promise<void>;
  
  // Comment methods
  getComments(postId: number): Promise<CommentWithAuthor[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  likeComment(id: number): Promise<void>;
  
  // Newsletter methods
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Author methods
  async getAuthors(): Promise<Author[]> {
    return await db.select().from(authors);
  }
  
  async getAuthor(id: number): Promise<Author | undefined> {
    const [author] = await db.select().from(authors).where(eq(authors.id, id));
    return author || undefined;
  }
  
  async getAuthorByUsername(username: string): Promise<Author | undefined> {
    const [author] = await db.select().from(authors).where(eq(authors.username, username));
    return author || undefined;
  }
  
  async createAuthor(author: InsertAuthor): Promise<Author> {
    const [newAuthor] = await db.insert(authors).values(author).returning();
    return newAuthor;
  }
  
  async getFeaturedAuthor(): Promise<Author | undefined> {
    // For simplicity, returning the author with most posts
    const result = await db.execute(sql`
      SELECT a.*, COUNT(p.id) as post_count 
      FROM authors a 
      JOIN posts p ON a.id = p.author_id 
      GROUP BY a.id 
      ORDER BY post_count DESC 
      LIMIT 1
    `);
    
    return result.rows[0] as Author || undefined;
  }
  
  // Category methods
  async getCategories(): Promise<CategoryWithCount[]> {
    const results = await db.execute(sql`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    
    return results.rows as CategoryWithCount[];
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  async updateCategoryPostCount(categoryId: number): Promise<void> {
    const count = await db.select({ count: sql`count(*)` })
      .from(posts)
      .where(eq(posts.categoryId, categoryId));
      
    await db.update(categories)
      .set({ postCount: Number(count[0].count) })
      .where(eq(categories.id, categoryId));
  }
  
  // Tag methods
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag || undefined;
  }
  
  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag || undefined;
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }
  
  async getPostTags(postId: number): Promise<Tag[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug
      })
      .from(tags)
      .innerJoin(postTags, eq(tags.id, postTags.tagId))
      .where(eq(postTags.postId, postId));
      
    return result;
  }
  
  async addTagToPost(postTag: InsertPostTag): Promise<PostTag> {
    const [newPostTag] = await db.insert(postTags).values(postTag).returning();
    return newPostTag;
  }
  
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    const result = await db.execute(sql`
      SELECT t.*, COUNT(pt.post_id) as usage_count
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY usage_count DESC
      LIMIT ${limit}
    `);
    
    return result.rows as Tag[];
  }
  
  // Post methods
  async getPosts(page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const offset = (page - 1) * limit;
    
    const totalResult = await db.select({ count: sql`count(*)` }).from(posts);
    const total = Number(totalResult[0].count);
    
    const postsResult = await db.select()
      .from(posts)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.publishedAt));
      
    const postsWithRelations = await this.addRelationsToMultiplePosts(postsResult);
    
    return { posts: postsWithRelations, total };
  }
  
  async getPost(id: number): Promise<PostWithRelations | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) return undefined;
    
    return await this.addRelationsToPost(post);
  }
  
  async getPostBySlug(slug: string): Promise<PostWithRelations | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    if (!post) return undefined;
    
    return await this.addRelationsToPost(post);
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    await this.updateCategoryPostCount(newPost.categoryId);
    return newPost;
  }
  
  async getFeaturedPosts(limit: number = 3): Promise<PostWithRelations[]> {
    const postsResult = await db.select()
      .from(posts)
      .where(eq(posts.featured, true))
      .limit(limit)
      .orderBy(desc(posts.publishedAt));
      
    return await this.addRelationsToMultiplePosts(postsResult);
  }
  
  async getLatestPosts(limit: number = 5): Promise<PostWithRelations[]> {
    const postsResult = await db.select()
      .from(posts)
      .limit(limit)
      .orderBy(desc(posts.publishedAt));
      
    return await this.addRelationsToMultiplePosts(postsResult);
  }
  
  async getPostsByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const offset = (page - 1) * limit;
    
    const totalResult = await db.select({ count: sql`count(*)` })
      .from(posts)
      .where(eq(posts.categoryId, categoryId));
    const total = Number(totalResult[0].count);
    
    const postsResult = await db.select()
      .from(posts)
      .where(eq(posts.categoryId, categoryId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.publishedAt));
      
    const postsWithRelations = await this.addRelationsToMultiplePosts(postsResult);
    
    return { posts: postsWithRelations, total };
  }
  
  async getPostsByCategorySlug(slug: string, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return { posts: [], total: 0 };
    
    return await this.getPostsByCategory(category.id, page, limit);
  }
  
  async getPostsByAuthor(authorId: number, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const offset = (page - 1) * limit;
    
    const totalResult = await db.select({ count: sql`count(*)` })
      .from(posts)
      .where(eq(posts.authorId, authorId));
    const total = Number(totalResult[0].count);
    
    const postsResult = await db.select()
      .from(posts)
      .where(eq(posts.authorId, authorId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.publishedAt));
      
    const postsWithRelations = await this.addRelationsToMultiplePosts(postsResult);
    
    return { posts: postsWithRelations, total };
  }
  
  async getPostsByTag(tagId: number, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const offset = (page - 1) * limit;
    
    // First get post IDs that have this tag
    const postIdResult = await db.select({ postId: postTags.postId })
      .from(postTags)
      .where(eq(postTags.tagId, tagId));
      
    const postIds = postIdResult.map(p => p.postId);
    
    if (postIds.length === 0) {
      return { posts: [], total: 0 };
    }
    
    const total = postIds.length;
    
    const postsResult = await db.select()
      .from(posts)
      .where(inArray(posts.id, postIds))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.publishedAt));
      
    const postsWithRelations = await this.addRelationsToMultiplePosts(postsResult);
    
    return { posts: postsWithRelations, total };
  }
  
  async getPostsByTagSlug(slug: string, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const tag = await this.getTagBySlug(slug);
    if (!tag) return { posts: [], total: 0 };
    
    return await this.getPostsByTag(tag.id, page, limit);
  }
  
  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<{ posts: PostWithRelations[], total: number }> {
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;
    
    const totalResult = await db.select({ count: sql`count(*)` })
      .from(posts)
      .where(
        or(
          like(posts.title, searchTerm),
          like(posts.excerpt, searchTerm),
          like(posts.content, searchTerm)
        )
      );
      
    const total = Number(totalResult[0].count);
    
    const postsResult = await db.select()
      .from(posts)
      .where(
        or(
          like(posts.title, searchTerm),
          like(posts.excerpt, searchTerm),
          like(posts.content, searchTerm)
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(posts.publishedAt));
      
    const postsWithRelations = await this.addRelationsToMultiplePosts(postsResult);
    
    return { posts: postsWithRelations, total };
  }
  
  async incrementPostViewCount(postId: number): Promise<void> {
    await db.update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, postId));
  }
  
  // Comment methods
  async getComments(postId: number): Promise<CommentWithAuthor[]> {
    // Get all comments for the post
    const allComments = await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
      
    // Organize into a hierarchical structure
    const commentMap = new Map<number, CommentWithAuthor>();
    const rootComments: CommentWithAuthor[] = [];
    
    // First pass: create map of all comments
    for (const comment of allComments) {
      const commentWithAuthor = { ...comment, replies: [] } as CommentWithAuthor;
      
      // Add author information if available
      if (comment.authorId) {
        const author = await this.getAuthor(comment.authorId);
        if (author) {
          commentWithAuthor.author = author;
        }
      }
      
      commentMap.set(comment.id, commentWithAuthor);
    }
    
    // Second pass: organize into tree structure
    for (const comment of Array.from(commentMap.values())) {
      if (comment.parentId) {
        // This is a reply, add it to its parent
        const parent = commentMap.get(comment.parentId);
        if (parent && parent.replies) {
          parent.replies.push(comment);
        }
      } else {
        // This is a root comment
        rootComments.push(comment);
      }
    }
    
    return rootComments;
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }
  
  async likeComment(id: number): Promise<void> {
    await db.update(comments)
      .set({ likes: sql`${comments.likes} + 1` })
      .where(eq(comments.id, id));
  }
  
  // Newsletter methods
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values(subscriber).returning();
    return newSubscriber;
  }
  
  // Helper methods for loading relations
  private async addRelationsToPost(post: Post): Promise<PostWithRelations> {
    const author = await this.getAuthor(post.authorId);
    const category = await this.getCategory(post.categoryId);
    const postTags = await this.getPostTags(post.id);
    
    if (!author || !category) {
      throw new Error(`Missing required relations for post ${post.id}`);
    }
    
    return {
      ...post,
      author,
      category,
      tags: postTags
    };
  }
  
  private async addRelationsToMultiplePosts(posts: Post[]): Promise<PostWithRelations[]> {
    return Promise.all(posts.map(post => this.addRelationsToPost(post)));
  }
}

export const storage = new DatabaseStorage();
