import { BlogSource, BlogStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type BlogTagView = {
  id: string;
  slug: string;
  label: string;
};

export type BlogCategoryView = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  active: boolean;
  displayOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  categoryId: string | null;
  category: BlogCategoryView | null;
  authorId: string | null;
  authorName: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeyword: string | null;
  seoOgImageUrl: string | null;
  seoNoIndex: boolean;
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
  categoryId?: string | null;
  tagSlugs: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeyword?: string | null;
  seoOgImageUrl?: string | null;
  seoNoIndex?: boolean;
  authorId?: string | null;
};

export type BlogCategoryUpsertInput = {
  slug: string;
  label: string;
  description?: string | null;
  active?: boolean;
  displayOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const globalForBlog = globalThis as unknown as {
  blogPostsMemory?: BlogPostView[];
  blogTagsMemory?: BlogTagView[];
  blogCategoriesMemory?: BlogCategoryView[];
};

const DEFAULT_BLOG_CATEGORIES: BlogCategoryView[] = [
  {
    id: "blog-cat-mercado-imobiliario",
    slug: "mercado-imobiliario",
    label: "Mercado imobiliário",
    description: "Notícias e análises gerais do mercado imobiliário em Palmas e Tocantins.",
    active: true,
    displayOrder: 10,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  },
  {
    id: "blog-cat-lancamentos",
    slug: "lancamentos",
    label: "Lançamentos",
    description: "Novos empreendimentos, pré-lançamentos e oportunidades na planta.",
    active: true,
    displayOrder: 20,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  },
  {
    id: "blog-cat-bairros-de-palmas",
    slug: "bairros-de-palmas",
    label: "Bairros de Palmas",
    description: "Guias e leituras sobre bairros, regiões e infraestrutura de Palmas.",
    active: true,
    displayOrder: 30,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  },
  {
    id: "blog-cat-leiloes",
    slug: "leiloes",
    label: "Leilões",
    description: "Conteúdos sobre imóveis em leilão, riscos, oportunidades e análise documental.",
    active: true,
    displayOrder: 40,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  },
  {
    id: "blog-cat-compra-e-venda",
    slug: "compra-e-venda",
    label: "Compra e venda",
    description: "Orientações práticas para compradores, vendedores e negociação imobiliária.",
    active: true,
    displayOrder: 50,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  },
  {
    id: "blog-cat-investimento",
    slug: "investimento",
    label: "Investimento",
    description: "Conteúdos sobre rentabilidade, liquidez, valorização e tomada de decisão.",
    active: true,
    displayOrder: 60,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date("2026-06-10T12:30:00.000Z"),
    updatedAt: new Date("2026-06-10T12:30:00.000Z")
  }
];

function ensureMemoryStores() {
  if (!globalForBlog.blogPostsMemory) globalForBlog.blogPostsMemory = [];
  if (!globalForBlog.blogTagsMemory) globalForBlog.blogTagsMemory = [];
  if (!globalForBlog.blogCategoriesMemory) {
    globalForBlog.blogCategoriesMemory = DEFAULT_BLOG_CATEGORIES.map((category) => ({
      ...category
    }));
  }
  return {
    posts: globalForBlog.blogPostsMemory,
    tags: globalForBlog.blogTagsMemory,
    categories: globalForBlog.blogCategoriesMemory
  };
}

function slugifyBlogValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const slugifyTag = slugifyBlogValue;

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeDbCategory(category: Prisma.BlogCategoryGetPayload<object>): BlogCategoryView {
  return {
    id: category.id,
    slug: category.slug,
    label: category.label,
    description: category.description,
    active: category.active,
    displayOrder: category.displayOrder,
    seoTitle: category.seoTitle,
    seoDescription: category.seoDescription,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
}

function normalizeDbPost(post: Prisma.BlogPostGetPayload<{
  include: {
    category: true;
    tags: true;
    author: { select: { id: true; name: true } };
  };
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
    categoryId: post.categoryId,
    category: post.category ? normalizeDbCategory(post.category) : null,
    authorId: post.authorId,
    authorName: post.author?.name ?? null,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeyword: post.seoKeyword,
    seoOgImageUrl: post.seoOgImageUrl,
    seoNoIndex: post.seoNoIndex,
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
  const { categories } = ensureMemoryStores();
  const tagSlugs = Array.from(
    new Set(input.tagSlugs.map((slug) => slugifyTag(slug)).filter(Boolean))
  );
  const tags = tagSlugs.map((slug) => ({
    id: `memory-tag-${slug}`,
    slug,
    label: labelFromSlug(slug)
  }));

  const now = new Date();
  const category = categories.find((item) => item.id === input.categoryId) ?? null;
  return {
    id: existing?.id ?? `memory-blog-${Date.now()}`,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    coverImageUrl: input.coverImageUrl ?? null,
    bodyMarkdown: input.bodyMarkdown,
    status: input.status,
    source: input.source,
    categoryId: category?.id ?? null,
    category,
    authorId: input.authorId ?? null,
    authorName: existing?.authorName ?? null,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    seoKeyword: input.seoKeyword ?? null,
    seoOgImageUrl: input.seoOgImageUrl ?? null,
    seoNoIndex: Boolean(input.seoNoIndex),
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
      include: { category: true, tags: true, author: { select: { id: true, name: true } } }
    });
    return posts.map(normalizeDbPost);
  } catch {
    return ensureMemoryStores().posts;
  }
}

function normalizePublishedFilters(filters?: string | { tagSlug?: string; categorySlug?: string }) {
  if (typeof filters === "string") return { tagSlug: filters };
  return filters ?? {};
}

export async function listPublishedBlogPosts(
  limit?: number,
  filters?: string | { tagSlug?: string; categorySlug?: string }
) {
  const { tagSlug, categorySlug } = normalizePublishedFilters(filters);
  if (!hasDatabase) {
    return ensureMemoryStores()
      .posts.filter(
        (post) =>
          post.status === BlogStatus.PUBLISHED &&
          (!categorySlug || post.category?.slug === categorySlug) &&
          (!tagSlug || post.tags.some((tag) => tag.slug === tagSlug))
      )
      .slice(0, limit);
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
        ...(categorySlug ? { category: { slug: categorySlug, active: true } } : {}),
        ...(tagSlug ? { tags: { some: { slug: tagSlug } } } : {})
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      take: limit,
      include: { category: true, tags: true, author: { select: { id: true, name: true } } }
    });
    return posts.map(normalizeDbPost);
  } catch {
    return ensureMemoryStores()
      .posts.filter(
        (post) =>
          post.status === BlogStatus.PUBLISHED &&
          (!categorySlug || post.category?.slug === categorySlug) &&
          (!tagSlug || post.tags.some((tag) => tag.slug === tagSlug))
      )
      .slice(0, limit);
  }
}

