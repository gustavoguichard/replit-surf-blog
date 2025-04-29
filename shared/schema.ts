import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, type InferSelectModel } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Authors table
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  role: text("role").notNull(),
  socialTwitter: text("social_twitter"),
  socialInstagram: text("social_instagram"),
  socialLinkedin: text("social_linkedin"),
  socialYoutube: text("social_youtube"),
  socialTiktok: text("social_tiktok"),
  socialBehance: text("social_behance"),
});

// Relations will be added later after all tables are defined

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  postCount: integer("post_count").default(0),
});

// Relations will be added later

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Relations will be added later

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull(),
  authorId: integer("author_id").notNull().references(() => authors.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  viewCount: integer("view_count").default(0),
  readTime: integer("read_time").notNull(),
  featured: boolean("featured").default(false),
});

// Relations will be added later

// Post Tags relation table
export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

// Relations will be added later

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").notNull().references(() => posts.id),
  authorId: integer("author_id").references(() => authors.id),
  userName: text("user_name"),
  userEmail: text("user_email"),
  userAvatar: text("user_avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  parentId: integer("parent_id").references(() => comments.id),
  likes: integer("likes").default(0),
});

// Relations will be added after all tables are defined

// Newsletter subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// Schema for inserting and validating
export const insertAuthorSchema = createInsertSchema(authors).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, postCount: true });
export const insertTagSchema = createInsertSchema(tags).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, viewCount: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true, likes: true });
export const insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, subscribedAt: true });
export const insertPostTagSchema = createInsertSchema(postTags).omit({ id: true });

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Types for each model
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = z.infer<typeof insertPostTagSchema>;

// Extended types with relations
export type PostWithRelations = Post & { 
  author: Author; 
  category: Category;
  tags?: Tag[];
  comments?: Comment[];
};

export type CommentWithAuthor = Comment & {
  author?: Author;
  replies?: CommentWithAuthor[];
};

export type CategoryWithCount = Category & {
  postCount: number;
};

// Define all relations after all tables are defined
export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  comments: many(comments),
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(authors, {
    fields: [comments.authorId],
    references: [authors.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, { relationName: "parent_child" }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
}));
