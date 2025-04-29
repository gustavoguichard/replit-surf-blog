import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAuthorSchema, insertCategorySchema, insertPostSchema, 
  insertCommentSchema, insertSubscriberSchema, insertTagSchema
} from "@shared/schema";
import { z, ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Tags routes
  app.get("/api/tags", async (_req: Request, res: Response) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.get("/api/tags/popular", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const tags = await storage.getPopularTags(limit);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular tags" });
    }
  });

  app.get("/api/tags/:slug", async (req: Request, res: Response) => {
    try {
      const tag = await storage.getTagBySlug(req.params.slug);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json(tag);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tag" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const posts = await storage.getPosts(page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const posts = await storage.getFeaturedPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/posts/latest", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const posts = await storage.getLatestPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest posts" });
    }
  });

  app.get("/api/posts/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const results = await storage.searchPosts(query, page, limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search posts" });
    }
  });

  app.get("/api/posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Increment view count
      await storage.incrementPostViewCount(post.id);
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/category/:slug", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const posts = await storage.getPostsByCategorySlug(req.params.slug, page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by category" });
    }
  });

  app.get("/api/posts/tag/:slug", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const posts = await storage.getPostsByTagSlug(req.params.slug, page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by tag" });
    }
  });

  // Authors routes
  app.get("/api/authors", async (_req: Request, res: Response) => {
    try {
      const authors = await storage.getAuthors();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch authors" });
    }
  });

  app.get("/api/authors/featured", async (_req: Request, res: Response) => {
    try {
      const author = await storage.getFeaturedAuthor();
      if (!author) {
        return res.status(404).json({ message: "No featured author found" });
      }
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured author" });
    }
  });

  app.get("/api/authors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const author = await storage.getAuthor(id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch author" });
    }
  });

  app.get("/api/authors/:id/posts", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const posts = await storage.getPostsByAuthor(id, page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch author posts" });
    }
  });

  // Comments routes
  app.get("/api/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const comments = await storage.getComments(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req: Request, res: Response) => {
    try {
      const schema = insertCommentSchema.extend({
        content: z.string().min(1, "Comment cannot be empty"),
        postId: z.number().int().positive(),
        userName: z.string().min(2).optional(),
        userEmail: z.string().email().optional(),
      });
      
      const parsedComment = schema.parse(req.body);
      const comment = await storage.createComment(parsedComment);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  app.post("/api/comments/:id/like", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.likeComment(id);
      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const schema = insertSubscriberSchema.extend({
        email: z.string().email("Invalid email address"),
      });
      
      const parsedSubscriber = schema.parse(req.body);
      const subscriber = await storage.createSubscriber(parsedSubscriber);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email", errors: error.format() });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