export async function listTopViewedBlogPosts(limit = 3) {
  if (!hasDatabase) {
    return ensureMemoryStores()
      .posts.filter((post) => post.status === BlogStatus.PUBLISHED)
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, limit);
  }
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED, views: { gt: 0 } },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: limit,
      include: { category: true, tags: true, author: { select: { id: true, name: true } } }
    });
    return posts.map(normalizeDbPost);
  } catch {
    return [];
  }
}

export async function listCrmBlogCategories() {
  if (!hasDatabase) {
    return ensureMemoryStores().categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }]
    });
    return categories.map(normalizeDbCategory);
  } catch {
    return ensureMemoryStores().categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function listPublishedBlogCategoriesWithCounts() {
  if (!hasDatabase) {
    return ensureMemoryStores()
      .categories.map((category) => ({
        ...category,
        count: ensureMemoryStores().posts.filter(
          (post) => post.status === BlogStatus.PUBLISHED && post.categoryId === category.id
        ).length
      }))
      .filter((category) => category.active && category.count > 0)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const categories = await prisma.blogCategory.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      include: {
        _count: {
          select: { posts: { where: { status: BlogStatus.PUBLISHED } } }
        }
      }
    });
    return categories
      .map((category) => ({ ...normalizeDbCategory(category), count: category._count.posts }))
      .filter((category) => category.count > 0);
  } catch {
    return [];
  }
}

export async function getPublishedBlogCategoryBySlug(slug: string) {
  if (!hasDatabase) {
    return (
      ensureMemoryStores().categories.find(
        (category) => category.slug === slug && category.active
      ) ?? null
    );
  }

  try {
    const category = await prisma.blogCategory.findFirst({
      where: { slug, active: true }
    });
    return category ? normalizeDbCategory(category) : null;
  } catch {
    return (
      ensureMemoryStores().categories.find(
        (category) => category.slug === slug && category.active
      ) ?? null
    );
  }
}

export async function listPublishedBlogTagsWithCounts() {
  if (!hasDatabase) {
    const tagMap = new Map<string, { slug: string; label: string; count: number }>();
    for (const post of ensureMemoryStores().posts.filter(
      (p) => p.status === BlogStatus.PUBLISHED
    )) {
      for (const tag of post.tags) {
        const existing = tagMap.get(tag.slug);
        if (existing) existing.count += 1;
        else tagMap.set(tag.slug, { slug: tag.slug, label: tag.label, count: 1 });
      }
    }
    return [...tagMap.values()].sort((a, b) => b.count - a.count);
  }
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: { posts: { where: { status: BlogStatus.PUBLISHED } } }
        }
      }
    });
    return tags
      .map((tag) => ({ slug: tag.slug, label: tag.label, count: tag._count.posts }))
      .filter((tag) => tag.count > 0)
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

