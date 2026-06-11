import { CrmBlogManager } from "@/components/crm/blog-manager";
import { listCrmBlogCategories, listCrmBlogPosts } from "@/lib/data/blog";

export default async function CrmBlogListPage() {
  const [posts, categories] = await Promise.all([
    listCrmBlogPosts(),
    listCrmBlogCategories()
  ]);

  return <CrmBlogManager posts={posts} categories={categories} />;
}
