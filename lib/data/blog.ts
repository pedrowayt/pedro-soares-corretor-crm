import { BlogSource, BlogStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type BlogTagView = {
  id: string;
  slug: string;
  label: string;
};

export type BlogPostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  bodyMarkdown: string;
  status: BlogStatus;
  source: BlogSource;
  authorId: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  tags: BlogTagView[];
};

export type BlogPostUpsertInput = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string | null;
  bodyMarkdown: string;
  status: BlogStatus;
  source: BlogSource;
  tagSlugs: string[];
  authorId?: string | null;
};

const globalForBlog = globalThis as unknown as {
  blogPostsMemory?: BlogPostView[];
  blogTagsMemory?: BlogTagView[];
};

function ensureMemoryStores() {
  if (!globalForBlog.blogPostsMemory) globalForBlog.blogPostsMemory = [];
  if (!globalForBlog.blogTagsMemory) globalForBlog.blogTagsMemory = [];
  return {
    posts: globalForBlog.blogPostsMemory,
    tags: globalForBlog.blogTagsMemory
  };
}

function slugifyTag(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeDbPost(post: Prisma.BlogPostGetPayload<{
  include: { tags: true; author: { select: { id: true; name: true } } };
}>): BlogPostView {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl,
    bodyMarkdown: post.bodyMarkdown,
    status: post.status,
    source: post.source,
    authorId: post.authorId,
    authorName: post.author?.name ?? null,
    publishedAt: post.publishedAt,
    views: post.views,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    tags: post.tags.map((tag) => ({ id: tag.id, slug: tag.slug, label: tag.label }))
  };
}

async function ensureTagIds(tagSlugs: string[]) {
  const normalized = Array.from(
    new Set(tagSlugs.map((slug) => slugifyTag(slug)).filter(Boolean))
  );
  if (!normalized.length) return [];

  const existing = await prisma.blogTag.findMany({
    where: { slug: { in: normalized } }
  });
  const existingSlugs = new Set(existing.map((tag) => tag.slug));
  const toCreate = normalized.filter((slug) => !existingSlugs.has(slug));

  if (toCreate.length) {
    await prisma.blogTag.createMany({
      data: toCreate.map((slug) => ({ slug, label: labelFromSlug(slug) })),
      skipDuplicates: true
    });
  }

  const all = await prisma.blogTag.findMany({
    where: { slug: { in: normalized } }
  });
  return all.map((tag) => ({ id: tag.id }));
}

function buildMemoryPost(input: BlogPostUpsertInput, existing?: BlogPostView): BlogPostView {
  const tagSlugs = Array.from(
    new Set(input.tagSlugs.map((slug) => slugifyTag(slug)).filter(Boolean))
  );
  const tags = tagSlugs.map((slug) => ({
    id: `memory-tag-${slug}`,
    slug,
    label: labelFromSlug(slug)
  }));

  const now = new Date();
  return {
    id: existing?.id ?? `memory-blog-${Date.now()}`,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    coverImageUrl: input.coverImageUrl ?? null,
    bodyMarkdown: input.bodyMarkdown,
    status: input.status,
    source: input.source,
    authorId: input.authorId ?? null,
    authorName: existing?.authorName ?? null,
    publishedAt:
      input.status === BlogStatus.PUBLISHED ? existing?.publishedAt ?? now : null,
    views: existing?.views ?? 0,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    tags
  };
}

export async function listCrmBlogPosts() {
  if (!hasDatabase) return ensureMemoryStores().posts;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { tags: true, author: { select: { id: true, name: true } } }
    });
    return posts.map(normalizeDbPost);
  } catch {
    return ensureMemoryStores().posts;
  }
}

export async function listPublishedBlogPosts(limit?: number) {
  if (!hasDatabase) {
    return ensureMemoryStores()
      .posts.filter((post) => post.status === BlogStatus.PUBLISHED)
      .slice(0, limit);
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take: limit,
      include: { tags: true, author: { select: { id: true, name: true } } }
    });
    return posts.map(normalizeDbPost);
  } catch {
    return ensureMemoryStores()
      .posts.filter((post) => post.status === BlogStatus.PUBLISHED)
      .slice(0, limit);
  }
}

export async function getCrmBlogPostById(id: string) {
  if (!hasDatabase) {
    return ensureMemoryStores().posts.find((post) => post.id === id) ?? null;
  }
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true, author: { select: { id: true, name: true } } }
    });
    return post ? normalizeDbPost(post) : null;
  } catch {
    return ensureMemoryStores().posts.find((post) => post.id === id) ?? null;
  }
}

export async function createBlogPost(input: BlogPostUpsertInput) {
  if (!hasDatabase) {
    const { posts } = ensureMemoryStores();
    const created = buildMemoryPost(input);
    posts.unshift(created);
    return created;
  }

  const tagConnections = await ensureTagIds(input.tagSlugs);

  const post = await prisma.blogPost.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      coverImageUrl: input.coverImageUrl ?? null,
      bodyMarkdown: input.bodyMarkdown,
      status: input.status,
      source: input.source,
      authorId: input.authorId ?? null,
      publishedAt: input.status === BlogStatus.PUBLISHED ? new Date() : null,
      tags: tagConnections.length ? { connect: tagConnections } : undefined
    },
    include: { tags: true, author: { select: { id: true, name: true } } }
  });
  return normalizeDbPost(post);
}

export async function updateBlogPost(id: string, input: Partial<BlogPostUpsertInput>) {
  if (!hasDatabase) {
    const { posts } = ensureMemoryStores();
    const index = posts.findIndex((post) => post.id === id);
    if (index < 0) return null;
    const merged = {
      ...posts[index],
      ...input,
      tagSlugs:
        input.tagSlugs ?? posts[index].tags.map((tag) => tag.slug)
    } as BlogPostUpsertInput;
    posts[index] = buildMemoryPost(merged, posts[index]);
    return posts[index];
  }

  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) return null;

  const data: Prisma.BlogPostUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.coverImageUrl !== undefined) data.coverImageUrl = input.coverImageUrl ?? null;
  if (input.bodyMarkdown !== undefined) data.bodyMarkdown = input.bodyMarkdown;
  if (input.source !== undefined) data.source = input.source;
  if (input.authorId !== undefined) {
    data.author = input.authorId
      ? { connect: { id: input.authorId } }
      : { disconnect: true };
  }
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === BlogStatus.PUBLISHED && !current.publishedAt) {
      data.publishedAt = new Date();
    }
    if (input.status === BlogStatus.DRAFT) {
      data.publishedAt = null;
    }
  }

  if (input.tagSlugs !== undefined) {
    const tagConnections = await ensureTagIds(input.tagSlugs);
    data.tags = { set: tagConnections };
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
    include: { tags: true, author: { select: { id: true, name: true } } }
  });
  return normalizeDbPost(post);
}

export async function deleteBlogPost(id: string) {
  if (!hasDatabase) {
    const { posts } = ensureMemoryStores();
    const index = posts.findIndex((post) => post.id === id);
    if (index < 0) return false;
    posts.splice(index, 1);
    return true;
  }
  try {
    await prisma.blogPost.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