export async function incrementBlogPostViews(slug: string) {
  if (!hasDatabase) {
    const memo = ensureMemoryStores().posts.find((p) => p.slug === slug);
    if (memo) memo.views = (memo.views ?? 0) + 1;
    return;
  }
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  } catch {
    // ignore — slug may not exist
  }
}

export async function subscribeBlogNewsletter(email: string, source?: string) {
  if (!hasDatabase) return { id: "memory", email };
  const normalized = email.trim().toLowerCase();
  return prisma.blogNewsletterSubscriber.upsert({
    where: { email: normalized },
    update: { source: source ?? undefined },
    create: { email: normalized, source: source ?? null }
  });
}

export async function getCrmBlogPostById(id: string) {
  if (!hasDatabase) {
    return ensureMemoryStores().posts.find((post) => post.id === id) ?? null;
  }
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true, tags: true, author: { select: { id: true, name: true } } }
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
      categoryId: input.categoryId ?? null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      seoKeyword: input.seoKeyword ?? null,
      seoOgImageUrl: input.seoOgImageUrl ?? null,
      seoNoIndex: Boolean(input.seoNoIndex),
      authorId: input.authorId ?? null,
      publishedAt: input.status === BlogStatus.PUBLISHED ? new Date() : null,
      tags: tagConnections.length ? { connect: tagConnections } : undefined
    },
    include: { category: true, tags: true, author: { select: { id: true, name: true } } }
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
  if (input.categoryId !== undefined) {
    data.category = input.categoryId
      ? { connect: { id: input.categoryId } }
      : { disconnect: true };
  }
  if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle ?? null;
  if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription ?? null;
  if (input.seoKeyword !== undefined) data.seoKeyword = input.seoKeyword ?? null;
  if (input.seoOgImageUrl !== undefined) data.seoOgImageUrl = input.seoOgImageUrl ?? null;
  if (input.seoNoIndex !== undefined) data.seoNoIndex = input.seoNoIndex;
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
    include: { category: true, tags: true, author: { select: { id: true, name: true } } }
  });
  return normalizeDbPost(post);
}

export async function createBlogCategory(input: BlogCategoryUpsertInput) {
  const normalizedSlug = slugifyBlogValue(input.slug || input.label);
  const now = new Date();

  if (!hasDatabase) {
    const { categories } = ensureMemoryStores();
    const category: BlogCategoryView = {
      id: `memory-category-${normalizedSlug || Date.now()}`,
      slug: normalizedSlug,
      label: input.label,
      description: input.description ?? null,
      active: input.active ?? true,
      displayOrder: input.displayOrder ?? categories.length * 10 + 10,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      createdAt: now,
      updatedAt: now
    };
    categories.push(category);
    return category;
  }

  const category = await prisma.blogCategory.create({
    data: {
      slug: normalizedSlug,
      label: input.label,
      description: input.description ?? null,
      active: input.active ?? true,
      displayOrder: input.displayOrder ?? 0,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null
    }
  });
  return normalizeDbCategory(category);
}

export async function updateBlogCategory(id: string, input: Partial<BlogCategoryUpsertInput>) {
  if (!hasDatabase) {
    const { categories } = ensureMemoryStores();
    const index = categories.findIndex((category) => category.id === id);
    if (index < 0) return null;
    categories[index] = {
      ...categories[index],
      slug: input.slug ? slugifyBlogValue(input.slug) : categories[index].slug,
      label: input.label ?? categories[index].label,
      description:
        input.description !== undefined ? input.description ?? null : categories[index].description,
      active: input.active ?? categories[index].active,
      displayOrder: input.displayOrder ?? categories[index].displayOrder,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle ?? null : categories[index].seoTitle,
      seoDescription:
        input.seoDescription !== undefined
          ? input.seoDescription ?? null
          : categories[index].seoDescription,
      updatedAt: new Date()
    };
    return categories[index];
  }

  try {
    const data: Prisma.BlogCategoryUpdateInput = {};
    if (input.slug !== undefined) data.slug = slugifyBlogValue(input.slug);
    if (input.label !== undefined) data.label = input.label;
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.active !== undefined) data.active = input.active;
    if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;
    if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle ?? null;
    if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription ?? null;

    const category = await prisma.blogCategory.update({
      where: { id },
      data
    });
    return normalizeDbCategory(category);
  } catch {
    return null;
  }
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
